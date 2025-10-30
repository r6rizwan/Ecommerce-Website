import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/orders");
        if (response.status === 200) {
          setOrders(response.data.orders);
        } else {
          setError("Failed to fetch orders.");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
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
          <table className="table table-bordered table-hover">
            <thead className="table-primary">
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Products</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.username}</td>
                  <td>
                    {order.products.map((p, index) => (
                      <div key={index}>
                        {p.name} (x{p.quantity})
                      </div>
                    ))}
                  </td>
                  <td>₹{order.totalAmount.toFixed(2)}</td>
                  <td>{order.status}</td>
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

export default AdminOrders;
