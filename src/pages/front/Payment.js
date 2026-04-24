import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCallback, useEffect, useState, useMemo } from 'react';
import Toast from '../../components/Toast';
import { createAsyncMessage } from '../../reduce/slice/toastSlice';
import { useDispatch } from 'react-redux';

const baseUrl = process.env.REACT_APP_API_URL;
const apiPath = process.env.REACT_APP_API_PATH;

function Payment() {
  const { orderId: urlOrderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();

  // 計算金額邏輯：使用 useMemo 確保效能
  // originTotal: 所有產品原價(total)的加總
  // actualTotal: 訂單最終應付金額(orderData.total)
  const { originTotal, discountAmount } = useMemo(() => {
    if (!orderData || !orderData.products) return { originTotal: 0, discountAmount: 0 };
    
    const origin = Object.values(orderData.products).reduce((acc, item) => acc + item.total, 0);
    const actual = orderData.total;
    return {
      originTotal: origin,
      discountAmount: origin - actual > 0 ? origin - actual : 0,
    };
  }, [orderData]);

  const payOrder = useCallback(async (id) => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      const res = await axios.post(`${baseUrl}/v2/api/${apiPath}/pay/${id}`);
      if (res.data.success) {
        setOrderData(prev => prev ? { ...prev, is_paid: true } : null);
        dispatch(createAsyncMessage({ text: '付款成功', status: 'success' }));
      }
    } catch (error) {
      if (error.response?.status !== 400) {
        dispatch(createAsyncMessage({ text: '付款失敗', status: 'failed' }));
      }
    } finally {
      setIsProcessing(false);
    }
  }, [dispatch, isProcessing]);

  const getOrderData = useCallback(async (id) => {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/order/${id}`);
      if (res.data.success) {
        const order = res.data.order;
        setOrderData(order);
        if (order && !order.is_paid) {
          await payOrder(id);
        }
      }
    } catch (error) {
      console.error('取得訂單失敗', error);
    }
  }, [payOrder]);

  const init = useCallback(async () => {
    setIsLoading(true);
    try {
      if (urlOrderId) {
        await getOrderData(urlOrderId);
      } else {
        const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/orders`);
        if (res.data.orders?.length > 0) {
          const latestOrder = res.data.orders[0];
          setOrderData(latestOrder);
          if (latestOrder && !latestOrder.is_paid) {
            await payOrder(latestOrder.id);
          }
        }
      }
    } catch (error) {
      dispatch(createAsyncMessage({ text: '讀取訂單失敗', status: 'failed' }));
    } finally {
      setIsLoading(false);
    }
  }, [urlOrderId, getOrderData, payOrder, dispatch]);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return (
    <div className="payment-loading-wrap">
      <div className="spinner-grow" style={{ color: '#7BA07C' }} role="status"></div>
    </div>
  );

  if (!orderData) return <div className="container py-10 text-center"><h4>找不到訂單</h4></div>;

  return (
    <div className="payment-page-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            
            <div className="text-center mb-5">
              <div className="payment-success-icon mb-3">
                <i className="bi bi-patch-check-fill"></i>
              </div>
              <h2 className="payment-title">訂購完成</h2>
              <div className="payment-id-badge">
                <span className="text-muted small me-2">訂單編號</span>
                <code className="fw-bold">{orderData.id}</code>
              </div>
            </div>

            <div className="payment-card shadow-sm border-0 mb-5 bg-white">
              <div className="card-header bg-white border-0 pt-4 px-4">
                <h5 className="fw-bold mb-2">
                  <i className="bi bi-cart-check me-2" style={{ color: '#7BA07C' }}></i>購買項目
                </h5>
              </div>
              <div className="card-body px-4">
                
                <div className="product-list-container p-3 rounded">
                  {Object.values(orderData.products || {}).map((item) => (
                    <div key={item.id} className="product-item-row py-3 border-bottom border-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="mb-0 fw-bold text-dark">{item.product.title}</p>
                          <small className="text-muted">數量：{item.qty} {item.product.unit}</small>
                        </div>
                        <div className="text-end">
                          {/* 若有折扣，顯示原始價格刪除線 */}
                          {item.total !== item.final_total && (
                            <div className="text-muted small text-decoration-line-through">
                              NT$ {Math.round(item.total).toLocaleString()}
                            </div>
                          )}
                          <span className="fw-bold" style={{ color: '#7BA07C' }}>
                            NT$ {Math.round(item.final_total).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 px-2">
                  {/* 付款狀態 */}
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">付款狀態</span>
                    <span className={`fw-bold small ${orderData.is_paid ? 'text-success' : 'text-danger'}`}>
                      {orderData.is_paid ? '● 已完成付款' : '○ 處理中'}
                    </span>
                  </div>

                  {/* 商品原價總計 */}
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">商品原價</span>
                    <span className="text-muted small">
                      NT$ {Math.round(originTotal).toLocaleString()}
                    </span>
                  </div>

                  {/* 折扣金額 (僅在有折扣時顯示) */}
                  {discountAmount > 0 && (
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-danger small">折扣金額</span>
                      <span className="text-danger small">
                        - NT$ {Math.round(discountAmount).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* 最後實付總計 */}
                  <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-2">
                    <span className="fw-bold fs-5">應付金額</span>
                    <span className="payment-total-price">
                      NT$ {Math.round(orderData.total).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pb-5">
              <Link to="/products" className="btn btn-primary-custom px-5 py-3 rounded-pill fw-bold shadow">
                返回商店首頁
              </Link>
            </div>

          </div>
        </div>
      </div>
      <Toast />
    </div>
  );
}

export default Payment;