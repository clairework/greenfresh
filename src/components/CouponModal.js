import axios from "axios";
import { useEffect, useState } from 'react';

function CouponModal({ closeModal, getCoupons, type, tempCoupon }) {
  const [tempData, setTempData] = useState({
    title: '',
    is_enabled: 1,
    percent: 80,
    due_date: 0,
    code: '',
  });

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (type === 'create') {
      setTempData({
        title: '',
        is_enabled: 1,
        percent: 80,
        due_date: Math.floor(new Date().getTime() / 1000), 
        code: '',
      });
      setDate(new Date());
    } else if (type === 'edit') {
      setTempData(tempCoupon);
      // 【修正點】編輯時，將後端傳來的「秒」轉為 JS 的「毫秒」供 Date 物件使用
      if (tempCoupon.due_date) {
        setDate(new Date(tempCoupon.due_date * 1000));
      }
    }
  }, [type, tempCoupon]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (name === 'percent') {
      setTempData({ ...tempData, [name]: Number(value) });
    } else if (name === 'is_enabled') {
      setTempData({ ...tempData, [name]: +e.target.checked });
    } else {
      setTempData({ ...tempData, [name]: value });
    }
  };

  const submit = async () => {
    try {
      let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon`;
      let method = 'post';
      if (type === 'edit') {
        api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${tempCoupon.id}`;
        method = 'put';
      }

      // 【修正點】存檔時，確保將 Date 物件轉回「秒」傳給 API
      const couponData = {
        ...tempData,
        due_date: Math.floor(date.getTime() / 1000),
      };

      const res = await axios[method](api, { data: couponData });
      console.log('儲存成功:', res);
      closeModal();
      getCoupons();
    } catch (error) {
      console.error('儲存失敗:', error.response?.data);
      alert(`儲存失敗：${error.response?.data?.message || '格式錯誤'}`);
    }
  };

  return (
    <div className='modal fade' tabIndex='-1' id='couponModal' aria-hidden='true'>
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content border-0 shadow-lg'>
          <div className='modal-header bg-dark text-white p-3'>
            <h5 className='modal-title fw-bold'>
              {type === 'create' ? <><i className="bi bi-ticket-perforated me-2"></i>建立新優惠券</> : <><i className="bi bi-pencil-square me-2"></i>編輯 {tempData.title}</>}
            </h5>
            <button type='button' className='btn-close btn-close-white' onClick={closeModal} />
          </div>

          <div className='modal-body p-4 bg-light'>
            <div className='card border-0 shadow-sm'>
              <div className='card-body p-4'>
                <div className='mb-4'>
                  <label className='form-label fw-bold text-secondary' htmlFor='title'>優惠券標題</label>
                  <input
                    type='text' id='title' name='title'
                    className='form-control border-top-0 border-start-0 border-end-0 rounded-0 ps-0'
                    value={tempData.title} onChange={handleChange}
                  />
                </div>

                <div className='row g-3 mb-4'>
                  <div className='col-md-6'>
                    <label className='form-label fw-bold text-secondary' htmlFor='percent'>折扣比例</label>
                    <div className="input-group">
                      <input type='number' name='percent' id='percent' className='form-control' value={tempData.percent} onChange={handleChange} />
                      <span className="input-group-text bg-white">%</span>
                    </div>
                  </div>

                  <div className='col-md-6'>
                    <label className='form-label fw-bold text-secondary' htmlFor='due_date'>到期日</label>
                    <input
                      type='date' id='due_date' className='form-control'
                      // 這裡要確保 input 格式正確 (YYYY-MM-DD)
                      value={`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`}
                      onChange={(e) => { if (e.target.value) setDate(new Date(e.target.value)); }}
                    />
                  </div>
                </div>

                <div className='mb-4'>
                  <label className='form-label fw-bold text-secondary' htmlFor='code'>優惠代碼</label>
                  <div className="input-group shadow-sm">
                    <span className="input-group-text bg-light text-muted"><i className="bi bi-hash"></i></span>
                    <input type='text' id='code' name='code' className='form-control border-start-0 fw-bold' value={tempData.code} onChange={handleChange} />
                  </div>
                </div>

                <div className='form-check form-switch'>
                  <input className='form-check-input' type='checkbox' id='is_enabled' name='is_enabled' role="switch" checked={!!tempData.is_enabled} onChange={handleChange} />
                  <label className='form-check-label fw-bold text-secondary' htmlFor='is_enabled'>
                    {tempData.is_enabled ? '啟用中' : '未啟用'}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className='modal-footer bg-white border-0 p-3'>
            <button type='button' className='btn btn-link text-secondary text-decoration-none' onClick={closeModal}>取消</button>
            <button type='button' className='btn btn-dark px-5 py-2 fw-bold shadow' onClick={submit}>確認存檔</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouponModal;