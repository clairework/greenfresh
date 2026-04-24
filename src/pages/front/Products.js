import { useCallback, useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios';
import 'swiper/css';
import bannerImg from '../../images/bannerFruit.jpg';
import Banner from '../../components/Banner';
import Toast from '../../components/Toast';
import Loading from '../../components/Loading';
import { createAsyncMessage } from '../../reduce/slice/toastSlice';
import { useDispatch } from 'react-redux';

const baseUrl = process.env.REACT_APP_API_URL;
const apiPath = process.env.REACT_APP_API_PATH;

function Products() {
  const [products, setProducts] = useState([]);
  const [selectCategory, setSelectCategory] = useState('全部商品');
  const [ascending, setAscending] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const location = useLocation();
  const { category } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getProductList = useCallback(async () => {
    if (!baseUrl || !apiPath) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/products/all`);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      dispatch(createAsyncMessage({
        text: error.response?.data?.message || '取得資料失敗',
        type: 'danger',
      }));
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getProductList();
  }, [getProductList]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setSearchQuery(queryParams.get('query') || '');
    setSelectCategory(category ? decodeURIComponent(category) : '全部商品');
  }, [location.search, category]);

  const categories = useMemo(() => (
    ['全部商品', ...new Set(products.map(p => p.category))]
  ), [products]);

  const filterProducts = useMemo(() => {
    return products
      .filter(p => (selectCategory === '全部商品' || p.category === selectCategory))
      .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => (ascending ? a.price - b.price : b.price - a.price));
  }, [products, selectCategory, searchQuery, ascending]);

  const handleCategoryChange = (cat) => {
    setIsSortOpen(false);
    navigate(cat === '全部商品' ? '/products' : `/products/${cat}`);
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <Banner bannerImg={bannerImg} title="全部商品" enTitle="Store" slogan1="每一份食物都是我們的用心" />

      {/* 手機版導覽：保持原樣，僅微調間距 */}
      <div className="overflow-hidden container mb-5 mt-4">
        <Swiper slidesPerView={3.3} className="nav nav-pills d-lg-none d-flex">
          {categories.map(cat => (
            <SwiperSlide key={cat}>
              <button 
                type="button" 
                className={`nav-link ${selectCategory === cat ? 'active bg-primary' : 'text-dark'}`} 
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* <section className="container allProduct-container"> */}
      <section className="container">
        <div className="row d-flex flex-lg-row flex-column-reverse justify-content-between">
          
          {/* ==========================================================
               電腦版側邊欄
             ========================================================== */}
          <div className="col-xl-2 col-lg-3 pt-3">
            <div className="sticky-top d-none d-lg-block" style={{ top: '100px', zIndex: 10 }}>
              <p className="text-muted fw-bold ps-3 mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                CATEGORY 分類
              </p>
              <div className="list-group border-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`list-group-item list-group-item-action border-0 mb-2 py-3 px-4 d-flex align-items-center ${
                      selectCategory === cat 
                        ? 'bg-primary text-white shadow fw-bold' 
                        : 'text-dark bg-transparent'
                    }`}
                    style={{ 
                      borderRadius: '10px',
                      transition: 'all 0.25s ease'
                    }}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {/* 選中時顯示的小裝飾 */}
                    {selectCategory === cat && (
                      <span className="bg-white rounded-circle me-2" style={{ width: '6px', height: '6px' }}></span>
                    )}
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 商品內容區 */}
          <section className="col-xl-9 col-lg-8">
            <div className="d-flex position-relative w-lg-50 w-100 mb-5">
              <input 
                className="form-control form-control-lg fs-7 ps-3 border-primary" 
                type="search" 
                placeholder="搜尋商品關鍵字..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
              />
              <span className="material-symbols-outlined text-primary fs-2 position-absolute end-0 top-50 translate-middle-y pe-3" style={{ pointerEvents: 'none' }}>
                search
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
              <h2 className="fs-4 fw-bold">{selectCategory}</h2>
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle border-0"
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                >
                  排序：{ascending ? '價格低至高' : '價格高至低'}
                </button>
                <ul className={`dropdown-menu shadow ${isSortOpen ? 'show' : ''}`} 
                    style={{ display: isSortOpen ? 'block' : 'none', right: 0, left: 'auto' }}>
                  <li><button type="button" className="dropdown-item" onClick={() => { setAscending(true); setIsSortOpen(false); }}>價格低至高 ↑</button></li>
                  <li><button type="button" className="dropdown-item" onClick={() => { setAscending(false); setIsSortOpen(false); }}>價格高至低 ↓</button></li>
                </ul>
              </div>
            </div>

            <div className="row">
              {filterProducts.length > 0 ? (
                filterProducts.map(product => (
                  <div className="col-xl-4 col-md-6 mb-4" key={product.id}>
                    <Link className="card text-decoration-none h-100 shadow-sm border-0 product-card" to={`/products/${product.category}/${product.id}`}>
                      <div className="overflow-hidden">
                        <img src={product.imageUrl} className="card-img-top object-cover" style={{ height: 250, transition: '0.3s' }} alt={product.title} />
                      </div>
                      <div className="card-body">
                        <h5 className="card-title text-dark fs-6 fw-bold">{product.title}</h5>
                        <div className="d-flex justify-content-between align-items-center">
                          <p className="text-primary fw-bold m-0">NT${product.price.toLocaleString()}</p>
                          <small className="text-muted text-decoration-line-through">NT${product.origin_price.toLocaleString()}</small>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <span className="material-symbols-outlined fs-1 text-muted">search_off</span>
                  <p className="text-muted mt-2">找不到相關商品，換個關鍵字試試？</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>

      {/* 加入一點點 CSS 讓 Hover 效果更精緻，且不影響佈局 */}
      <style>{`
        .list-group-item-action:hover {
          background-color: #f8f9fa !important;
          color: #0d6efd !important;
        }
        .list-group-item.bg-primary:hover {
          background-color: #0b5ed7 !important; /* 選中後 Hover 顏色深一點點 */
          color: white !important;
        }
      `}</style>

      <Toast />
    </>
  );
}

export default Products;