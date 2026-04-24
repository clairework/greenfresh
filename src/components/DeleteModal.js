function DeleteModal({ close, text, handleDelete, id }) {
  return (
    <div
      className='modal fade'
      tabIndex='-1'
      id='deleteModal'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content border-0 shadow-lg '>
          <div className='modal-header border-bottom-0 pt-4 px-4 bg-gray100'>
            <h5 className='modal-title fw-bold text-danger' id='exampleModalLabel'>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              確認刪除
            </h5>
            <button
              type='button'
              className='btn-close shadow-none'
              aria-label='Close'
              onClick={close}
            />
          </div>

          {/* Body 強化重點文字 */}
          <div className='modal-body px-4 py-3'>
            <p className='text-dark mb-0 fw-bold'>
              您確定要刪除嗎？
            </p>
            <small className='text-muted '>此動作執行後將無法還原，請謹慎操作。</small>
          </div>

          {/* Footer 調整按鈕間距與外觀 */}
          <div className='modal-footer border-top-0 pb-4 px-4 bg-gray100'>
            <button 
              type='button' 
              className='btn btn-light border px-4' 
              onClick={close}
            >
              取消
            </button>
            <button
              type='button'
              className='btn btn-danger px-4 shadow-sm'
              onClick={() => handleDelete(id)}
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;