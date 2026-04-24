import { useEffect, Suspense, lazy } from 'react'; // 1. 引入 Suspense 與 lazy
import { Routes, Route, useLocation } from 'react-router-dom';
import Loading from './components/Loading'; // 2. 引入你剛剛建立的 Loading 元件

// --- 將頁面元件改為懶加載 (Lazy Load) ---
// 前台頁面
const FrontLayout = lazy(() => import('./pages/front/FrontLayout'));
const Home = lazy(() => import('./pages/front/Home'));
const About = lazy(() => import('./pages/front/About'));
const Products = lazy(() => import('./pages/front/Products'));
const ProductDetail = lazy(() => import('./pages/front/ProductDetail'));
const Cart = lazy(() => import('./pages/front/Cart'));
const Checkout = lazy(() => import('./pages/front/Checkout'));
const Payment = lazy(() => import('./pages/front/Payment'));

// 後台與登入
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));

// --- 自定義 ScrollToTop 組件 ---
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className='App'>
      <ScrollToTop />
      
      {/* 3. 使用 Suspense 包裹整個 Routes */}
      {/* 當路由切換，新的頁面組件還沒載入完成前，會自動顯示 fallback 裡的 Loading */}
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/' element={<FrontLayout />}>
            <Route path='' element={<Home />}></Route>
            <Route path='about' element={<About />}></Route>
            <Route path='products/:category?' element={<Products />}></Route>
            <Route path='products/:category/:id' element={<ProductDetail />}></Route>
            <Route path='cart' element={<Cart />}></Route>
            <Route path='payment' element={<Payment />}></Route>
            <Route path='checkout' element={<Checkout />}></Route>
            <Route path="/payment/:orderId" element={<Payment />} />
          </Route>
          
          <Route path='/login' element={<Login />}></Route>
          
          <Route path='/admin' element={<Dashboard />}>
            <Route path='products' element={<AdminProducts />}></Route>
            <Route path='coupons' element={<AdminCoupons />}></Route>
            <Route path='orders' element={<AdminOrders />}></Route>
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;