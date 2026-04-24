
import bannerImg from '../../images/bannerAbout.jpg';
import Banner from '../../components/Banner';

function About() {
  return (
    <>
       <section className="mt-6 ">
            <div>
               <Banner 
                  bannerImg={bannerImg}
                  title="關於我們"
                  enTitle="About"
                  slogan1="我們的熱愛 奉献在這遍土地上"
                  slogan2=""
                  height={350}
                  imgOpacity ={1}
                />
            </div>
        </section>

      <div className="container">
        <div className="banner">
          <div className="content-block row g-lg-5 g-0 w-100 my-4 px-0">
            {/* <div className="col d-lg-none number mb-5 ms-3">01</div> */}
            <div className="col-12 col-lg-6">
              <img className="mb-0 w-100 rounded-4" 
              alt=""
              src="https://plus.unsplash.com/premium_photo-1661811677567-6f14477aa1fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFybXxlbnwwfHwwfHx8MA%3D%3D" />
            </div>
            <div className="col-lg-6 card border-0 h-100 px-0 mb-lg-5 mb-2 mb-lg-0">
              <div className="card-body d-flex flex-column justify-content-between py-0 px-0 px-lg-4">
                <h5 className="card-title number ms-auto d-none d-lg-block fw-bold pt-3">
                  我們的理念
                </h5>
                <div
                  className="bgchange py-lg-6 py-4  fs-lg-5 fs-6 "
                  style={{ borderRadius: '16px' }}
                >
                  <p className="card-text">
                    我們相信，最鮮美的風味，始終藏在自然的循環裡。「綠鮮農場」成立的初衷，是想找回土地與餐桌之間那條最短、最純粹的距離。我們堅持順應時節，不驚動土地的節奏，讓每一株作物在陽光與微風中緩慢熟成。我們不只種植蔬菜，更在培育一份對生命的敬意，希望將這份剛從土地採摘的生命力，完整地傳遞到每個家庭的餐桌。
                    <br />
                  
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="content-block row g-lg-5 g-0 w-100 my-lg-4 my-0 px-0 d-flex flex-lg-row-reverse">
            <div className="col-12 col-lg-6">
              <img className="mb-0 mb-lg-5 mb-sm-0 w-100 rounded-4" 
              alt=""
              src="https://plus.unsplash.com/premium_photo-1661811677567-6f14477aa1fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFybXxlbnwwfHwwfHx8MA%3D%3D" />
            </div>
            <div className="col-lg-6 card border-0 h-100 px-0 mb-5 mb-lg-0">
              <div className="card-body d-flex flex-column justify-content-between py-0 px-0 px-lg-4">
                <h5 className="card-title d-none d-lg-block fw-bold pt-3">
                  品質掌控與專業誠信
                </h5>
                <div
                  className=" py-lg-6 py-4  fs-lg-5 fs-6 bgchange"
                  style={{ borderRadius: '16px' }}
                >
                  <p>
                    綠色永續的耕作技術，以及極致新鮮的配送標準。我們以專業的職人精神守護每一寸田地，從選種、灌溉到採收，皆經過嚴格的檢測與把關。我們深知「食」的安全是生活的根本，因此我們致力於建立一個透明、可溯源的農業體系，讓每一口清脆的滋味，都成為守護家人健康的信賴基石。
                    <br />
                    
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="content-block row g-lg-5 g-0 w-100 my-lg-11 my-0 px-0">
            <div className="col-12 col-lg-6">
            </div>
            <div className="col-lg-6 card border-0 h-100 px-0 mb-8 mb-lg-0">
              <div className="card-body d-flex flex-column justify-content-between py-0 px-0 px-lg-4">
                <h5 className="card-title ms-auto d-none d-lg-block fw-bold pt-3">
                  守護大地，共創綠境
                </h5>
                <div
                  className="bgchange py-lg-6 py-4  fs-lg-5 fs-6"
                  style={{ borderRadius: '16px' }}
                >
                  <p>
                   每一顆種子都承載著對未來的期許。我們透過永續農業的實踐，致力於尋求人類飲食與生態環境的平衡。透過減少化學干預、循環利用資源，我們守護著孕育生命的土壤，讓農業不再只是單向的取用，而是與大地共生共榮。選擇綠鮮，不僅是選擇了優質的農產品，更是與我們一同支持友善環境的生活方式，為下一代留下翠綠的明天。
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      
    </>
  );
}

export default About;
