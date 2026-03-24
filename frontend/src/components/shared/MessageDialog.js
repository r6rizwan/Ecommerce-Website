import React from "react";

const MessageDialog = ({ show, title = "Notice", message, onClose, buttonText = "OK" }) => {
  if (!show) return null;

  return (
    <div className="confirm-backdrop">
      <div className="confirm-dialog">
        <h5 className="confirm-title">{title}</h5>
        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button className="btn btn-primary" onClick={onClose}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDialog;
