
// 加上 { isLoading } 參數
const Loading = ({ isLoading }) => {
  // 如果 isLoading 是 false，就回傳 null (什麼都不渲染)
  if (!isLoading) return null;

  return (
    <div className="d-flex justify-content-center align-items-center" 
         style={{ 
           height: '100vh', 
           width: '100vw', 
           position: 'fixed', 
           top: 0, 
           left: 0, 
           backgroundColor: 'rgba(255, 255, 255, 0.7)', 
           zIndex: 9999 
         }}>
      <div className="text-center">
        <div className="spinner-border text-orange" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 fw-bold text-dark">正在努力加載中...</p>
      </div>
    </div>
  );
};

export default Loading;