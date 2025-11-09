// import React from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';

// const PayBill = () => {
//     const { id, price } = useParams();
//     const navigate = useNavigate();
//     const uid = localStorage.getItem("userID");

//     const paymentHandler = async (e) => {
//         e.preventDefault();
//         const amount = Number(price) * 100;
//         var options = {
//             key: "rzp_test_RcpYJahrNYiMkG",
//             key_secret: "Ycu2DEJwCQNG8D1aKlv2Tij6",
//             amount: amount,
//             currency: "INR",
//             name: "E-Commerce App",
//             description: "Test Transaction",
//             handler: function (response) {
//                 // alert(response.razorpay_payment_id);
//                 // alert("Payment Successful");
//                 axios.post(`http://localhost:3001/api/paybill/${id}/${price}`, {
//                     payment_id: response.razorpay_payment_id,
//                     uid: uid,
//                 }).then((response) => {
//                     alert("Payment has been done successfully");
//                     navigate("/paysuccess");
//                 }).catch((error) => {
//                     console.log(error);
//                 });
//             },
//             prefill: {
//                 name: "Rizwan Mulla",
//                 email: "rizwanmulla6@gmail.com",
//                 contact: "9620057555",
//             },
//             notes: {
//                 address: "Rizwan Mulla Corporate Office",
//             },
//             theme: {
//                 color: "#3369ccff",
//             }
//         };
//         var pay = new window.Razorpay(options);
//         pay.open();
//     };

//     return (
//         <div className="d-flex justify-content-center align-items-center vh-100">
//             <button className="btn btn-primary btn-lg" onClick={paymentHandler}>
//                 Pay Now ₹{price}
//             </button>
//         </div>
//     );
// };

// export default PayBill;


import React from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PayBill = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const uid = localStorage.getItem("userID");
    const price = searchParams.get("price"); // actual total cart price
    const displayPrice = Number(price).toFixed(2); // shown on button

    const paymentHandler = async (e) => {
        e.preventDefault();

        // 💡 Always send ₹1 (100 paise) for Razorpay testing
        const razorpayAmount = 1 * 100;

        const options = {
            key: "rzp_test_RcpYJahrNYiMkG",
            key_secret: "Ycu2DEJwCQNG8D1aKlv2Tij6",
            amount: razorpayAmount,
            currency: "INR",
            name: "E-Commerce App",
            description: "Test Transaction (₹1 only)",

            handler: async function (response) {
                try {
                    // 💾 Record the actual price in DB, not the ₹1 test value
                    await axios.post(`http://localhost:3001/api/paybill/${response.razorpay_payment_id}/${price}`, {
                        payment_id: response.razorpay_payment_id,
                        uid: uid,
                    });

                    alert("✅ Order placed successfully!");
                    window.dispatchEvent(new Event("cart-update"));
                    navigate("/userorders");
                } catch (error) {
                    console.error("Error updating payment:", error);
                    alert("❌ Something went wrong while updating your order.");
                }
            },

            prefill: {
                name: "Rizwan Mulla",
                email: "rizwanmulla6@gmail.com",
                contact: "9620057555",
            },
            notes: {
                address: "Rizwan Mulla Corporate Office",
            },
            theme: {
                color: "#3369ccff",
            },
        };

        const pay = new window.Razorpay(options);
        pay.open();
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <button className="btn btn-primary btn-lg" onClick={paymentHandler}>
                Pay ₹1 (Test Mode) for Order of ₹{displayPrice}
            </button>
        </div>
    );
};

export default PayBill;

