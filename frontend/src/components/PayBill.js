import React from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const PayBill = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const uid = localStorage.getItem("userID");
    const price = searchParams.get("price");

    const paymentHandler = async (e) => {
        e.preventDefault();

        const razorpayAmount = 1 * 100; // ₹1 test

        const options = {
            key: "rzp_test_RcpYJahrNYiMkG",
            key_secret: "Ycu2DEJwCQNG8D1aKlv2Tij6",
            amount: razorpayAmount,
            currency: "INR",
            name: "E-Commerce App",
            description: "Test Payment (₹1)",
            handler: async function (response) {
                try {
                    await axios.post(
                        `http://localhost:3001/api/paybill/${response.razorpay_payment_id}/${price}`,
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
                            Order Amount: <strong>₹{price}</strong>
                        </p>

                        <button
                            className="btn btn-primary btn-lg w-100"
                            onClick={paymentHandler}
                        >
                            Pay Now
                        </button>

                        <small className="text-muted d-block mt-3">
                            * Test mode: ₹1 will be charged
                        </small>
                    </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default PayBill;
