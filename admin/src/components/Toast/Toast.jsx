/* eslint-disable react/prop-types */
import "./toast.css";

const Toast = ({ message, onClose }) => {
  return (
    <div className="toast">
      <div className="toast-content">
        <span>{message}</span>
        <button onClick={onClose} className="toast-close-btn">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
