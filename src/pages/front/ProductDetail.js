import { useCallback, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Toast from '../../components/Toast';
import UpdateQtyBtnGroup from '../../components/UpdateQtyBtnGroup';
import Loading from '../../components/Loading'; // 假設你有全螢幕 Loading
import { useDispatch } from 'react-redux';
import { createAsyncMessage } from '../../reduce/slice/toastSlice';
import { getCart } from '../../reduce/slice/cartSlice';

const baseUrl = process.env.REACT_APP_API_URL;
const apiPath = process.env.REACT_APP_API_PATH;

function ProductDetail() {
  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // 頁面初次載入
  
  // 修正點：使用物件分別管理兩個按鈕的 Loading
  const [isActionLoading, setIsActionLoading] = useState({
    addCart: false,
    buyNow: false,
  });

  const { id: product_id } = useParams();
  const [activeTab, setActiveTab] = useState('product-intro');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. 取得產品詳細資料
  const getProductDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/product/${product_id}`);
      setProduct(res.data.product);
    } catch (error) {
      dispatch(createAsyncMessage({
        text: error.response?.data?.message || '取得產品失敗',
        type: '錯誤',
        status: 'failed',
      }));
    } finally {
      setIsLoading(false);
    }
  }, [product_id, dispatch]);

  useEffect(() => {
    getProductDetail();
  }, [getProductDetail]);

  // 2. 合併動作邏輯 (加入購物車與立即購買)
  const handleAddToCart = async (isNavigate = false) => {

    // 根據按鈕類型開啟對應 Loading
    const loadingKey = isNavigate ? 'buyNow' : 'addCart';
    setIsActionLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      const res = await axios.post(`${baseUrl}/v2/api/${apiPath}/cart`, {
        data: { product_id, qty: Number(qtySelect) },
      });

      dispatch(createAsyncMessage({
        text: res.data.message,
        type: '成功',
        status: 'success',
      }));

      // 更新 Navbar 購物車數量
      dispatch(getCart());

      if (isNavigate) {
        navigate('/cart');
      }
    } catch (error) {
      dispatch(createAsyncMessage({
        text: error.response?.data?.message || '操作失敗',
        type: '錯誤',
        status: 'failed',
      }));
    } finally {
      // 修正點：關閉對應 Loading
      setIsActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const tabs = [
    { id: 'product-intro', label: '商品介紹' },
    { id: 'product-desc', label: '詳細說明' },
    { id: 'product-distribute', label: '送貨及付款方式' },
  ];

  return (
    <>
    {isLoading && <Loading isFullPage isLoading={isLoading} />}

      <div className='container'>
        <div className='row justify-content-between mt-4 mb-7'>
          {/* --- 左半部：商品圖 --- */}
          <div className='col-md-5'>
            <div className='my-4'>
              <img 
                src={product.imageUrl} 
                className='img-fluid mt-4 object-cover rounded shadow-sm' 
                alt={product.title}
                style={{ height: '480px', width: '100%' }} 
              />
            </div>
          </div>

          {/* --- 右半部：資訊與按鈕 --- */}
          <div className='col-md-7 mt-5'>
            <div className="d-flex flex-column justify-content-between h-100">
              <div>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-2">
                    <li className="breadcrumb-item"><Link to='/'>首頁</Link></li>
                    <li className="breadcrumb-item">
                      <Link to={`/products/${product.category}`}>{product.category}</Link>
                    </li>
                    <li className="breadcrumb-item active">{product.title}</li>
                  </ol>
                </nav>

                <h1 className="fs-1 mb-1 py-2 fw-bold">{product.title}</h1>
                <p className="mb-3 text-muted fw-normal fs-6">{product.sub_title}</p>
                <p className='text-gray mb-4'>{product.content}</p>

                {/* 修正點：價格對齊優化 */}
                <div className="d-flex align-items-baseline mb-3">
                  <span className="text-danger fs-4 fw-bold me-3">
                    NT${product.price?.toLocaleString()}
                  </span>
                  <del className="text-muted fs-6">
                    NT${product.origin_price?.toLocaleString()}
                  </del>
                </div>
                
                {product.is_frozen && (
                  <div className="mb-3">
                    <span className="badge bg-info text-white">❄️ 低溫冷凍商品</span>
                  </div>
                )}
              </div>

              {/* --- 數量與按鈕區 --- */}
              <div className='pb-3 mt-4'>
                <div className="mb-4" style={{ width: '160px' }}>
                  <UpdateQtyBtnGroup 
                    itemQty={qtySelect}
                    onClickfn1={() => setQtySelect(prev => Math.max(1, prev - 1))}
                    onClickfn2={() => setQtySelect(prev => prev + 1)}
                  />
                </div>

                {/* 外層 div 限制最大寬度為 400px，並置左 (如果要置中可加 mx-auto) */}
                <div className="row g-2" style={{ maxWidth: '400px' }}> {/* g-2 是間距 */}
                  <div className="col-6">
                    <button
                      type='button'
                      className='btn btn-outline-primary w-100 py-2 fs-6 fw-bold shadow-sm'
                      style={{ borderRadius: '8px' }}
                      onClick={() => handleAddToCart(false)}
                      disabled={isActionLoading.addCart || isActionLoading.buyNow}
                    >
                      {isActionLoading.addCart ? '處理中' : '加入購物車'}
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type='button'
                      className='btn btn-primary w-100 py-2 fs-6 fw-bold text-white shadow-sm'
                      style={{ borderRadius: '8px' }}
                      onClick={() => handleAddToCart(true)}
                      disabled={isActionLoading.addCart || isActionLoading.buyNow}
                    >
                      {isActionLoading.buyNow ? '跳轉中' : '立即購買'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 下半部：詳細資訊頁籤 --- */}
        <div className="container mt-5">
          <nav className="border-bottom">
            <ul className="nav d-flex justify-content-between">
              {tabs.map((tab) => (
                <li className="nav-item flex-fill text-center" key={tab.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`custom-tab-link w-100 py-3 ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="py-5">
            {activeTab === 'product-intro' && (
              <div className="animate__animated animate__fadeIn">
                <h4 className="mb-4 fw-bold">商品介紹</h4>
                <p className="lh-lg" style={{ whiteSpace: 'pre-line' }}>{product.description || '暫無介紹'}</p>
              </div>
            )}

            {activeTab === 'product-desc' && (
              <div className="animate__animated animate__fadeIn">
                <h4 className="mb-4 fw-bold">詳細說明</h4>
                <p className="lh-lg">{product.content || '200g / 包'}</p>
              </div>
            )}

            {activeTab === 'product-distribute' && (
              <div className="animate__animated animate__fadeIn">
                <h4 className="mb-4 fw-bold">送貨及付款方式</h4>
                <ul className="list-unstyled lh-lg">
                  <li className="mb-2">🚚 全館滿 $1,000 免運</li>
                  <li className="mb-2">❄️ 低溫冷凍快速宅配</li>
                  <li className="mb-2">💳 支援信用卡、LINE Pay、超商付款</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toast />
    </>
  );
}

export default ProductDetail;