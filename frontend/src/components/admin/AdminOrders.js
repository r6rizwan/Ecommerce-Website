import React, { useEffect, useState } from "react";
import axios from "axios";
import { adminAuthHeader } from "../superAdmin/superAdminAuth";
import MessageDialog from "../shared/MessageDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const STATUS_FLOW = ["Confirmed", "Shipped", "Out for Delivery", "Delivered"];

const AdminOrderImageOrName = ({ image, name }) => {
  const [showName, setShowName] = useState(!(image && String(image).trim()));

  if (showName) {
    return <div className="order-thumb-fallback me-3">{name}</div>;
  }

  return (
    <img
      src={`${API_BASE_URL}/uploads/${image}`}
      alt={name}
      className="order-thumb me-3 img-frame img-cover"
      onError={() => setShowName(true)}
    />
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState({ show: false, title: "", message: "" });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/adminorders`, {
        headers: adminAuthHeader(),
      });
      setOrders(res.data.orders || []);
      console.log("Fetched orders:", res.data.orders);
    } catch {
      setError("Failed to load orders");
      setDialog({ show: true, title: "Load Failed", message: "Unable to fetch orders." });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderGroupId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/update-order-status`, {
        order_group_id: orderGroupId,
        status: newStatus,
      }, { headers: adminAuthHeader() });

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
      setDialog({ show: true, title: "Update Failed", message: "Failed to update order status." });
    }
  };

  const formatPrice = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  const filteredOrders = orders.filter((order) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      String(order.id).includes(q) ||
      String(order.customer_name || "").toLowerCase().includes(q) ||
      String(order.customer_email || "").toLowerCase().includes(q) ||
      String(order.status || "").toLowerCase().includes(q) ||
      String(order.paymentStatus || "").toLowerCase().includes(q)
    );
  });

  const paidCount = filteredOrders.filter((o) => o.paymentStatus === "Paid").length;
  const unpaidCount = filteredOrders.filter((o) => o.paymentStatus !== "Paid").length;
  const deliveredCount = filteredOrders.filter((o) => o.status === "Delivered").length;

  if (loading) {
    return (
      <section className="py-4">
        <h2 className="fw-bold text-center mb-4">Admin Orders</h2>
        <div className="container">
          <div className="d-flex flex-column gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={`sk-admin-${idx}`} className="card p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <div className="skeleton-line w-40 mb-2" />
                    <div className="skeleton-line w-60" />
                  </div>
                  <div className="skeleton-line w-30" />
                </div>
                <div className="order-item">
                  <div className="skeleton-box skeleton-square" />
                  <div className="flex-grow-1">
                    <div className="skeleton-line w-70 mb-2" />
                    <div className="skeleton-line w-50" />
                  </div>
                  <div className="skeleton-line w-40" />
                </div>
                <div className="order-item">
                  <div className="skeleton-box skeleton-square" />
                  <div className="flex-grow-1">
                    <div className="skeleton-line w-70 mb-2" />
                    <div className="skeleton-line w-50" />
                  </div>
                  <div className="skeleton-line w-40" />
                </div>
                <div className="d-flex justify-content-between align-items-center pt-3 mt-3 border-top">
                  <div className="skeleton-line w-40" />
                  <div className="skeleton-line w-30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section admin-orders-v3">
      <div className="admin-hero-v2 text-center mb-4">
        <h2 className="section-title">Admin Orders</h2>
        <p className="section-subtitle mx-auto mb-0">
          Review, update, and fulfill customer orders.
        </p>
      </div>

      <div className="container">
        <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-between mb-3 toolbar">
          <input
            type="search"
            className="form-control"
            placeholder="Search by order ID, name, email, status..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="text-muted small">
            {filteredOrders.length} results
          </span>
        </div>
        <div className="admin-order-kpi-v3 mb-3">
          <span className="chip">Paid: {paidCount}</span>
          <span className="chip">Unpaid: {unpaidCount}</span>
          <span className="chip">Delivered: {deliveredCount}</span>
        </div>
        <div className="d-flex flex-column gap-4">
          {error && filteredOrders.length === 0 && (
            <div className="text-center py-4 text-muted">{error}</div>
          )}
          {filteredOrders.length === 0 && (
            <div className="text-center py-5">
              <h5 className="fw-bold mb-2">No orders found</h5>
              <p className="text-muted mb-0">
                Try a different search term.
              </p>
            </div>
          )}

          {filteredOrders.map((order) => {
            const currentIndex = STATUS_FLOW.indexOf(order.status);

            return (
              <div
                key={order.id}
                className="card border-0 shadow-sm admin-panel-v2 admin-order-card-v3"
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
                      style={{ width: "190px" }}
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
                      <AdminOrderImageOrName image={p.image} name={p.product_name} />

                      <div className="flex-grow-1">
                        <div className="fw-semibold">
                          {p.product_name}
                        </div>
                        <small className="text-muted">
                          {formatPrice(p.price)} × {p.qty}
                        </small>
                      </div>

                      <div className="fw-bold text-success">
                        {formatPrice(p.total)}
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
                    {formatPrice(order.totalAmount)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <MessageDialog
        show={dialog.show}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog({ show: false, title: "", message: "" })}
      />
    </section>
  );
};

export default AdminOrders;
