
import footerlogo from '../images/footerlogo.jpg';


function Footer() {
  return (
    <div className="pt-lg-0 pt-0 pb-0">
      <footer className="footer pt-5 pt-lg-5">
        <div className="container">
          <div className="row align-items-center align-items-lg-start">
            
           {/* 左側：Logo 與 版權資訊 */}
          <div className="col-lg-8 text-center text-lg-start mb-5">
            
            {/* 使用 flex-column 讓內容垂直排列，並在 lg 斷點調整對齊方式 */}
            <div className="d-flex flex-column align-items-center align-items-lg-start mb-3">
              <img 
                src={footerlogo} 
                alt="logo" 
                style={{ height: 100, width: 100, objectFit: 'contain' }} 
              />          
              {/* <h5 className="text-white mt-2 mb-0">綠鮮農場</h5> */}
            </div>

            <p className="mb-0">© 2026 本站僅供學習使用，不提供商業用途</p>
          </div>

            {/* 中間：關於本站 */}
            <div className="col-lg-2 text-center text-lg-start">
              <div className="card mb-5">
                <div className="card-header fs-5 pb-2 pb-lg-3 pt-2 fs-lg-4 fw-bold">
                  關於本站
                </div>
                <ul className="list-group list-group-flush fs-6 fw-normal">
                  <li className="list-group-item d-flex align-items-center justify-content-center justify-content-lg-start py-2">
                    <span>隱私權政策</span>
                  </li>
                  <li className="list-group-item d-flex align-items-center justify-content-center justify-content-lg-start py-2">
                    <span>使用者條款</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 右側：聯絡我們 */}
            <div className="col-lg-2 text-center text-lg-start">
              <div className="card mb-5">
                <div className="card-header fs-5 pb-2 pb-lg-3 pt-2 fs-lg-4 fw-bold">
                  聯絡我們
                </div>
                <ul className="list-group list-group-flush fs-6 fw-normal">
                  {/* 第一行：電話 */}
                  <li className="list-group-item d-flex align-items-center justify-content-center justify-content-lg-start py-2">
                    <span className="me-3 fs-6 fs-lg-2 d-flex align-items-center">
                      <i className="bi bi-telephone-fill"></i>
                    </span>
                    <span>(03)3558855</span>
                  </li>
                  {/* 第二行：地址 */}
                  <li className="list-group-item d-flex align-items-center justify-content-center justify-content-lg-start py-2">
                    <span className="me-3 fs-6 fs-lg-2 d-flex align-items-center">
                      <i className="bi bi-geo-alt-fill"></i>
                    </span>
                    <span>桃園巿中正路</span>
                  </li>
                </ul>
              </div>
            </div>

          </div> {/* End Row */}
        </div> {/* End Container */}
      </footer>
    </div>
  );
}
export default Footer;