import React, { useEffect, useState } from "react";
import '../css/Modal.css';

const Modal = ({ isOpen, onClose, title, content,  actions, className}) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
      if (isOpen) {
        setTimeout(()=> setIsVisible(true), 200);
      }else{
        setTimeout(()=> setIsVisible(false), 500);
      }
    }, [isOpen]);

    const handleClose = () => {
      setIsVisible(false);
      onClose();
    };
  
    if (!isVisible && !isOpen) return null;
    return (
      isVisible && (
      <div className={`modal-backdrop ${isOpen ? "open" : ""}`}>
        <div className={`modal-content ${className || ""} ${isOpen ? "open" : ""}`}>
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
      )
    );
};

export default Modal;
