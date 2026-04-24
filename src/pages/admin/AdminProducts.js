import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import ProductModal from "../../components/ProductModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";

// 如果沒有圖片時顯示的預設圖
const NO_IMAGE_URL = 'https://via.placeholder.com/60?text=No+Img';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [type, setType] = useState('create');
  const [tempProduct, setTempProduct] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const productModal = useRef(null);
  const deleteModal = useRef(null);

  useEffect(() => {
    productModal.current = new Modal('#productModal', { backdrop: 'static' });
    deleteModal.current = new Modal('#deleteModal', { backdrop: 'static' });
    getProducts();
  }, []);

  const getProducts = async (page = 1) => {
    setIsLoading(true);
    try {
      const productRes = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/products?page=${page}`,
      );
      setProducts(productRes.data.products);
      setPagination(productRes.data.pagination);
    } catch (error) {
      console.error("取得產品失敗", error);
    } finally {
      setIsLoading(false);
    }
  }

  const openProductModal = (type, product) => {
    setType(type);
    setTempProduct(product);
    productModal.current.show();
  }

  const closeProductModal = () => productModal.current.hide();

  const openDeleteModal = (product) => {
    setTempProduct(product);
    deleteModal.current.show();
  };

  const closeDeleteModal = () => deleteModal.current.hide();

  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${id}`);
      if (res.data.success) {
        getProducts();
        deleteModal.current.hide();
      }
    } catch (error) {
      console.error("刪除失敗", error);
    }
  }

  return (
    <div className='adminAll bg-light min-vh-100 p-4'>
      <ProductModal closeProductModal={closeProductModal} getProducts={getProducts} tempProduct={tempProduct} type={type} />
      <DeleteModal close={closeDeleteModal} text={tempProduct.title} handleDelete={deleteProduct} id={tempProduct.id} />

      <div className='d-flex justify-content-between align-items-center mb-5'>
        <div>
          <h2 className="fw-bold mb-1 text-dark">產品管理</h2>
          <p className="text-muted mb-0">管理商店中的所有商品資訊與銷售狀態</p>
        </div>
        <button
          type='button'
          className='btn btn-primary px-4 py-2 rounded-3 shadow-sm'
          onClick={() => openProductModal('create', {})}
        >
          <i className="bi bi-plus-lg me-2"></i> 建立新商品
        </button>
      </div>

      <div className='card border-0 shadow-sm rounded-4 overflow-hidden'>
        <div className='card-body p-0'>
          <div className='table-responsive'>
            <table className='table table-hover table-borderless align-middle mb-0'>
              <thead className=' text-uppercase fs-7 text-muted border-bottom custom-thead'>
                <tr>
                  <th className='ps-4' style={{ width: '80px' }}>圖片</th>
                  <th style={{ minWidth: '300px' }}>產品詳情</th> {/* 加寬以容納描述 */}
                  <th className='text-end' style={{ width: '120px' }}>售價</th>
                  <th className='text-center' style={{ width: '100px' }}>狀態</th>
                  <th className='text-center pe-4' style={{ width: '120px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="5" className="text-center py-5">讀取中...</td></tr>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className='border-bottom'>
                      <td className='ps-4'>
                        <img 
                          src={product.imageUrl || NO_IMAGE_URL} 
                          alt={product.title} 
                          className="rounded-3 shadow-sm border"
                          style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>
                        <div className="d-flex align-items-center mb-1">
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-normal me-2" style={{ fontSize: '0.7rem' }}>
                            {product.category}
                          </span>
                          <div className='fw-bold text-dark fs-6'>{product.title}</div>
                        </div>
                        {/* 產品描述：限制高度與多行溢出 */}
                        <p className="text-muted fs-7 mb-0 text-truncate-2" title={product.description}>
                          {product.description || "暫無描述內容"}
                        </p>
                      </td>
                      <td className='text-end'>
                        <div className='text-muted fs-7'><del>{product.origin_price?.toLocaleString()}</del></div>
                        <div className='fw-bold text-primary fs-5'>{product.price?.toLocaleString()}</div>
                      </td>
                      <td className='text-center'>
                        {product.is_enabled ? (
                          <span className="badge rounded-pill bg-success-subtle text-success px-3">已上架</span>
                        ) : (
                          <span className="badge rounded-pill bg-light text-secondary px-3">未上架</span>
                        )}
                      </td>
                      <td className='text-center pe-4'>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            type='button'
                            className='btn btn-light-primary btn-sm rounded-circle p-2 border-0'
                            style={{ width: '36px', height: '36px' }}
                            onClick={() => openProductModal('edit', product)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                           <button
                            type='button'
                            className='btn btn-light-danger btn-sm rounded-circle p-2 border-0'
                            style={{ width: '36px', height: '36px' }}
                            onClick={() => openDeleteModal(product)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center py-5">目前尚無產品</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className='d-flex justify-content-center mt-5'>
        <Pagination pagination={pagination} changePage={getProducts} />
      </div>
    </div>
  );
}
export default AdminProducts;