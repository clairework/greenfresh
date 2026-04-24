import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import OrderModal from "../../components/OrderModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";
import DeleteModal from "../../components/DeleteModal";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [tempOrder, setTempOrder] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const orderModal = useRef(null);
  const deleteModal = useRef(null);
  
  useEffect(() => {
    orderModal.current = new Modal('#orderModal', { backdrop: 'static' });
    deleteModal.current = new Modal('#deleteModal', { backdrop: 'static' });
    getOrders();
  }, []);

  const closeDeleteModal = () => deleteModal.current.hide();

  const getOrders = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/orders?page=${page}`,
      );
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("取得訂單失敗", error);
    } finally {
      setIsLoading(false);
    }
  }

  const openOrderModal = (order) => {
    setTempOrder(order);
    orderModal.current.show();
  }
  
  const closeOrderModal = () => {
    setTempOrder({});
    orderModal.current.hide();
  }

  const openDeleteModal = (order) => {
    setTempOrder(order);
    deleteModal.current.show();
  };

  const deleteOrder = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/order/${id}`);
      if (res.data.success) {
        getOrders();
        deleteModal.current.hide();
      }
    } catch (error) {
      console.error("刪除失敗", error);
    }
  }

  return (
    <div className='bg-light min-vh-100 p-4'>
      <OrderModal
        closeProductModal={closeOrderModal}
        getOrders={getOrders}
        tempOrder={tempOrder}
      />
      <DeleteModal close={closeDeleteModal} text={tempOrder.title} handleDelete={deleteOrder} id={tempOrder.id} />

      {/* 標題與版面配置 */}
      <div className='d-flex justify-content-between align-items-center mb-5'>
        <div>
          <h2 className="fw-bold mb-1 text-dark">訂單管理</h2>
          <p className="text-muted mb-0">管理客戶訂單細節、付款狀態與成立時間</p>
        </div>
      </div>

      {/* 主要內容卡片 */}
      <div className='card border-0 shadow-sm rounded-4 overflow-hidden adminAll'>
        <div className='card-body p-0'>
          <div className='table-responsive'>
            <table className='table table-hover table-borderless align-middle mb-0'>
              <thead className='custom-thead border-bottom'>
                <tr>
                  <th className='ps-4' style={{ width: '180px' }}>訂單編號</th>
                  <th style={{ minWidth: '200px' }}>客戶姓名 / Email</th>
                  <th className='text-end' style={{ width: '150px' }}>訂單金額</th>
                  <th className='text-center' style={{ width: '120px' }}>付款狀態</th>
                  <th style={{ width: '200px' }}>成立 / 付款日期</th>
                  <th className='text-center pe-4' style={{ width: '100px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="spinner-border text-primary text-opacity-25" role="status"></div>
                      <div className="text-muted mt-2">訂單載入中...</div>
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className='border-bottom'>
                      {/* 1. 訂單編號 */}
                      <td className='ps-4'>
                        <span className='text-muted font-monospace fs-7'>#{order.id.slice(-12)}</span>
                      </td>

                      {/* 2. 用戶資訊 */}
                      <td>
                        <div className='fw-bold text-dark fs-6'>{order.user?.name}</div>
                        <div className="text-muted fs-7 mt-1">{order.user?.email}</div>
                      </td>

                      {/* 3. 金額 */}
                      {/* <td className='text-end fw-bold text-primary fs-5'>
                        ${order.total?.toLocaleString()} <span className="fs-7 fw-normal text-muted">元</span>
                      </td> */}
                      <td className='text-end fw-bold text-primary fs-5'>
                        ${Math.round(order.total || 0).toLocaleString()} <span className="fs-7 fw-normal text-muted">元</span>
                      </td>

                      {/* 4. 付款狀態 (使用 Subtle 樣式 Badge) */}
                      <td className='text-center'>
                        {order.is_paid ? (
                          <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-2 fw-medium">
                            已付款
                          </span>
                        ) : (
                          <span className="badge rounded-pill bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 fw-medium">
                            未付款
                          </span>
                        )}
                      </td>

                      {/* 5. 日期詳情 */}
                      <td>
                        <div className='fs-7 text-dark'>
                          {new Date(order.create_at * 1000).toLocaleDateString()} (成立)
                        </div>
                        <div className='fs-7 text-muted mt-1'>
                          {order.is_paid 
                            ? `${new Date(order.paid_date * 1000).toLocaleDateString()} (付款)` 
                            : '等待付款中'}
                        </div>
                      </td>

                      {/* 6. 操作按鈕 */}
                      <td className='text-center pe-4'>
                         <div className="d-flex justify-content-center gap-2">
                          <button
                            type='button'
                            className='btn btn-light-primary btn-sm rounded-circle p-2 border-0'
                            style={{ width: '36px', height: '36px' }}
                            onClick={() => openOrderModal(order)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                           <button
                            type='button'
                            className='btn btn-light-danger btn-sm rounded-circle p-2 border-0'
                            style={{ width: '36px', height: '36px' }}
                            onClick={() => openDeleteModal(order)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">目前尚無訂單資料</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className='d-flex justify-content-center mt-5 mb-5'>
        <Pagination pagination={pagination} changePage={getOrders} />
      </div>
    </div>
  );
}

export default AdminOrders;