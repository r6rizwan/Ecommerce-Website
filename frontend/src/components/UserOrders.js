// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const UserOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const user_id = localStorage.getItem("userID");
//   const username = localStorage.getItem("userName");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3001/api/userorders/${user_id}`);
//         if (response.status === 200) {
//           setOrders(response.data.orders);
//         } else {
//           setError("Failed to fetch orders.");
//         }
//       } catch (err) {
//         console.error("Error fetching user orders:", err);
//         setError("An error occurred while fetching your orders.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user_id) fetchOrders();
//   }, [user_id]);

//   if (loading) return <p className="text-center mt-5">Loading your orders...</p>;
//   if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

//   return (
//     <div className="container my-5">
//       <h2 className="mb-4 text-center text-primary">My Orders</h2>
//       <h5 className="text-center mb-4">Welcome, {username}</h5>

//       {orders.length === 0 ? (
//         <p className="text-center">You haven’t placed any orders yet.</p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-bordered table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>Order ID</th>
//                 <th>Products</th>
//                 <th>Total Amount (₹)</th>
//                 <th>Status</th>
//                 <th>Payment</th>
//                 <th>Order Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.id}>
//                   <td className="fw-bold">{order.id}</td>
//                   <td>
//                     {order.products.map((product, index) => (
//                       <div key={index} className="d-flex align-items-center mb-2">
//                         {product.image && (
//                           <img
//                             src={`http://localhost:3001/uploads/${product.image}`}
//                             alt={product.name}
//                             className="me-2"
//                             style={{
//                               width: "50px",
//                               height: "50px",
//                               objectFit: "cover",
//                               borderRadius: "5px",
//                             }}
//                             onError={(e) => (e.target.src = "/default-product.png")}
//                           />
//                         )}
//                         <div>
//                           <div className="fw-semibold">{product.name}</div>
//                           <div className="text-muted small">
//                             ₹{product.price} × {product.qty} = ₹{product.total}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </td>
//                   <td className="fw-bold text-success">
//                     ₹{order.totalAmount?.toFixed(2)}
//                   </td>
//                   <td>
//                     <span
//                       className={`badge ${
//                         order.status === "Confirmed"
//                           ? "bg-success"
//                           : order.status === "Shipped"
//                           ? "bg-info text-dark"
//                           : order.status === "Delivered"
//                           ? "bg-primary"
//                           : "bg-secondary"
//                       }`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>
//                   <td>
//                     <span
//                       className={`badge ${
//                         order.paymentStatus === "Paid"
//                           ? "bg-success"
//                           : "bg-warning text-dark"
//                       }`}
//                     >
//                       {order.paymentStatus}
//                     </span>
//                   </td>
//                   <td>{new Date(order.orderDate).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserOrders;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const UserOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const user_id = localStorage.getItem("userID");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3001/api/userorders/${user_id}`);
//         if (response.status === 200) {
//           setOrders(response.data.orders);
//         } else {
//           setError("Failed to fetch orders.");
//         }
//       } catch (err) {
//         console.error("Error fetching user orders:", err);
//         setError("An error occurred while fetching your orders.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user_id) fetchOrders();
//   }, [user_id]);

//   if (loading)
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <div className="spinner-border text-primary" role="status"></div>
//         <span className="ms-2">Loading your orders...</span>
//       </div>
//     );

//   if (error)
//     return <p className="text-center mt-5 text-danger">{error}</p>;

//   return (
//     <div className="container my-5">
//       <h2 className="mb-4 text-center text-primary fw-bold">My Orders</h2>

//       {orders.length === 0 ? (
//         <p className="text-center fs-5 text-secondary">
//           You haven’t placed any orders yet.
//         </p>
//       ) : (
//         <div className="d-flex flex-column gap-4">
//           {orders.map((order) => (
//             <div key={order.id} className="card shadow-sm border-0 rounded-4">
//               <div className="card-header bg-light d-flex justify-content-between align-items-center rounded-top-4">
//                 <h6 className="mb-0 fw-bold text-primary">
//                   Order #{order.id}
//                 </h6>
//                 <span
//                   className={`badge px-3 py-2 ${
//                     order.status === "Confirmed"
//                       ? "bg-success"
//                       : order.status === "Shipped"
//                       ? "bg-info text-dark"
//                       : order.status === "Delivered"
//                       ? "bg-primary"
//                       : "bg-secondary"
//                   }`}
//                 >
//                   {order.status}
//                 </span>
//               </div>

//               <div className="card-body">
//                 {order.products.map((product, index) => (
//                   <div
//                     key={index}
//                     className="d-flex align-items-center mb-3 border-bottom pb-2"
//                   >
//                     <img
//                       src={`http://localhost:3001/uploads/${product.image}`}
//                       alt={product.name}
//                       className="me-3 rounded"
//                       style={{
//                         width: "60px",
//                         height: "60px",
//                         objectFit: "cover",
//                       }}
//                       onError={(e) =>
//                         (e.target.src = "/default-product.png")
//                       }
//                     />
//                     <div className="flex-grow-1">
//                       <div className="fw-semibold">{product.name}</div>
//                       <div className="text-muted small">
//                         ₹{product.price} × {product.qty} ={" "}
//                         <span className="fw-semibold text-dark">
//                           ₹{product.total}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 <div className="d-flex justify-content-between mt-3">
//                   <div>
//                     <span className="text-muted small">Payment:</span>
//                     <span
//                       className={`badge ms-2 ${
//                         order.paymentStatus === "Paid"
//                           ? "bg-success"
//                           : "bg-warning text-dark"
//                       }`}
//                     >
//                       {order.paymentStatus}
//                     </span>
//                   </div>
//                   <div className="fw-bold text-success fs-6">
//                     ₹{order.totalAmount?.toFixed(2)}
//                   </div>
//                 </div>
//               </div>

//               <div className="card-footer bg-white border-top text-muted small">
//                 <i className="bi bi-calendar-event me-2"></i>
//                 Ordered on:{" "}
//                 {new Date(order.orderDate).toLocaleString("en-IN", {
//                   dateStyle: "medium",
//                   timeStyle: "short",
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserOrders;



import React, { useEffect, useState } from "react";
import axios from "axios";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user_id = localStorage.getItem("userID");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/userorders/${user_id}`
        );
        if (response.status === 200) {
          setOrders(response.data.orders);
        } else {
          setError("Failed to fetch orders.");
        }
      } catch (err) {
        console.error("Error fetching user orders:", err);
        setError("An error occurred while fetching your orders.");
      } finally {
        setLoading(false);
      }
    };

    if (user_id) fetchOrders();
  }, [user_id]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-2">Loading your orders...</span>
      </div>
    );

  if (error)
    return <p className="text-center mt-5 text-danger">{error}</p>;

  const handlePayment = (amount) => {
    window.location.href = `/paybill?uid=${user_id}&price=${amount}`;
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center text-primary fw-bold">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center fs-5 text-secondary">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => {
            const isUnpaid = order.paymentStatus === "Unpaid";

            return (
              <div
                key={order.id}
                className={`card shadow-sm border-0 rounded-4 ${isUnpaid ? "border-warning border-2 bg-light" : ""
                  }`}
              >
                {/* Header */}
                <div
                  className={`card-header d-flex justify-content-between align-items-center rounded-top-4 ${isUnpaid ? "bg-warning-subtle" : "bg-light"
                    }`}
                >
                  <h6
                    className={`mb-0 fw-bold ${isUnpaid ? "text-warning" : "text-primary"
                      }`}
                  >
                    Order #{order.id}
                  </h6>
                  <span
                    className={`badge px-3 py-2 ${order.status === "Confirmed"
                        ? "bg-success"
                        : order.status === "Shipped"
                          ? "bg-info text-dark"
                          : order.status === "Delivered"
                            ? "bg-primary"
                            : "bg-secondary"
                      }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Body */}
                <div className="card-body">
                  {order.products.map((product, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center mb-3 border-bottom pb-2"
                    >
                      <img
                        src={`http://localhost:3001/uploads/${product.image}`}
                        alt={product.name}
                        className="me-3 rounded"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                        onError={(e) =>
                          (e.target.src = "/default-product.png")
                        }
                      />
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{product.name}</div>
                        <div className="text-muted small">
                          ₹{product.price} × {product.qty} ={" "}
                          <span className="fw-semibold text-dark">
                            ₹{product.total}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Payment + Total Row */}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <span className="text-muted small">Payment:</span>
                      <span
                        className={`badge ms-2 ${order.paymentStatus === "Paid"
                            ? "bg-success"
                            : "bg-warning text-dark"
                          }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div className="fw-bold text-success fs-6">
                      ₹{order.totalAmount?.toFixed(2)}
                    </div>
                  </div>

                  {/* Pay Now Button (if unpaid) */}
                  {isUnpaid && (
                    <div className="text-end mt-3">
                      <button
                        className="btn btn-warning fw-semibold"
                        onClick={() =>
                          handlePayment(order.totalAmount.toFixed(2))
                        }
                      >
                        <i className="bi bi-cash-coin me-2"></i> Pay Now
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="card-footer bg-white border-top text-muted small">
                  <i className="bi bi-calendar-event me-2"></i>
                  Ordered on:{" "}
                  {new Date(order.orderDate).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
