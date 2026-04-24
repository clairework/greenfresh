import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { createAsyncMessage } from "../reduce/slice/toastSlice";
import Toast from '../components/Toast';

function ProductModal({ closeProductModal, getProducts, type, tempProduct }) {
  const [tempData, setTempData] = useState({
    title: '',
    category: '',
    origin_price: 100,
    price: 300,
    unit: '',
    description: '',
    content: '',
    is_enabled: 1,
    imageUrl: '',
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (type === 'create') {
      setTempData({
        title: '',
        category: '',
        origin_price: 100,
        price: 300,
        unit: '',
        description: '',
        content: '',
        is_enabled: 1,
        imageUrl: '',
      });
    } else if (type === 'edit') {
      setTempData(tempProduct);
    }
  }, [type, tempProduct]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (['price', 'origin_price'].includes(name)) {
      setTempData({
        ...tempData,
        [name]: Number(value),
      });
    } else if (name === 'is_enabled') {
      setTempData({
        ...tempData,
        [name]: +e.target.checked,
      });
    } else {
      setTempData({
        ...tempData,
        [name]: value,
      });
    }
  };

  const handleClose = () => {
    closeProductModal();
  };

  const submit = async () => {
    try {
      let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product`;
      let method = 'post';
      if (type === 'edit') {
        api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${tempProduct.id}`;
        method = 'put';
      }
      const res = await axios[method](api, { data: tempData });
      
      dispatch(createAsyncMessage({
        text: res.data.message,
        type: '系統訊息',
        status: 'success',
      }));
      getProducts();
      closeProductModal();
    } catch (error) {
      const { message } = error.response.data;
      dispatch(createAsyncMessage({
        text: message,
        type: '錯誤訊息',
        status: 'failed',
      }));
    }
  };

  const uploadFile = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file-to-upload', file);
    try {
      let api_file = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`;
      const res = await axios.post(api_file, formData);
      setTempData({ ...tempData, imageUrl: res.data.imageUrl });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className='modal fade'
      tabIndex='-1'
      id='productModal'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-xl'> {/* 放大至 xl 讓排版更從容 */}
        <div className='modal-content border-0 shadow-lg'>
          <div className='modal-header bg-dark text-white p-3'>
            <h5 className='modal-title fw-bold' id='exampleModalLabel'>
              {type === 'create' ? <><i className="bi bi-plus-lg me-2"></i>建立新商品</> : <><i className="bi bi-pencil-square me-2"></i>編輯 {tempData.title}</>}
            </h5>
            <button
              type='button'
              className='btn-close btn-close-white'
              aria-label='Close'
              onClick={handleClose}
            />
          </div>
          <div className='modal-body p-4 bg-light'>
            <div className='row'>
              {/* 左側：圖片管理區 */}
              <div className='col-lg-4'>
                <div className='card border-0 shadow-sm mb-3'>
                  <div className='card-body p-3'>
                    <label className='form-label fw-bold text-primary mb-3'>產品封面圖</label>
                    <div className="mb-3 text-center bg-white rounded-3 border d-flex align-items-center justify-content-center" style={{ height: '300px', overflow: 'hidden' }}>
                      {tempData.imageUrl ? (
                        <img
                          src={tempData.imageUrl}
                          alt="圖片預覽"
                          className="img-fluid"
                          style={{ maxHeight: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <div className="text-muted text-center">
                          <i className="bi bi-image" style={{ fontSize: '3rem' }}></i>
                          <p className="mb-0">尚未上傳圖片</p>
                        </div>
                      )}
                    </div>
                    
                    <div className='form-group mb-3'>
                      <label className='form-label small fw-bold text-muted' htmlFor='image'>圖片網址</label>
                      <input
                        type='text'
                        name='imageUrl'
                        id='image'
                        placeholder='請貼上圖片連結'
                        className='form-control form-control-sm'
                        onChange={handleChange}
                        value={tempData.imageUrl}
                      />
                    </div>

                    <div className='form-group'>
                      <label className='btn btn-outline-primary w-100' htmlFor='customFile'>
                        <i className="bi bi-cloud-upload me-2"></i>上傳檔案
                      </label>
                      <input
                        id="customFile"
                        type="file"
                        className="d-none"
                        onChange={(e) => uploadFile(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 右側：資料輸入區 */}
              <div className='col-lg-8'>
                <div className='card border-0 shadow-sm'>
                  <div className='card-body p-4'>
                    <div className='form-group mb-4'>
                      <label className='form-label fw-bold text-primary' htmlFor='title'>產品名稱</label>
                      <input
                        type='text'
                        id='title'
                        name='title'
                        placeholder='請輸入商品標題'
                        className='form-control border-top-0 border-start-0 border-end-0 rounded-0 ps-0'
                        style={{ fontSize: '1.25rem' }}
                        onChange={handleChange}
                        value={tempData.title}
                      />
                    </div>

                    <div className='row g-3 mb-3'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-primary' htmlFor='category'>分類</label>
                        <input
                          type='text'
                          id='category'
                          name='category'
                          placeholder='請輸入分類'
                          className='form-control'
                          onChange={handleChange}
                          value={tempData.category}
                        />
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-primary' htmlFor='unit'>單位</label>
                        <input
                          type='text'
                          id='unit'
                          name='unit'
                          placeholder='請輸入單位'
                          className='form-control'
                          onChange={handleChange}
                          value={tempData.unit}
                        />
                      </div>
                    </div>

                    <div className='row g-3 mb-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-primary' htmlFor='origin_price'>原價</label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent border-end-0">NT$</span>
                          <input
                            type='number'
                            id='origin_price'
                            name='origin_price'
                            className='form-control border-start-0'
                            onChange={handleChange}
                            value={tempData.origin_price}
                          />
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-primary' htmlFor='price'>售價</label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent border-end-0 text-price fw-bold">NT$</span>
                          <input
                            type='number'
                            id='price'
                            name='price'
                            className='form-control border-start-0 text-price fw-bold'
                            onChange={handleChange}
                            value={tempData.price}
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="my-4 text-muted" />

                    <div className='form-group mb-3'>
                      <label className='form-label fw-bold text-primary' htmlFor='description'>產品簡述</label>
                      <textarea
                        rows="2"
                        id='description'
                        name='description'
                        placeholder='請輸入簡短的產品描述...'
                        className='form-control bg-light border-0'
                        onChange={handleChange}
                        value={tempData.description}
                      />
                    </div>

                    <div className='form-group mb-4'>
                      <label className='form-label fw-bold text-primary' htmlFor='content'>詳細說明</label>
                      <textarea
                        rows="4"
                        id='content'
                        name='content'
                        placeholder='請輸入完整的產品細節說明...'
                        className='form-control bg-light border-0'
                        onChange={handleChange}
                        value={tempData.content}
                      />
                    </div>

                    <div className='form-group'>
                      <div className='form-check form-switch'>
                        <input
                          type='checkbox'
                          id='is_enabled'
                          name='is_enabled'
                          className='form-check-input'
                          role="switch"
                          onChange={handleChange}
                          checked={!!tempData.is_enabled}
                        />
                        <label className='form-check-label fw-bold' htmlFor='is_enabled'>
                          {tempData.is_enabled ? <span className="text-success">已上架啟用</span> : <span className="text-muted">未上架暫存</span>}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='modal-footer bg-white border-0 p-3 shadow-sm'>
            <button
              type='button'
              className='btn btn-link text-primary text-decoration-none'
              onClick={handleClose}
            >
              捨棄變更
            </button>
            <button type='button' className='btn btn-dark px-5 py-2 fw-bold' onClick={submit}>
              儲存並發佈
            </button>
          </div>
        </div>
      </div>
      <Toast />
    </div>
  );
}

export default ProductModal;