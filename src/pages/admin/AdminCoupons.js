import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import CouponModal from "../../components/CouponModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [pagination, setPagination] = useState({});
  const [type, setType] = useState('create');
  const [tempCoupon, setTempCoupon] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const couponModal = useRef(null);
  const deleteModal = useRef(null);

  useEffect(() => {
    // 確保 ID 與 CouponModal.js 內部一致
    couponModal.current = new Modal('#couponModal', { backdrop: 'static' });
    deleteModal.current = new Modal('#deleteModal', { backdrop: 'static' });
    getCoupons();
  }, []);

  const getCoupons = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupons?page=${page}`,
      );
      setCoupons(res.data.coupons);
      setPagination(res.data.pagination);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCouponModal = (type, item) => {
    setType(type);
    setTempCoupon(item);
    couponModal.current.show();
  };

  const closeModal = () => couponModal.current.hide();

  const openDeleteModal = (item) => {
    setTempCoupon(item);
    deleteModal.current.show();
  };

  const closeDeleteModal = () => deleteModal.current.hide();

  const deleteCoupon = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${id}`);
      if (res.data.success) {
        getCoupons();
        deleteModal.current.hide();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='bg-light min-vh-100 p-4 adminAll'>
      <CouponModal closeModal={closeModal} getCoupons={getCoupons} tempCoupon={tempCoupon} type={type} />
      <DeleteModal close={closeDeleteModal} text={tempCoupon.title} handleDelete={deleteCoupon} id={tempCoupon.id} />

      <div className='d-flex justify-content-between align-items-center mb-5'>
        <div>
          <h2 className="fw-bold mb-1 text-dark">優惠券管理</h2>
          <p className="text-muted mb-0">設定促銷活動代碼與折扣比例</p>
        </div>
        <button
          type='button'
          className='btn btn-primary px-4 py-2 rounded-3 shadow-sm'
          onClick={() => openCouponModal('create', {})}
        >
          <i className="bi bi-plus-lg me-2"></i> 建立優惠券
        </button>
      </div>

      <div className='card border-0 shadow-sm rounded-4 overflow-hidden'>
        <div className='card-body p-0'>
          <div className='table-responsive'>
            <table className='table table-hover table-borderless align-middle mb-0'>
              <thead className='custom-thead border-bottom'>
                <tr>
                  <th className='ps-4' style={{ width: '25%' }}>活動名稱</th>
                  <th className='text-center' style={{ width: '15%' }}>折扣比例</th>
                  <th className='text-center' style={{ width: '20%' }}>優惠碼</th>
                  <th className='text-center' style={{ width: '15%' }}>到期日</th>
                  <th className='text-center' style={{ width: '10%' }}>啟用</th>
                  <th className='text-center pe-4' style={{ width: '120px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="6" className="text-center py-5">讀取中...</td></tr>
                ) : coupons.length > 0 ? (
                  coupons.map((item) => (
                    <tr key={item.id} className='border-bottom'>
                      <td className='ps-4'>
                        <div className='fw-bold text-dark'>{item.title}</div>
                      </td>
                      <td className='text-center fw-bold text-primary'>
                        {item.percent}%
                      </td>
                      <td className='text-center'>
                        <span className="badge bg-light text-primary border fs-6 px-3 py-2 fw-normal font-monospace fw-bold">
                          {item.code}
                        </span>
                      </td>
                      <td className='text-center text-muted fs-7'>
                        {new Date(item.due_date * 1000).toLocaleDateString()}
                      </td>
                      
                      {/* 打勾樣式 */}
                      <td className='text-center'>
                        {item.is_enabled ? (
                          <i className="bi bi-check-circle-fill text-success fs-5"></i>
                        ) : (
                          <i className="bi bi-circle text-light fs-5"></i>
                        )}
                      </td>

                      <td className='text-center pe-4'>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            type='button'
                            className='btn btn-light-primary btn-sm rounded-circle p-2 border-0'
                            style={{ width: '36px', height: '36px' }}
                            onClick={() => openCouponModal('edit', item)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            type='button'
                            className='btn btn-light-danger btn-sm rounded-circle p-2 border-0'
                            style={{ width: '36px', height: '36px' }}
                            onClick={() => openDeleteModal(item)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="text-center py-5">尚無資料</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className='d-flex justify-content-center mt-4 mb-5'>
        <Pagination pagination={pagination} changePage={getCoupons} />
      </div>
    </div>
  );
}

export default AdminCoupons;