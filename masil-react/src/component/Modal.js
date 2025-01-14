import React, { useEffect, useState } from "react";
import '../css/Modal.css';

const Modal = ({ isOpen, onClose, title, content,  actions, className}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (isOpen) {
        setIsVisible(true);
      }
    }, [isOpen]);

    const handleClose = () => {
      setIsVisible(false);
      onClose();
    };
  
    if (!isVisible && !isOpen) return null;
    return (
      <div className={`modal-backdrop ${isOpen ? "open" : ""}`}>
        <div
          className={`modal-content ${className || ""} ${isOpen ? "open" : ""}`}
          onTransitionEnd={() => {
            if (!isOpen) setIsVisible(false);
          }}
        >
          {title && <h2 className="modal-title">{title}</h2>}
          <div className="modal-body">
            {typeof content === "string" ? <p>{content}</p> : content}
          </div>
          <div className="modal-actions">
            {actions?.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={action.onClick}
                className={action.className || "modal-button"}
              >
                {action.label}
              </button>
            ))}
            {!actions.length && (
              <button className="default-close" onClick={handleClose}>확인</button>
            )}
          </div>
        </div>
      </div>
    );
};

export default Modal;
