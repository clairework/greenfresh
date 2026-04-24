import { useCallback, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import UpdateQtyBtnGroup from '../../components/UpdateQtyBtnGroup';
import { Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { updateCartData } from '../../../src/reduce/slice/cartSlice';
import DeleteCartModal from '../../components/DeleteCartModal';
import Toast from '../../components/Toast';
import { createAsyncMessage } from '../../reduce/slice/toastSlice';




const baseUrl = process.env.REACT_APP_API_URL;
const apiPath = process.env.REACT_APP_API_PATH;

function Cart() {
  const [cartList, setCartList] = useState([]);
 // const [orderExtend, setOrderExtend] = useState(false);
  const dispatch = useDispatch();
  const delModelRef = useRef(null);
  
  
  

  const getCartList = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/cart`);
      dispatch(updateCartData(res.data.data));
      setCartList(res.data.data);
     
    } catch (error) {
      const { message } = error.response.data;
      dispatch(
        createAsyncMessage({
          text: message,
          type: '取得購物車資訊失敗',
          status: 'failed',
        })
      );
  
    } finally {
 
    }
  }, [dispatch]);

  useEffect(() => {
    getCartList();
  }, [getCartList]);

  //刪除單一商品
  const removeCartItem = async id => {
    try {
      const res = await axios.delete(`${baseUrl}/v2/api/${apiPath}/cart/${id}`);
      getCartList();
      console.log('刪除品項:',res);
      dispatch(
        createAsyncMessage({
          text: res.data?.message,
          type: '成功刪除品項',
          status: 'success',
        })
      );
    } catch (error) {
      const { message } = error.response.data;
      dispatch(
        createAsyncMessage({
          text: message,
          type: '刪除品項失敗',
          status: 'failed',
        })
      );
    } finally {

    }
  };


  //更新商品數量
const updateCartItem = async (id, product_id, quantity) => {
    try {
      await axios.put(`${baseUrl}/v2/api/${apiPath}/cart/${id}`, {
        data: {
          product_id,
          qty: Number(quantity),
        },
      });
      getCartList();
    } catch (error) {
      console.error("API 請求失敗：", error.response);
      // 在這裡處理錯誤，而不是直接讀取 res.data
      const { message } = error.response;
      dispatch(
        createAsyncMessage({
          text: message,
          type: '更新品項失敗',
          status: 'failed',
        })
      );
    } finally {
   
    }
  };

  const openDelModal = () => {
    delModelRef.current.show();
  };
  return (
    <>
    <div className='bg-light'>
      <div className="container pb-5 pt-3 ">
        {cartList.carts?.length > 0 ? (
        <div className="row">
           {/* 左邊購物車內容區 */}  
          <div className="col-lg-9">
            {/* 進度條 */}
            <div className="container mb-5 pt-5">
              {/* 移除 justify-content-center，改用 between 讓它撐開 */}
              <div className="d-flex align-items-center justify-content-between w-100">
                
                {/* STEP 1: 當前步驟 */}
                <div className="text-center" style={{ width: '80px', flexShrink: 0 }}>
                  <div 
                    className="d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm bg-white"
                    style={{ 
                      width: '42px', 
                      height: '42px', 
                      borderRadius: '50%', 
                      border: '2px solid #3d8341', 
                      color: '#3d8341',
                      zIndex: 2,
                      position: 'relative'
                    }}
                  >
                    <span className="fw-bold" style={{ fontSize: '1rem' }}>1</span>
                  </div>
                  <div 
                    className="fw-bold text-nowrap" 
                    style={{ color: '#3d8341', fontSize: '0.95rem', letterSpacing: '1px' }}
                  >
                    購物車
                  </div>
                </div>

                {/* 連接線 1：會根據剩餘空間自動伸展 */}
                <div 
                  className="flex-grow-1" 
                  style={{ 
                    height: '2px', 
                    backgroundColor: '#eeeeee', 
                    margin: '0 10px',
                    marginBottom: '32px' // 對齊圓圈中心
                  }} 
                />

                {/* STEP 2: 待進行 */}
                <div className="text-center" style={{ width: '80px', flexShrink: 0 }}>
                  <div 
                    className="d-flex align-items-center justify-content-center mx-auto mb-2 bg-white"
                    style={{ 
                      width: '42px', 
                      height: '42px', 
                      borderRadius: '50%', 
                      border: '2px solid #eeeeee', 
                      color: '#cccccc' 
                    }}
                  >
                    <span className="fw-bold" style={{ fontSize: '1rem' }}>2</span>
                  </div>
                  <div 
                    className="text-muted text-nowrap" 
                    style={{ fontSize: '0.95rem', fontWeight: 'normal' }}
                  >
                    建立訂單
                  </div>
                </div>

                {/* 連接線 2：同樣會自動伸展 */}
                <div 
                  className="flex-grow-1" 
                  style={{ 
                    height: '2px', 
                    backgroundColor: '#eeeeee', 
                    margin: '0 10px',
                    marginBottom: '32px' 
                  }} 
                />

                {/* STEP 3: 待進行 */}
                <div className="text-center" style={{ width: '80px', flexShrink: 0 }}>
                  <div 
                    className="d-flex align-items-center justify-content-center mx-auto mb-2 bg-white"
                    style={{ 
                      width: '42px', 
                      height: '42px', 
                      borderRadius: '50%', 
                      border: '2px solid #eeeeee', 
                      color: '#cccccc' 
                    }}
                  >
                    <span className="fw-bold" style={{ fontSize: '1rem' }}>3</span>
                  </div>
                  <div 
                    className="text-muted text-nowrap" 
                    style={{ fontSize: '0.95rem', fontWeight: 'normal' }}
                  >
                    完成訂單
                  </div>
                </div>

              </div>
            </div>
          <div>

          {/* 刪除全部 */}
          <div className="text-end py-3 col-12">
            <button
              className="btn btn-outline-primary px-3"
              type="button"
              onClick={openDelModal}
            >
              刪除全部
            </button>
          </div>

          {/* ----- 購物車列表 ----- */}
          <div className="card mb-2" style={{ borderRadius: '12px' }}>
                {cartList.carts?.map((item) => {
                  return (
                    <div className="row g-0 border-bottom align-items-center p-3" key={item.id}>
                      {/* 1. 圖片區：固定寬度佔比 */}
                      <div className="col-lg-2 col-4">
                        <img
                          src={item.product.imageUrl}
                          className="object-fit-cover rounded"
                          alt={item.product.title}
                          style={{ width: '100%', height: '100px', maxWidth: '120px' }}
                        />
                      </div>

                      {/* 2. 標題區：手機版佔剩餘的 col-8 */}
                      <div className="col-lg-3 col-8 ps-3">
                        <h4 className="text-primary fs-6 fs-lg-5 mb-1 fw-bold">
                          {item.product.title}
                        </h4>
                        {/* <p className="text-muted fs-7 mb-0 d-none d-lg-block">
                          {item.product.description}
                        </p> */}
                      </div>

                      {/* 3. 數量控制區：
                          手機版強制設為 col-4 確保與上方圖片 col-4 同寬對齊。
                          使用 justify-content-start 讓它靠左對齊圖片邊緣。
                      */}
                      <div className="col-lg-3 col-4 d-flex align-items-center justify-content-lg-center justify-content-start mt-3 mt-lg-0">
                        <UpdateQtyBtnGroup
                          itemQty={item.qty}
                          onClickfn1={() => updateCartItem(item.id, item.product_id, item.qty - 1)}
                          onClickfn2={() => updateCartItem(item.id, item.product_id, item.qty + 1)}
                        />
                        <span className="ms-2 text-secondary d-none d-sm-inline">{item.product.unit}</span>
                      </div>

                      {/* 4. 價格區：佔 col-6 (或剩餘空間) */}
                      <div className="col-lg-3 col-6 text-center text-lg-center mt-3 mt-lg-0">
                        <h2 className="text-primary fs-5 fs-lg-4 mb-0 fw-bold">
                          NT${item.product.price?.toLocaleString()}
                        </h2>
                      </div>

                      {/* 5. 刪除按鈕：佔 col-2 */}
                      <div className="col-lg-1 col-2 text-end mt-3 mt-lg-0">
                        <button 
                          className="btn p-0 border-0" 
                          onClick={() => removeCartItem(item.id)}
                        >
                          <i className="bi bi-trash3 text-secondary fs-5"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
          </div>
            </div>
          </div>


          {/* 右邊結帳明細(電腦版) */}
          <aside className="col-lg-3">
            {/* 1. 桌機版側欄：在 lg 以上顯示，維持 Sticky */}
            <div className="d-none d-lg-block" style={{ position: 'sticky', top: '130px', zIndex: 1 }}>
              <div 
                className="card border-0 shadow-sm rounded-0" 
                style={{ backgroundColor: '#ffffff', borderTop: '4px solid #1a1a1a' }}
              >
                <div className="card-body p-4">
                  {/* 標題區 */}
                  <div className="mb-4 pb-2 text-center" style={{ borderBottom: '1px solid #eeeeee' }}>
                    <h5 className="fw-bold mb-1" style={{ color: '#1a1a1a', letterSpacing: '3px', fontSize: '1.1rem' }}>
                      MY CART
                    </h5>
                    <small style={{ color: '#999999', fontSize: '0.7rem', letterSpacing: '1px' }}>訂單清單</small>
                  </div>

                  {/* 明細內容 */}
                  <div className="card-text mb-4">
                    <div className="d-flex justify-content-between mb-3">
                      <span style={{ color: '#666666', fontSize: '0.9rem' }}>商品總額</span>
                      <span style={{ color: '#1a1a1a', fontWeight: '500' }}>
                        NT$ {(cartList.total ?? 0).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-3">
                      <span style={{ color: '#666666', fontSize: '0.9rem' }}>商品折扣</span>
                      <span style={{ color: '#d9534f', fontWeight: '500' }}>
                        - NT$ 0
                      </span>
                    </div>

                    {/* 裝飾性虛線 */}
                    <div className="my-3" style={{ borderTop: '1px dashed #dddddd' }}></div>

                    <div className="d-flex justify-content-between align-items-baseline mt-4">
                      <span className="fw-bold" style={{ color: '#1a1a1a', letterSpacing: '1px' }}>總額</span>
                      <div className="text-end">
                        <span style={{ 
                          color: '#b08d57', 
                          fontSize: '1.6rem', 
                          fontWeight: '900',
                          display: 'block',
                          lineHeight: '1.1'
                        }}>
                          NT$ {(cartList.total ?? 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 結帳按鈕 */}
                  <div className="mt-4">
                    <Link
                      className={`btn btn-primary rounded-2 w-100 py-3 border-0 transition-all ${cartList.carts?.length < 1 ? 'disabled' : ''}`}
                      style={{ 
                        //backgroundColor: '#1a1a1a', 
                        color: '#ffffff',
                        borderRadius: '0px',
                        fontWeight: 'bold',
                        letterSpacing: '2px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                      }}
                      to="/checkout"
                    >
                      確認結帳
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 手機版底部懸浮列：高質感橫帶 */}
            <div className="d-lg-none fixed-bottom bg-white shadow-lg p-3 z-3" style={{ borderTop: '2px solid #1a1a1a' }}>
              <div className="container px-2">
                <div className="row align-items-center">
                  <div className="col-6">
                    <p className="text-secondary mb-0" style={{ fontSize: '0.75rem' }}>
                      共 {cartList.carts?.length || 0} 件商品
                    </p>
                    <h4 className="fw-black mb-0" style={{ color: '#b08d57', fontSize: '1.3rem' }}>
                      NT$ {(cartList.total ?? 0).toLocaleString()}
                    </h4>
                  </div>
                  <div className="col-6 text-end">
                    <Link
                      className={`btn btn-dark px-4 py-2 fw-bold ${cartList.carts?.length < 1 ? 'disabled' : ''}`}
                      style={{ 
                        borderRadius: '0px', 
                        backgroundColor: '#1a1a1a', 
                        fontSize: '0.9rem',
                        letterSpacing: '1px'
                      }}
                      to="/checkout"
                    >
                      確認結帳
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </aside>


          </div>
        ) : (
          <div className='my-5 py-2'>
          <div className="text-center my-5">
            <h3 className="mb-5">購物車是空的</h3>
            <Link to="/products">
              <button
                type="buttons"
                className="btn btn-primary text-white px-5 py-3 rounded-lg "
              >
                前往商品頁
              </button>
            </Link>
          </div>
          </div>
        )}
      </div>
      </div>
      
      <DeleteCartModal getCartList={getCartList} delModelRef={delModelRef} />
      <Toast />
    </>
  );
}

export default Cart;
