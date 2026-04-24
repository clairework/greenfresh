import PropTypes from 'prop-types';

function Banner({ 
  bannerImg, 
  title, 
  enTitle, 
  slogan1, 
  slogan2, 
  height = 250,      // 預設高度 200
  imgOpacity = 0.3,  // 預設圖片透明度 0.5
  overlayColor = 'rgba(103, 137, 98, 0.9)' // 預設標語背景顏色
  //overlayColor = 'rgba(235, 180, 102, 0.9)' // 預設標語背景顏色
}) {
  return (
    <section className="mt-0 mt-lg-6 position-relative">
      <div className="allProduct-banner-mx overflow-hidden position-relative">
        <img
          src={bannerImg}
          alt={title}
          style={{ 
            height: `${height}px`, 
            opacity: imgOpacity,
            objectFit: 'cover' 
          }}
          className="d-block w-100"
        />
        
        <div className="position-absolute top-50 start-50 translate-middle text-center w-100 px-3">
          {/* 第一排：標題 */}
          <div className="mb-2">
            <h4 className="d-inline-block bg-white bg-opacity-25 px-4 py-2 rounded-1 shadow-sm">
              <span className="fw-bold text-dark">{title}</span>
              {enTitle && (
                <span className="ms-2 fs-6 text-dark text-uppercase fw-light">
                  {enTitle}
                </span>
              )}
            </h4>
          </div>

          {/* 第二排：標語 */}
          {(slogan1 || slogan2) && (
            <div>
              <h2 className="d-inline-block px-4 py-3 text-white  rounded-1 shadow-sm" 
                  style={{ 
                    backgroundColor: overlayColor,
                    backdropFilter: 'blur(4px)',
                    fontSize: '1.5rem',
                    opacity: 0.75
                  }}>
                <span className="d-block d-lg-inline">{slogan1}</span>
                {slogan1 && slogan2 && <span className="mx-2 d-none d-lg-inline">|</span>}
                <span className="d-block d-lg-inline">{slogan2}</span>
              </h2>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

Banner.propTypes = {
  bannerImg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  enTitle: PropTypes.string,
  slogan1: PropTypes.string,
  slogan2: PropTypes.string,
  height: PropTypes.number,      // 高度屬性
  imgOpacity: PropTypes.number,  // 透明度屬性
  overlayColor: PropTypes.string // 背景顏色屬性
};

export default Banner;