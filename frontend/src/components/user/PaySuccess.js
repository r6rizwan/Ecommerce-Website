import React from "react";
import { useNavigate } from "react-router-dom";

const PaySuccess = () => {
  const navigate = useNavigate();

  return (
    <section className="section paysuccess-page-v2">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">

          <div className="card p-5 text-center paysuccess-card-v2">
            <div className="success-icon-wrap mb-3">
              <i className="bi bi-check-circle-fill text-success fs-1"></i>
            </div>

            <h3 className="fw-bold text-success mb-2">
              Payment Successful
            </h3>

            <p className="text-muted mb-4">
              Thank you for your purchase. Your order has been placed
              successfully.
            </p>

            <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
              <span className="chip">Order Confirmed</span>
              <span className="chip">Payment Received</span>
              <span className="chip">Tracking Soon</span>
            </div>

            <div className="d-flex flex-column gap-2">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/userorders")}
              >
                View My Orders
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/userhome")}
              >
                Continue Shopping
              </button>
            </div>
          </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default PaySuccess;
