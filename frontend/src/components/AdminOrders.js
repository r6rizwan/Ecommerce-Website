// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/api/adminorders");
//         if (response.status === 200) {
//           setOrders(response.data.orders);
//         } else {
//           setError("Failed to fetch orders.");
//         }
//       } catch (err) {
//         console.error("Error fetching admin orders:", err);
//         setError("An error occurred while fetching orders.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading) return <p className="text-center mt-5">Loading orders...</p>;
//   if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

//   return (
//     <div className="container my-5">
//       <h2 className="mb-4 text-center text-primary">All Orders</h2>

//       {orders.length === 0 ? (
//         <p className="text-center">No orders found.</p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-bordered table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>Order ID</th>
//                 <th>User ID</th>
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
//                   <td>{order.user_id}</td>
//                   <td>
//                     {order.products.map((product, index) => (
//                       <div key={index}>
//                         {product.product_name} (Qty: {product.qty})
//                       </div>
//                     ))}
//                   </td>
//                   <td>₹ {order.total_amount}</td>
//                   <td>{order.status}</td>
//                   <td>{order.payment_status}</td>
//                   <td>{new Date(order.order_date).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminOrders;


import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/adminorders");
        if (response.status === 200) {
          setOrders(response.data.orders);
        } else {
          setError("Failed to fetch orders.");
        }
      } catch (err) {
        console.error("Error fetching admin orders:", err);
        setError("An error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-2">Loading orders...</span>
      </div>
    );

  if (error)
    return <p className="text-center text-danger mt-5">{error}</p>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 text-primary fw-bold">All Customer Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center fs-5 text-secondary">No orders found.</p>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`card shadow-sm border-0 rounded-4 ${order.paymentStatus === "Unpaid" ? "border-warning border-2 bg-light" : ""
                }`}
            >
              {/* Header */}
              <div
                className={`card-header d-flex justify-content-between align-items-center ${order.paymentStatus === "Unpaid" ? "bg-warning-subtle" : "bg-light"
                  }`}
              >
                <div>
                  <h6 className="mb-0 fw-bold text-primary">
                    Order #{order.id}
                  </h6>
                  <small className="text-muted">
                    {order.customer_name} ({order.customer_email})
                  </small>
                </div>
                <span
                  className={`badge ${order.status === "Confirmed"
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
                      alt={product.product_name}
                      className="me-3 rounded"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                      onError={(e) => (e.target.src = "/default-product.png")}
                    />
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{product.product_name}</div>
                      <div className="text-muted small">
                        ₹{product.price} × {product.qty} ={" "}
                        <span className="fw-semibold text-dark">
                          ₹{product.total}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

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
                    ₹{order.totalAmount.toFixed(2)}
                  </div>
                </div>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
