import React from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const PayBill = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const uid = localStorage.getItem("userID");
    const total = searchParams.get("total");
    const payableAmount = Math.round(Number(total || 0) * 100);

    const paymentHandler = async (e) => {
        e.preventDefault();

        const razorpayAmount = payableAmount;

        const options = {
            key: "rzp_test_RcpYJahrNYiMkG",
            key_secret: "Ycu2DEJwCQNG8D1aKlv2Tij6",
            amount: razorpayAmount,
            currency: "INR",
            name: "E-Commerce App",
            description: "Order Payment",
            handler: async function (response) {
                try {
                    await axios.post(
                        `http://localhost:3001/api/paybill/${response.razorpay_payment_id}/${total}`,
                        {
                            payment_id: response.razorpay_payment_id,
                            uid: uid,
                        }
                    );

                    window.dispatchEvent(new Event("cart-update"));
                    navigate("/paysuccess");
                } catch (error) {
                    alert("Error updating payment.");
                }
            },

            prefill: {
                name: "Rizwan Mulla",
                email: "rizwanmulla6@gmail.com",
                contact: "9620057555",
            },
            theme: { color: "#0d6efd" },
        };

        const pay = new window.Razorpay(options);
        pay.open();
    };

    return (
        <section className="section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-4">

                    <div className="card p-4 text-center">
                        <h4 className="fw-bold mb-2">Confirm Payment</h4>
                        <p className="text-muted mb-4">
                            Order Amount: <strong>₹{total}</strong>
                        </p>

                        <button
                            className="btn btn-primary btn-lg w-100"
                            onClick={paymentHandler}
                        >
                            Pay Now
                        </button>

                        <small className="text-muted d-block mt-3">
                            You will be charged the order total shown above.
                        </small>
                    </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default PayBill;
