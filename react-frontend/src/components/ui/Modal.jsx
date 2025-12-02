import { IoClose } from "react-icons/io5";
import "./Modal.css";

const Modal = ({ isOpen, onClose, title, message, buttons = [], tipo = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-teacher" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {title}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <IoClose />
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          {buttons.map((btn, index) => (
            <button
              key={index}
              className={`btn ${btn.className || ""} ${
                btn.variant === "success" || tipo === "exito" ? "btn-success" : ""
              }`}
              onClick={btn.onClick || onClose}
            >
              {btn.icon && <span className="btn-icon">{btn.icon}</span>}
              {btn.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;