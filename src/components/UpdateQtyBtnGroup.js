import PropTypes from 'prop-types';

function UpdateQtyBtnGroup({ itemQty, onClickfn1, onClickfn2, maxQty }) {
  return (
    <div className="me-2 d-flex">
      <button
        type="button"
        className="btn btn-secondary text-primary fs-2 d-flex align-items-center justify-content-center rounded-0"
        style={{ width: '40px', height: '40px' }}
        onClick={onClickfn1}
        disabled={itemQty === 1}
      >
        <span className="material-symbols-outlined">
          <i className='bi bi-dash'></i>
          </span>
      </button>
      <button
        className="btn border border-secondary  py-0 rounded-0"
        style={{ width: '70px', cursor: 'auto', height: '40px' }}
      >
        {itemQty}
      </button>
      
      <button
        type="button"
        className="btn btn-secondary text-primary fs-2 d-flex align-items-center justify-content-center rounded-0"
        style={{ width: '40px', height: '40px' }}
        onClick={onClickfn2}
        disabled={itemQty >= maxQty}
      > 
        <span className="material-symbols-outlined">
           <i className='bi bi-plus'></i> 
        </span>
      </button>
    </div>
  );
}

UpdateQtyBtnGroup.propTypes = {
  itemQty: PropTypes.number.isRequired,
  onClickfn1: PropTypes.func.isRequired,
  onClickfn2: PropTypes.func.isRequired,
  maxQty: PropTypes.number,
};
export default UpdateQtyBtnGroup;