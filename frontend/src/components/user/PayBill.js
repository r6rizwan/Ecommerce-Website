import React from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import MessageDialog from "../shared/MessageDialog";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const PAYMENT_PROVIDER = (process.env.REACT_APP_PAYMENT_PROVIDER || "razorpay").toLowerCase();

const PayBill = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [dialog, setDialog] = React.useState({ show: false, title: "", message: "" });

  const uid = localStorage.getItem("userID");
  const totalParam = searchParams.get("total");
  const priceParam = searchParams.get("price");
  const total = Number(totalParam || priceParam || 0);

  const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;

  const openDialog = (title, message) => setDialog({ show: true, title, message });
  const closeDialog = () => setDialog({ show: false, title: "", message: "" });

  const paymentHandler = async (e) => {
    e.preventDefault();

    if (!uid) {
      openDialog("Login Required", "Please login to continue payment.");
      return;
    }

    if (!Number.isFinite(total) || total <= 0) {
      openDialog("Invalid Amount", "The payable amount is invalid.");
      return;
    }

    try {
      if (PAYMENT_PROVIDER === "mock") {
        const mockRes = await axios.post(`${API_BASE_URL}/api/payment/verify`, {
          uid,
          amount: total,
          razorpay_order_id: `mock_order_${Date.now()}`,
          razorpay_payment_id: `mock_payment_${Date.now()}`,
          razorpay_signature: "mock_signature",
        });

        if (!mockRes?.data?.success) {
          openDialog("Payment Failed", mockRes?.data?.message || "Payment could not be completed.");
          return;
        }

        window.dispatchEvent(new Event("cart-update"));
        navigate("/paysuccess");
        return;
      }

      if (!razorpayKey) {
        openDialog("Payment Config Missing", "Set REACT_APP_RAZORPAY_KEY_ID in frontend env.");
        return;
      }

      if (!window.Razorpay) {
        openDialog("Razorpay SDK Missing", "Refresh the page and try again.");
        return;
      }

      const orderRes = await axios.post(`${API_BASE_URL}/api/payment/create-order`, {
        uid,
        amount: total,
      });

      if (!orderRes?.data?.success || !orderRes?.data?.order?.id) {
        openDialog("Payment Failed", orderRes?.data?.message || "Could not create payment order.");
        return;
      }

      const { order } = orderRes.data;

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "E-Commerce App",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(`${API_BASE_URL}/api/payment/verify`, {
              uid,
              amount: total,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verifyRes?.data?.success) {
              openDialog("Verification Failed", verifyRes?.data?.message || "Payment verification failed.");
              return;
            }

            window.dispatchEvent(new Event("cart-update"));
            navigate("/paysuccess");
          } catch (error) {
            openDialog("Verification Failed", error?.response?.data?.message || "Payment verification failed.");
          }
        },
        theme: { color: "#0d6efd" },
      };

      const pay = new window.Razorpay(options);
      pay.on("payment.failed", () => {
        openDialog("Payment Failed", "Payment was not completed. Please try again.");
      });
      pay.open();
    } catch (error) {
      openDialog("Payment Failed", error?.response?.data?.message || "Unable to start payment.");
    }
  };

  return (
    <section className="section paybill-page-v2">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card p-4 p-lg-5 paybill-card-v2">
              <div className="text-center mb-4">
                <span className="chip">Secure Checkout</span>
                <h4 className="fw-bold mt-2 mb-2">Confirm Payment</h4>
                <p className="text-muted mb-0">Complete your order using Razorpay secure gateway.</p>
              </div>

              <div className="paybill-amount-v2 mb-4">
                <span>Payable Amount</span>
                <strong>₹{total.toFixed(2)}</strong>
              </div>

              <button className="btn btn-primary btn-lg w-100" onClick={paymentHandler} disabled={total <= 0}>
                Pay Now
              </button>

              <small className="text-muted d-block mt-3 text-center">
                You will be charged the exact amount shown above.
              </small>
            </div>
          </div>
        </div>
      </div>
      <MessageDialog
        show={dialog.show}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
      />
    </section>
  );
};

export default PayBill;
