import React from "react";

const ConfirmDialog = ({ show, title, message, onCancel, onConfirm }) => {
    if (!show) return null;

    return (
        <div className="confirm-backdrop">
            <div className="confirm-dialog">
                <h5 className="confirm-title">{title}</h5>
                <p className="confirm-message">{message}</p>

                <div className="confirm-actions">
                    <button className="btn btn-outline-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
