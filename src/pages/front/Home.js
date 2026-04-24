import news01 from '../../images/news01.jpg';
import health01 from '../../images/health01.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useDispatch } from 'react-redux';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Toast from '../../components/Toast';
import { createAsyncMessage } from '../../reduce/slice/toastSlice';


const apiPath = process.env.REACT_APP_API_URL+'/v2/api/'+ process.env.REACT_APP_API_PATH;
function Home() {
  
const dispatch = useDispatch();
const [products, setProducts] = useState([]); // 儲存所有商品

  useEffect(() => {
    // 從 API 取得商品數據
     console.log('這裡:',apiPath);
    fetch(`${apiPath}/products/all`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products);
         
        }
      })
      .catch(error => {
        const { message } = error.response.data;
        dispatch(
          createAsyncMessage({
            text: message,
            type: '取得資料失敗',
            status: 'failed',
          })
        );
      });
  },[dispatch]);

      
const filteredProducts = products.filter(product => product.category === '新鮮蔬果');

const newsData = [
    { year: '2026', date: '05/01', content: '寵愛媽咪！母親節全館滿 $2000 現折 $200，早鳥再送精美好禮。' },
    { year: '2026', date: '04/18', content: '春季新色登場！職人手作系列，給你最溫暖的居家氛圍。' },
    { year: '2026', date: '03/23', content: '愚人節不開玩笑！一日限定全館免運，錯過再等一年。' },
    { year: '2026', date: '02/20', content: '228 連假營運公告：實體門市正常營業，線上客服回覆稍有延遲請見諒。' },
    { year: '2026', date: '01/05', content: '綠色購物計畫：即日起減少一次性包材，一起為地球盡一份心。' },
  ];


  return (
    <>
    {/* banner區*/}
    <div className='home'>
      <section className="banner">
            <div className="banner-title">
              天然 ‧ 有機 ‧ 用心
            </div>
            
            <div className="banner-badge">
              綠鮮生態農場
            </div>

            <div className="scroll-indicator">
              <span className="scroll-text">Scroll</span>
              <div className="scroll-arrow"></div>
            </div>
      </section>     
    </div>


  {/* 全部商品 */}
  <section className='home pb-5'>

        {/* 商品區 */}
        <div className="">
            <h5 className="fw-bold text-center pt-4 mt-5 product-title">全部商品</h5>
  
            <div className='container'>
              <div className="tab-content " id="MyProductTabContent">
                <div
                  className="tab-pane fade show active"
                  id="hot-product"
                  role="tabpanel"
                  aria-labelledby="hot-product-tab"
                >
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    // 修改這裡：指定自定義的 class 名稱
                    navigation={{
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }}
                    //navigation
                    scrollbar={{ draggable: true }}
                    pagination={{ clickable: true }}
                    autoplay= {{
                      delay: 2000, // 每次切換的間隔時間（毫秒），3000 = 3秒
                      disableOnInteraction: false, // 使用者操作後（如滑動、點擊）是否停止自動播放
                      pauseOnMouseEnter: true, // 滑鼠移入時是否暫停自動播放
                    }}
                    
                    breakpoints={{
                      0: { slidesPerView: 1, spaceBetween: 12 },
                      500: { slidesPerView: 1, spaceBetween: 12 },
                      776: { slidesPerView: 2, spaceBetween: 12 },
                      1200: { slidesPerView: 4, spaceBetween: 12 },
                    }}
                    
                    className="pb-5 pt-3 position-relative home-prodcut-swiper"
                  >
                    {products.length > 0 ? (
                      products.map(product => (
                        <SwiperSlide
                          key={product.id}
                          className="swiper-slide card border-1 home-products-card "
                        >
                          <div>
                            <Link
                              to={`/products/${product.category}/${product.id}`}
                            >
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                style={{height:280}}
                                className="product-index-img w-100"
                              />
                            </Link>
                          </div>
                          <div className="card-body px-3 ">
                            <h6 className="card-title product-card-title fs-lg-5 text-nowrap fw-bold">
                              {product.title}
                            </h6>
                            <div className="card-text d-flex">
                              <p className="text-price fw-bold me-2">
                                NT${product.price}
                              </p>
                              <del className="fs-8 text-gray fw-normal">
                                NT${product.origin_price}
                              </del>
                            </div>
                          </div>
                          <div className="d-grid gap-2">

                          </div>
                        </SwiperSlide>
                      ))
                    ) : (
                      <p className="text-center mt-4">該分類暫無商品</p>
                    )}
                    {/* 關鍵：手動加入這兩個 div，並放在 Swiper 標籤內 */}
                    <div className="swiper-button-prev"></div>
                    <div className="swiper-button-next"></div>
                  </Swiper>
                </div>
                
              </div>
            </div>
        </div>

  </section>


  {/* <!--健康知識--> */}
  <section className="home lohas-section py-5 bg-light">
      <div className="container">
        <div className="row align-items-center">
          
          {/* 左側文字區：在桌面端佔 6 欄，手機端自動堆疊 */}
          <div className="col-md-6 mb-4 mb-md-0">
            <div className="content-wrapper">
              <div className="title-group mb-4">
                <h2 className="title-zh fw-bold mb-0 text-primary">健康新知</h2>
                <span className="title-en d-block text-secondary ps-2">Health news</span>
              </div>
              
              <p className="description text-gray fs-5 mb-0">
                生機飲食主張食用天然原型食物，能保留完整活性酵素與營養。
                <br className="d-none d-lg-block" />
                幫助身體高效排毒、減輕負擔，並重塑輕盈健康的體態。
              </p>
              
              {/* Button 可放在此處 */}
            </div>
          </div>

          {/* 右側圖片區 */}
          <div className="col-md-6">
            <div className="image-wrapper">
              <img 
                src={health01}
                alt="LOHAS" 
                className="img-fluid custom-rounded shadow-sm"
              />
            </div>
          </div>

        </div>
      </div>
  </section>

  {/* 精選蔬果 */}
  <section className='home'>

        {/* 商品區 */}
        <div className="">
            <h5 className="fw-bold text-center pt-4 mt-5 product-title">精選蔬果</h5>
  
            <div className='container'>
              <div className="tab-content " id="MyProductTabContent">
                <div
                  className="tab-pane fade show active"
                  id="hot-product"
                  role="tabpanel"
                  aria-labelledby="hot-product-tab"
                >
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    // 修改這裡：指定自定義的 class 名稱
                    navigation={{
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }}
                    //navigation
                    scrollbar={{ draggable: true }}
                    pagination={{ clickable: true }}
                    autoplay= {{
                      delay: 2000, // 每次切換的間隔時間（毫秒），3000 = 3秒
                      disableOnInteraction: false, // 使用者操作後（如滑動、點擊）是否停止自動播放
                      pauseOnMouseEnter: true, // 滑鼠移入時是否暫停自動播放
                    }}
                    
                    breakpoints={{
                      0: { slidesPerView: 1, spaceBetween: 12 },
                      500: { slidesPerView: 1, spaceBetween: 12 },
                      776: { slidesPerView: 2, spaceBetween: 12 },
                      1200: { slidesPerView: 4, spaceBetween: 12 },
                    }}
                    
                    className="pb-5 pt-3 position-relative home-prodcut-swiper"
                  >
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <SwiperSlide
                          key={product.id}
                          className="swiper-slide card border-1 home-products-card "
                        >
                          <div>
                            <Link
                              to={`/products/${product.category}/${product.id}`}
                            >
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                style={{height:280}}
                                className="product-index-img w-100"
                              />
                            </Link>
                          </div>
                          <div className="card-body px-3 ">
                            <h6 className="card-title product-card-title fs-lg-5 text-nowrap fw-bold">
                              {product.title}
                            </h6>
                            <div className="card-text d-flex">
                              <p className="text-price fw-bold me-2">
                                NT${product.price}
                              </p>
                              <del className="fs-8 text-gray fw-normal">
                                NT${product.origin_price}
                              </del>
                            </div>
                          </div>
                          <div className="d-grid gap-2">

                          </div>
                        </SwiperSlide>
                      ))
                    ) : (
                      <p className="text-center mt-4">該分類暫無商品</p>
                    )}
                    {/* 關鍵：手動加入這兩個 div，並放在 Swiper 標籤內 */}
                    <div className="swiper-button-prev"></div>
                    <div className="swiper-button-next"></div>
                  </Swiper>
                </div>
                
              </div>
            </div>
        </div>

  </section>

  {/* <!--最新消息--> */}
  <div className="container my-5 news-section home">
      <div className="row align-items-center">
        {/* 左側新聞列表 */}
        <div className="col-md-7">
          <h2 className="news-title mb-4 ">
            最新消息 <span className="text-english">News</span>
          </h2>
          
          <div className="news-list">
            {newsData.map((item, index) => (
              <div key={index} className="news-item d-flex align-items-start py-3">
                <div className="news-date-box me-4 text-center">
                  <div className="news-year">{item.year}</div>
                  <div className="news-date">{item.date}</div>
                </div>
                <div className="news-content flex-grow-1">
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右側圖片 */}
        <div className="col-md-5 text-center">
          <img 
            src={news01}
            alt="" 
            className="img-fluid news-image"
          />
        </div>
      </div>
  </div>
  <Toast />
  </>
  );
}

export default Home;