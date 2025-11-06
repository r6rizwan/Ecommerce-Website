import React, { useEffect, useState } from "react";
import axios from "axios";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user_id = localStorage.getItem("userID");
  const username = localStorage.getItem("userName");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/userorders/${user_id}`);
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

    fetchOrders();
  }, [user_id]);

  if (loading) return <p className="text-center mt-5">Loading your orders...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center text-primary">My Orders</h2>
      <h5 className="text-center mb-4">Welcome, {username}</h5>

      {orders.length === 0 ? (
        <p className="text-center">You haven’t placed any orders yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Products</th>
                <th>Total Amount (₹)</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="fw-bold">{order.id}</td>
                  <td>
                    {order.products.map((product, index) => (
                      <div key={index}>
                        {product.name} — ₹{product.price} × {product.qty} = ₹{product.total}
                      </div>
                    ))}
                  </td>
                  <td className="fw-bold text-success">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === "Confirmed"
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
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        order.paymentStatus === "Paid" ? "bg-success" : "bg-warning text-dark"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
