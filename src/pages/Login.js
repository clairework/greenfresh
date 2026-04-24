import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: '',
    password: '',
  });
  const [loginState, setLoginState] = useState({});
  const [loading, setLoading] = useState(false); // 新增 Loading 狀態

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault(); // 確保表單不刷新
    setLoading(true);
    try {
      const res = await axios.post('/v2/admin/signin', data);
      const { token, expired } = res.data;
      
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      
      if (res.data.success) {
        navigate('/admin/products');
      }
    } catch (error) {
      setLoginState(error.response?.data || { message: '登入失敗，請檢查網路連線' });
    } finally {
      setLoading(false);
    }
  };

  return (
    // 使用 min-vh-100 讓內容垂直置中，bg-light 增加背景色
    <div className='bg-light min-vh-100 d-flex align-items-center'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-5 col-lg-4'>
            {/* 卡片樣式 */}
            <div className='card shadow-sm border-0 rounded-4'>
              <div className='card-body p-5'>
                <h2 className='text-center fw-bold mb-4'>管理員登入</h2>

                {/* 錯誤訊息 */}
                {loginState.message && (
                  <div className='alert alert-danger py-2 text-center' role='alert'>
                    <small>{loginState.message}</small>
                  </div>
                )}

                <form onSubmit={submit}>
                  <div className='mb-3'>
                    <label htmlFor='email' className='form-label'>
                      帳號 (Email)
                    </label>
                    <input
                      id='email'
                      className='form-control form-control-lg' // 讓輸入框大一點比較好按
                      name='username'
                      type='email'
                      placeholder='name@example.com'
                      required
                      onChange={handleChange}
                    />
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='password' className='form-label'>
                      密碼
                    </label>
                    <input
                      type='password'
                      className='form-control form-control-lg'
                      name='password'
                      id='password'
                      placeholder='請輸入密碼'
                      required
                      onChange={handleChange}
                    />
                  </div>

                  <button 
                    type='submit' 
                    className='btn btn-primary btn-lg w-100 fw-bold'
                    disabled={loading} // 載入中禁用按鈕
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : '立即登入'}
                  </button>
                </form>

                <p className='mt-4 mb-0 text-muted text-center'>
                  <small>© 2026 綠鮮生態農場</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;