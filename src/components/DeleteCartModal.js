import { useEffect, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../reduce/slice/toastSlice";
import PropTypes from "prop-types";

const baseUrl = process.env.REACT_APP_API_URL;
const apiPath = process.env.REACT_APP_API_PATH;

function DeleteCartModal({ getCartList, delModelRef }) {
  const delCartRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (delCartRef.current) {
      delModelRef.current = new Modal(delCartRef.current, {
        backdrop: false,
      });
    }
  }, [delModelRef]);

  const closeDelModal = () => {
    delModelRef.current.hide();
  };
  //清空購物車
  const removeCart = async () => {
    try {
      const res = await axios.delete(`${baseUrl}/v2/api/${apiPath}/carts`);
      console.log('清空購物車',res);
      dispatch(
        createAsyncMessage({
          text: res.data.message,
          type: "清空購物車成功",
          status: "success",
        }),
      );
      getCartList();
    } catch (error) {
      console.error("捕捉到的原始錯誤：", error); // 👈 這行最重要！
     const { message } = error.response.data;
      dispatch(
        createAsyncMessage({
          text: message.join("、"),
          type: "清空購物車失敗",
          status: "failed",
        }),
      );
    } finally {
      closeDelModal();
    }
  };
  return (
    <div
      className="modal fade"
      tabIndex="-1"
      ref={delCartRef}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">清空購物車</h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeDelModal}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">你是否要清空購物車?</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary px-5"
              onClick={closeDelModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary px-5 text-white"
              onClick={removeCart}
            >
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DeleteCartModal.propTypes = {
  getCartList: PropTypes.func.isRequired,
  delModelRef: PropTypes.shape({
    current: PropTypes.object,
  }).isRequired,
};

export default DeleteCartModal;
