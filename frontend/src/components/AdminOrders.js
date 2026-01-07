import React, { useEffect, useState } from "react";
import axios from "axios";

const STATUS_FLOW = ["Confirmed", "Shipped", "Delivered"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/adminorders");
      setOrders(res.data.orders || []);
      console.log("Fetched orders:", res.data.orders);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderGroupId, newStatus) => {
    try {
      await axios.put("http://localhost:3001/api/update-order-status", {
        order_group_id: orderGroupId,
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderGroupId
            ? { ...o, status: newStatus }
            : o
        )
      );

      fetchOrders();

    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  return (
    <section className="py-4">
      <h2 className="fw-bold text-center mb-4">Admin Orders</h2>

      <div className="container">
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => {
            const currentIndex = STATUS_FLOW.indexOf(order.status);

            return (
              <div
                key={order.id}
                className="card border-0 shadow-sm"
              >
                {/* HEADER */}
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold">
                      Order #{order.id}
                    </div>
                    <small className="text-muted">
                      {order.customer_name} · {order.customer_email}
                    </small>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span
                      className={`badge ${order.paymentStatus === "Paid"
                        ? "bg-success"
                        : "bg-warning text-dark"
                        }`}
                    >
                      {order.paymentStatus}
                    </span>

                    <select
                      className="form-select form-select-sm"
                      style={{ width: "150px" }}
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(
                          order.id,
                          e.target.value
                        )
                      }
                      disabled={order.status === "Delivered"}
                    >
                      {STATUS_FLOW.map((s, idx) => (
                        <option
                          key={s}
                          value={s}
                          disabled={idx < currentIndex}
                        >
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="card-body p-0">
                  {order.products.map((p, i) => (
                    <div
                      key={i}
                      className="d-flex align-items-center px-4 py-3 border-bottom"
                    >
                      <img
                        src={`http://localhost:3001/uploads/${p.image}`}
                        alt={p.product_name}
                        className="rounded me-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />

                      <div className="flex-grow-1">
                        <div className="fw-semibold">
                          {p.product_name}
                        </div>
                        <small className="text-muted">
                          ₹{p.price} × {p.qty}
                        </small>
                      </div>

                      <div className="fw-bold text-success">
                        ₹{p.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Ordered on{" "}
                    {new Date(order.orderDate).toLocaleString("en-IN")}
                  </small>

                  <div className="fw-bold text-success">
                    ₹{order.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AdminOrders;
