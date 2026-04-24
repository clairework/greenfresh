import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { useEffect} from 'react';
import Toast from '../../components/Toast';
import logoImg from '../../images/logo.png';


function Dashboard() {
  const navigate = useNavigate();


  const logout = () => {
    document.cookie = 'hexToken=;';
    navigate('/login');
  };

  // 取出 Token
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('hexToken='))
    ?.split('=')[1];
  axios.defaults.headers.common['Authorization'] = token;
  useEffect(() => {
    if (!token) {
      return navigate('/login');
    }
    (async () => {
      try {
        await axios.post('/v2/api/user/check');
      } catch (error) {
        if (!error.response.data.success) {
          navigate('/login');
        }
      }
    })();
  }, [navigate, token]);

  return (
    
    <>
      {/* 導覽列：固定在頂部 */}
      <nav className='navbar navbar-expand-lg bg-dark shadow-sm py-3' style={{ height: '72px' }}>
        <div className='container-fluid'>
          <p className='text-white mb-0 fw-bold d-flex align-items-center'>
            <img 
              src={logoImg}
              alt="Logo" 
              style={{ width: '40px', height: '40px', marginRight: '10px' }} 
            />
            綠鮮生態農場 後台管理系統
          </p>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNav'
          >
            <span className='navbar-toggler-icon' />
          </button>
          <div className='collapse navbar-collapse justify-content-end' id='navbarNav'>
            <ul className='navbar-nav'>
              <li className='nav-item'>
                <button
                  type='button'
                  className='btn btn-sm btn-outline-light px-3'
                  onClick={logout}
                >
                  登出系統
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* 主要內容區：設定高度為 100vh - Navbar 高度 */}
      <div className='d-flex' style={{ height: 'calc(100vh - 72px)', overflow: 'hidden' }}>
        
        {/* 左側選單欄位 */}
        <div 
          className='bg-white border-end d-flex flex-column' 
          style={{ width: '220px', flexShrink: 0 }}
        >
          {/* 上半部：選單項目 (若項目過多會在此區塊內捲動) */}
          <div className='flex-grow-1 overflow-y-auto pt-3'>
            <ul className='list-group list-group-flush'>
              <NavLink
                className={({ isActive }) => 
                  `list-group-item list-group-item-action py-3 border-0 d-flex align-items-center ${isActive ? 'bg-secondary text-dark fw-bold border-start border-primary border-4' : 'text-dark'}`
                }
                to='/admin/products'
              >
                <i className='bi bi-box-seam me-3' />
                產品管理
              </NavLink>
              <NavLink
                className={({ isActive }) => 
                  `list-group-item list-group-item-action py-3 border-0 d-flex align-items-center ${isActive ? 'bg-secondary text-dark fw-bold border-start border-primary border-4' : 'text-dark'}`
                }
                to='/admin/coupons'
              >
                <i className='bi bi-ticket-perforated me-3' />
                優惠券管理
              </NavLink>
              <NavLink
                className={({ isActive }) => 
                  `list-group-item list-group-item-action py-3 border-0 d-flex align-items-center ${isActive ? 'bg-secondary text-dark fw-bold border-start border-primary border-4' : 'text-dark'}`
                }
                to='/admin/orders'
              >
                <i className='bi bi-receipt me-3' />
                訂單管理
              </NavLink>
            </ul>
          </div>

          {/* 下半部：固定在底部的按鈕區 */}
          <div className='p-3 border-top'>
            <NavLink
              className='btn btn-outline-primary w-100 py-2 d-flex align-items-center justify-content-center'
              to='/'
            >
              <i className='bi bi-house-door me-2' />
              回前台首頁
            </NavLink>
          </div>
        </div>

        {/* 右側內容區：獨立捲軸 */}
        <div className='flex-grow-1 bg-light p-4 overflow-auto'>
          {token && <Outlet />}
        </div>
      </div>

      {/* 吐司訊息組件 */}
      <Toast />
    </>
  );
}

export default Dashboard;