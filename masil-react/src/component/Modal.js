import React, { useEffect, useState } from "react";
import "../css/Modal.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  content,
  message,
  actions,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 200);
    } else {
      setTimeout(() => setIsVisible(false), 500);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible && !isOpen) return null;

  const displayContent = content || message;

  return (
    isVisible && (
      <div className={`modal-backdrop ${isOpen ? "open" : ""}`}>
        <div
          className={`modal-content ${className || ""} ${isOpen ? "open" : ""}`}
        >
          {title && <h2 className="modal-title">{title}</h2>}
          <div className="modal-body">
            {typeof displayContent === "string" ? (
              <p>{displayContent}</p>
            ) : (
              displayContent
            )}
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
            {(!actions || !actions.length) && (
              <button className="default-close" onClick={handleClose}>
                확인
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
