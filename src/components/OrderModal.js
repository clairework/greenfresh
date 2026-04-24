import axios from "axios";
import { useEffect, useState, useMemo } from "react";

// 自定義 Hook: 用於格式化時間
const useFormattedDate = (timestamp) => {
  return useMemo(() => {
    if (!timestamp) return '無';
    return new Date(timestamp * 1000).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }, [timestamp]);
};

function OrderModal({ closeProductModal, getOrders, tempOrder }) {
  const [isLoading, setIsLoading] = useState(false);
  const [tempData, setTempData] = useState({
    is_paid: false,
    status: 0,
    user: {},
    ...tempOrder,
  });

  const formattedCreateTime = useFormattedDate(tempOrder.create_at);

  useEffect(() => {
    setTempData({
      ...tempOrder,
      is_paid: tempOrder.is_paid,
      status: tempOrder.status,
      user: { ...tempOrder.user }
    });
  }, [tempOrder]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setTempData((pre) => ({
      ...pre,
      user: { ...pre.user, [name]: value }
    }));
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTempData((pre) => ({
      ...pre,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submit = async () => {
    setIsLoading(true);
    try {
      let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/order/${tempOrder.id}`;
      await axios.put(api, { data: { ...tempData } });
      setIsLoading(false);
      getOrders();
      closeProductModal();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className='modal fade adminAll' tabIndex='-1' id='orderModal'>
      <div className='modal-dialog modal-xl modal-dialog-centered'>
        <div className='modal-content border-0 shadow-lg' style={{ borderRadius: '12px', overflow: 'hidden' }}>
          
          {/* 頂部標題列 - 黑色風格 */}
          <div className="modal-header border-0 px-4 py-3" style={{ background: '#212529', color: '#fff' }}>
            <h5 className="modal-title d-flex align-items-center gap-2 fw-bold" style={{ fontSize: '1.2rem' }}>
              <i className="bi bi-pencil-square"></i> 編輯 訂單單號：{tempOrder.id?.slice(-12)}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={closeProductModal} aria-label="Close"></button>
          </div>

          <div className='modal-body p-0' style={{ background: '#FFFDF5' }}>
            <div className="row g-0">
              
              {/* 左側：訂購資訊 (可編輯) */}
              <div className="col-md-5 p-4 border-end" style={{ background: '#fff' }}>
                <h6 className="fw-bold mb-4" style={{ color: '#888A4E' }}>收件人基本資料</h6>
                
                <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Email</label>
                    <input type="email" className="form-control" name="email" value={tempData.user?.email || ''} onChange={handleUserChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">收件人姓名</label>
                    <input type="text" className="form-control" name="name" value={tempData.user?.name || ''} onChange={handleUserChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">聯絡電話</label>
                    <input type="tel" className="form-control" name="tel" value={tempData.user?.tel || ''} onChange={handleUserChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">收件地址</label>
                    <input type="text" className="form-control" name="address" value={tempData.user?.address || ''} onChange={handleUserChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">備註</label>
                    <textarea className="form-control" name="message" rows="2" value={tempData.message || ''} onChange={handleChange}></textarea>
                </div>
              </div>

              {/* 右側：商品明細 (純顯示) */}
              <div className="col-md-7 p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0 text-dark">商品內容明細</h6>
                  <span className={`badge ${tempData.is_paid ? 'bg-success' : 'bg-secondary'}`}>
                    {tempData.is_paid ? '已付款' : '待付款'}
                  </span>
                </div>

                <div className="product-list" style={{maxHeight: '320px', overflowY: 'auto'}}>
                  {tempOrder.products && Object.values(tempOrder.products).map((cart) => (
                    <div className="d-flex align-items-center mb-2 p-3 bg-white rounded border" key={cart.id}>
                      <img src={cart.product.imageUrl} alt="" className="rounded" style={{width: '50px', height: '50px', objectFit: 'cover'}} />
                      <div className="ms-3 flex-grow-1">
                        <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{cart.product.title}</div>
                        <div className="text-muted small">$ {cart.product.price?.toLocaleString()} NTD</div>
                      </div>
                      <div className="text-end px-3">
                        <div className="text-muted small">數量</div>
                        {/* 改為純文字顯示，不再使用 input */}
                        <div className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>{cart.qty}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded" style={{ background: 'rgba(0,0,0,0.03)', border: '1px dashed #ccc' }}>
                    <div className="d-flex justify-content-between mb-2 small">
                        <span className="text-muted">訂單建立時間</span>
                        <span className="text-dark">{formattedCreateTime}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-dark">訂單總金額</span>
                        {/* <span className="h4 mb-0 fw-bold text-dark">${tempOrder.total?.toLocaleString()}</span> */}
                        <span className="h4 mb-0 fw-bold text-dark">
                          ${Math.round(tempOrder.total || 0).toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="form-check form-switch d-flex align-items-center gap-2">
                        <input className="form-check-input" type="checkbox" name="is_paid" id="is_paid_switch"
                            style={{ width: '40px', height: '20px', cursor: 'pointer' }}
                            checked={tempData.is_paid} onChange={handleChange} />
                        <label className="form-check-label fw-bold text-dark" htmlFor="is_paid_switch" style={{ cursor: 'pointer' }}>
                          此訂單已確認付款
                        </label>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部按鈕 - 參考圖片黑色風格 */}
          <div className='modal-footer border-0 px-4 py-4' style={{ background: '#fff' }}>
            <button type='button' className='btn btn-link text-muted text-decoration-none px-4 fw-medium' onClick={closeProductModal}>取消</button>
            <button 
                type='button' 
                className='btn btn-dark px-5 py-2 fw-bold shadow-sm' 
                style={{ borderRadius: '8px', background: '#212529', minWidth: '160px' }} 
                onClick={submit} 
                disabled={isLoading}
            >
              {isLoading ? '處理中...' : '確認存檔'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default OrderModal;