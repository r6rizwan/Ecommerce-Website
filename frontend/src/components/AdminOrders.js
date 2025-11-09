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

  if (loading) return <p className="text-center mt-5">Loading orders...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center text-primary">All Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
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
                  <td>{order.user_id}</td>
                  <td>
                    {order.products.map((product, index) => (
                      <div key={index}>
                        {product.product_name} (Qty: {product.qty})
                      </div>
                    ))}
                  </td>
                  <td>₹ {order.total_amount}</td>
                  <td>{order.status}</td>
                  <td>{order.payment_status}</td>
                  <td>{new Date(order.order_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
