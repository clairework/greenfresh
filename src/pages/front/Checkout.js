import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from '../../components/FormElements';
import axios from 'axios';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { createAsyncMessage } from '../../reduce/slice/toastSlice';
import { useDispatch } from 'react-redux';
import { clearCartData } from '../../reduce/slice/cartSlice';
import Toast from '../../components/Toast';

const baseUrl = process.env.REACT_APP_API_URL;
const apiPath = process.env.REACT_APP_API_PATH;

function Checkout() {
  const [cartList, setCartList] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('atm'); // 1. 預設 ATM
  const [couponCode, setCouponCode] = useState('fresh2026'); // 2. 預設優惠券代碼
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      name: '',
      tel: '',
      address: '',
      message: '',
    },
    mode: 'onTouched',
  });

  // --- API 邏輯 ---

  // 取得購物車清單
  const getCartList = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/cart`);
      setCartList(res.data.data);
    } catch (error) {
      const message = error.response?.data?.message || '取得購物車失敗';
      dispatch(
        createAsyncMessage({
          text: message,
          type: '取得購物車資訊失敗',
          status: 'failed',
        })
      );
    }
  }, [dispatch]);

  // 送出訂單
  const onSubmit = handleSubmit((data) => {
    const { name, email, tel, address, message } = data;
    const orderData = {
      data: {
        user: { name, email, tel, address },
        message,
      },
    };
    placeOrder(orderData);
  });

  const placeOrder = async (payload) => {
    try {
      await axios.post(`${baseUrl}/v2/api/${apiPath}/order`, payload);
      dispatch(clearCartData());
      navigate('/payment');
    } catch (error) {
      const message = error.response?.data?.message || '結帳失敗';
      dispatch(
        createAsyncMessage({
          text: message,
          type: '結帳失敗',
          status: 'failed',
        })
      );
    }
  };

  // 使用優惠券
  const applyDiscount = async () => {
    if (!couponCode.trim()) {
      dispatch(createAsyncMessage({ text: '請輸入優惠券代碼', type: '提醒', status: 'failed' }));
      return;
    }
    try {
      const res = await axios.post(`${baseUrl}/v2/api/${apiPath}/coupon`, {
        data: { code: couponCode },
      });
      getCartList(); // 成功後刷新價格
      dispatch(
        createAsyncMessage({
          text: res.data.message,
          type: '成功使用優惠券',
          status: 'success',
        })
      );
    } catch (error) {
      // 3. 處理「無此優惠券」的邏輯
      const apiMessage = error.response?.data?.message;
      let showMessage = '此優惠券代碼不存在';
      
      if (apiMessage === '找不到代碼') {
        showMessage = '無此優惠券，請檢查代碼是否正確';
      } else if (apiMessage) {
        showMessage = apiMessage;
      }

      dispatch(
        createAsyncMessage({
          text: showMessage,
          type: '優惠券無效',
          status: 'failed',
        })
      );
    }
  };

  useEffect(() => {
    getCartList();
  }, [getCartList]);

  // --- 計算屬性 ---
  const totalAmount = useMemo(() => Math.round(cartList.final_total ?? 0), [cartList.final_total]);
  const discountAmount = useMemo(() => 
    Math.round((cartList?.total ?? 0) - (cartList?.final_total ?? 0)), 
    [cartList.total, cartList.final_total]
  );

  return (
    <>
    <div className='pt-5 pb-7 bg-light'>
      <div className="container mb-lg-7 mb-0">
        <form className="row g-5" onSubmit={onSubmit}>
          <div className="col-lg-9">
            {/* 1. 進度條 */}
<div className="container mb-5">
  <div className="d-flex align-items-center justify-content-between" style={{ gap: '0px' }}>
    
    {/* STEP 1: 已完成 */}
    <div className="d-flex align-items-center flex-grow-1">
      <div className="text-center position-relative" style={{ width: '80px' }}>
        <div className="d-flex align-items-center justify-content-center mx-auto mb-2 bg-white" 
             style={{ 
               width: '36px', height: '36px', borderRadius: '50%', 
               border: '2px solid var(--bs-primary)', color: 'var(--bs-primary)' 
             }}>
          <i className="bi bi-check-lg fw-bold"></i>
        </div>
        <div className="small fw-bold" style={{ color: 'var(--bs-primary)', whiteSpace: 'nowrap' }}>購物車</div>
      </div>
      {/* 連接線：已完成顏色 */}
      <div className="flex-grow-1 mx-2" style={{ height: '2px', backgroundColor: 'var(--bs-primary)', marginTop: '-25px' }}></div>
    </div>

    {/* STEP 2: 當前步驟 */}
    <div className="d-flex align-items-center flex-grow-1">
      <div className="text-center position-relative" style={{ width: '80px' }}>
        <div className="d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm bg-white" 
             style={{ 
               width: '36px', height: '36px', borderRadius: '50%', 
               border: '2px solid var(--bs-primary)', color: 'var(--bs-primary)'
             }}>
          <span className="fw-bold">2</span>
        </div>
        <div className="small fw-bold text-dark" style={{ whiteSpace: 'nowrap' }}>建立訂單</div>
      </div>
      {/* 連接線：未完成顏色 */}
      <div className="flex-grow-1 mx-2" style={{ height: '2px', backgroundColor: '#e9ecef', marginTop: '-25px' }}></div>
    </div>

    {/* STEP 3: 待進行 */}
    <div className="text-center" style={{ width: '80px' }}>
      <div className="d-flex align-items-center justify-content-center mx-auto mb-2 bg-white" 
           style={{ 
             width: '36px', height: '36px', borderRadius: '50%', 
             border: '2px solid #dee2e6', color: '#adb5bd' 
           }}>
        <span className="fw-bold">3</span>
      </div>
      <div className="small text-muted" style={{ whiteSpace: 'nowrap' }}>完成訂單</div>
    </div>

  </div>
</div>

            {/* 2. 商品明細 - 電腦版 */}
            <div className="card bg-white border-primary shadow-sm d-none d-lg-block mb-5" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="card-body p-5">
                <div className="card-title text-primary fs-4 fw-bold mb-4">
                  <i className="bi bi-list-check me-2"></i>商品明細
                </div>
                <table className="table align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="ps-0 text-muted fw-normal" width="45%">商品名稱</th>
                      <th scope="col" className="text-muted fw-normal text-center" width="15%">單價</th>
                      <th scope="col" className="text-muted fw-normal text-center" width="15%">數量</th>
                      <th scope="col" className="pe-0 text-muted fw-normal text-end" width="25%">小計</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartList.carts?.map((item) => (
                      <tr key={item.id}>
                        <td className="ps-0 py-3">
                          <div className="d-flex align-items-center">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.title}
                              className="rounded-3 me-3 shadow-sm"
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            />
                            <div className="fw-bold text-dark">{item.product.title}</div>
                          </div>
                        </td>
                        <td className="text-center text-primary">NT$ {item.product.price?.toLocaleString()}</td>
                        <td className="text-center">
                          <span className="badge rounded-pill bg-light text-dark px-3 py-2 border fw-normal">
                            {item.qty}
                          </span>
                        </td>
                        <td className="pe-0 text-end fw-bold text-primary">NT$ {item.total?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. 商品明細 - 手機版 */}
            <div className="card d-lg-none border-primary mb-4 shadow-sm" style={{ borderRadius: '20px' }}>
              <div className="card-body p-4">
                <div className="card-title text-primary fs-5 fw-bold mb-4 d-flex align-items-center">
                  <i className="bi bi-cart-fill me-2"></i>商品明細
                </div>
                <div className="d-flex flex-column gap-3">
                  {cartList.carts?.map((item, index) => (
                    <div className={`d-flex align-items-center pb-3 ${index !== cartList.carts.length - 1 ? 'border-bottom border-light' : ''}`} key={item.id}>
                      <img src={item.product.imageUrl} alt={item.product.title} className="rounded-3 me-3" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{item.product.title}</div>
                          <div className="text-primary fw-bold" style={{ fontSize: '0.95rem' }}>${item.total?.toLocaleString()}</div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <small className="text-muted">數量：{item.qty}</small>
                          <small className="text-muted">單價：${item.product.price?.toLocaleString()}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. 訂購人資訊 */}
            <div className="card bg-white p-4 p-lg-5 border-primary shadow-sm" style={{ borderRadius: '20px' }}>
              <div className="mb-4">
                <h2 className="text-primary fs-5 fs-lg-4 fw-bold mb-4"><i className="bi bi-person-fill me-2"></i>訂購人資訊</h2>
                <div className="row g-3">
                  <div className="col-lg-6">
                    <Input register={register} errors={errors} id="name" labelText="訂購人姓名" type="text" mark="*"
                      rules={{ required: '訂購人為必填', minLength: { value: 2, message: '訂購人姓名至少兩個字' } }} />
                  </div>
                  <div className="col-lg-6">
                    <Input register={register} errors={errors} id="tel" labelText="收件人電話" type="tel" mark="*"
                      rules={{
                        required: '收件人電話為必填', minLength: { value: 8, message: '收件人電話至少8碼' },
                        maxLength: { value: 12, message: '收件人電話不超過12碼' },
                        pattern: { value: /^(0[2-8]\d{7}|09\d{8})$/, message: '格式不正確' }
                      }} />
                  </div>
                  <div className="col-12">
                    <Input register={register} errors={errors} id="email" labelText="電子郵件" type="email" mark="*"
                      rules={{
                        required: 'Email為必填',
                        pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Email 格式不正確' }
                      }} />
                  </div>
                  <div className="col-12">
                    <Input id="address" labelText="配送地址" type="text" mark="*" errors={errors} register={register} rules={{ required: '地址為必填' }} />
                  </div>
                </div>
              </div>

              {/* 付款方式 */}
              <div className="mb-4">
                <h2 className=" fs-6 mb-3">付款方式</h2>
                <div className="d-flex flex-column flex-lg-row gap-3">
                  <div className={`form-check flex-fill p-3 border rounded-3 ${paymentMethod === 'atm' ? 'border-primary bg-light' : ''}`}>
                    <input className="form-check-input ms-0 me-2" type="radio" name="paymentMethod" id="atm" onChange={() => setPaymentMethod('atm')} checked={paymentMethod === 'atm'} />
                    <label className="form-check-label fw-medium" htmlFor="atm">ATM 轉帳</label>
                  </div>
                  <div className={`form-check flex-fill p-3 border rounded-3 ${paymentMethod === 'creditCard' ? 'border-primary bg-light' : ''}`}>
                    <input className="form-check-input ms-0 me-2" type="radio" name="paymentMethod" id="creditCard" onChange={() => setPaymentMethod('creditCard')} checked={paymentMethod === 'creditCard'} />
                    <label className="form-check-label fw-medium" htmlFor="creditCard">信用卡線上付款</label>
                  </div>
                </div>
              </div>

              {/* 訂單備註 */}
              <div>
                <h2 className=" fs-6 mb-3">訂單備註</h2>
                <textarea
                  {...register('message')}
                  className="form-control bg-light border-0"
                  placeholder="有什麼想告訴我們的嗎？"
                  id="message"
                  rows="3"
                  style={{ borderRadius: '12px' }}
                ></textarea>
              </div>
            </div>

            {/* 5. 優惠券 */}
            <div className="card bg-white mt-4 p-4 p-lg-5 border-primary shadow-sm mb-3" style={{ borderRadius: '20px' }}>
              <div className="row justify-content-start">
                <div className="col-12 col-md-8 col-lg-6">
                  <h3 className="card-title text-primary fs-5 fs-lg-4 fw-bold mb-4 d-flex align-items-center">
                    <i className="bi bi-ticket-perforated me-2"></i>使用優惠券
                  </h3>
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control border-primary py-2 py-lg-3 px-3 shadow-none" 
                      placeholder="請輸入折扣代碼" 
                      onChange={(e) => setCouponCode(e.target.value)} 
                      value={couponCode} 
                      style={{ borderRadius: '12px 0 0 12px', fontSize: '1rem' }} 
                    />
                    <button className="btn btn-primary text-white px-4 px-lg-5 fw-bold" type="button" onClick={applyDiscount} style={{ borderRadius: '0 12px 12px 0' }}>套用折扣</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6. 右邊側欄 - 結帳明細 */}
          <aside className="col-lg-3">
            {/* 電腦版側欄 */}
            <div className="d-none d-lg-block" style={{ position: 'sticky', top: '130px', zIndex: 10 }}>
              <div 
                className="card border-0 shadow-lg rounded-0" 
                style={{ backgroundColor: '#ffffff', borderTop: '4px solid #1a1a1a' }}
              >
                <div className="card-body p-4">
                  {/* 標題：極簡風格 */}
                  <div className="mb-4 pb-2 text-center" style={{ borderBottom: '1px solid #eeeeee' }}>
                    <h5 className="fw-bold mb-1" style={{ color: '#1a1a1a', letterSpacing: '3px', fontSize: '1.1rem' }}>
                      ORDER SUMMARY
                    </h5>
                    <small style={{ color: '#999999', fontSize: '0.7rem' }}>結帳明細</small>
                  </div>

                  {/* 明細清單 */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-3">
                      <span style={{ color: '#666666', fontSize: '0.9rem' }}>商品總額</span>
                      <span style={{ color: '#1a1a1a', fontWeight: '500' }}>
                        NT$ {(cartList.total ?? 0).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-3">
                      <span style={{ color: '#666666', fontSize: '0.9rem' }}>優惠折抵</span>
                      <span style={{ color: '#d9534f', fontWeight: '500' }}>
                        - NT$ {discountAmount.toLocaleString()}
                      </span>
                    </div>

                    {/* 分隔線 */}
                    <div className="my-3" style={{ borderTop: '1px dashed #dddddd' }}></div>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <span className="fw-bold" style={{ color: '#1a1a1a', letterSpacing: '1px' }}>應付總額</span>
                      <div className="text-end">
                        <span style={{ 
                          color: '#b08d57', // 金屬金
                          fontSize: '1.6rem', 
                          fontWeight: '900',
                          display: 'block',
                          lineHeight: '1.2'
                        }}>
                          NT$ {totalAmount.toLocaleString()}
                        </span>
                        <small style={{ color: '#999999', fontSize: '0.7rem' }}>含所有稅額</small>
                      </div>
                    </div>
                  </div>

                  {/* 按鈕區 */}
                  <button 
                    type="submit" 
                    className="btn w-100 py-3 mb-3 border-0 transition-all btn-primary rounded-2" 
                    style={{ 
                      //backgroundColor: '#1a1a1a', 
                      color: '#ffffff',
                      borderRadius: '0px',
                      fontWeight: 'bold',
                      letterSpacing: '2px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                    disabled={cartList.carts?.length < 1}
                  >
                    前往付款
                  </button>
                  
                  <Link 
                    className="btn btn-link w-100 text-decoration-none transition-all" 
                    style={{ color: '#999999', fontSize: '0.85rem' }}
                    to="/cart"
                  >
                    <i className="bi bi-chevron-left small me-1"></i> 返回修改訂單
                  </Link>
                </div>
              </div>
            </div>

            {/* 手機版：簡約高質感懸浮條 */}
            <div className="d-lg-none fixed-bottom bg-white shadow-lg p-3 z-3" style={{ borderTop: '2px solid #1a1a1a' }}>
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-6">
                    <div style={{ color: '#999999', fontSize: '0.75rem', marginBottom: '-4px' }}>TOTAL</div>
                    <div style={{ color: '#b08d57', fontSize: '1.3rem', fontWeight: 'bold' }}>
                      NT$ {totalAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-6 text-end">
                    <button 
                      type="submit" 
                      className="btn btn-dark px-4 py-2 fw-bold" 
                      style={{ borderRadius: '0px', backgroundColor: '#1a1a1a', fontSize: '0.9rem' }}
                      disabled={cartList.carts?.length < 1}
                    >
                      立即結帳
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
      
    </div>
    <Toast />
  </>
  );
}

export default Checkout;