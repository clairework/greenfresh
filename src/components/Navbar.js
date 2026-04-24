import { NavLink } from "react-router-dom";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCart } from '../reduce/slice/cartSlice';
import logoImg from '../images/logo.png';

function Navbar() {
  const dispatch = useDispatch();
  const carts = useSelector(state => state.cart.carts);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  return (
    <div className='bg-white sticky-top shadow-sm'>
      <div className='container'>
        <nav className='navbar navbar-expand-lg navbar-light bg-white px-0'>
          
          {/* 1. 漢堡選單按鈕 (手機版顯示在最左側) */}
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNav'
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>

          {/* 2. Logo 品牌名稱 */}
          <NavLink className='navbar-brand ms-2 ms-lg-0 d-flex align-items-center' to='/'>
            <img 
              src={logoImg}
              alt="Logo" 
              style={{ width: '40px', height: '40px', marginRight: '10px' }} 
            />
            <span className="fw-bold text-primary">綠鮮生態農場</span>
          </NavLink>

          {/* 3. 購物車按鈕 (手機版透過 order-lg-last 保持在右側) */}
          <div className='d-flex order-lg-last ms-auto'>
            <NavLink to='/cart' className='nav-link position-relative'>
              <div 
                className="position-relative d-flex align-items-center justify-content-center rounded-circle bg-light" 
                style={{ width: '45px', height: '45px', cursor: 'pointer' }}>
                <i className='bi bi-cart3 fs-4'></i>
                <span 
                  style={{ top: '15%', left: '85%' }}
                  className='position-absolute translate-middle badge rounded-pill bg-danger'>
                  {carts?.length || 0}
                </span>
              </div>
            </NavLink>
          </div>

          {/* 4. 被收納的選單內容 */}
          <div className='collapse navbar-collapse' id='navbarNav'>
            {/* 使用 mx-auto 讓選單在電腦版居中，或是 ms-auto 靠右 */}
            <ul className="navbar-nav ms-auto fw-bold text-center me-2">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  <span className="link-dark">首頁</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  <span className="link-dark">關於我們</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products">
                  <span className="link-dark">全部商品</span>
                </NavLink>
              </li>
            </ul>
          </div>

        </nav>
      </div>
    </div>
  );
}

export default Navbar;