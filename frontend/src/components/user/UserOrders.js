import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const OrderImageOrName = ({ image, name }) => {
  const [showName, setShowName] = useState(!(image && String(image).trim()));

  if (showName) {
    return <div className="order-thumb-fallback">{name}</div>;
  }

  return (
    <img
      src={`${API_BASE_URL}/uploads/${image}`}
      alt={name}
      className="order-thumb img-frame img-contain"
      onError={() => setShowName(true)}
    />
  );
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackingOrder, setTrackingOrder] = useState(null);
  const user_id = localStorage.getItem("userID");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/userorders/${user_id}`
        );
        if (res.status === 200) {
          setOrders(res.data.orders);
        } else {
          setError("Failed to fetch orders.");
        }
      } catch (err) {
        setError("An error occurred while fetching your orders.");
      } finally {
        setLoading(false);
      }
    };

    if (user_id) fetchOrders();
    else {
      setError("Please log in to view your orders.");
      setLoading(false);
    }
  }, [user_id]);

  const handlePayment = (amount) => {
    window.location.href = `/paybill?uid=${user_id}&price=${amount}`;
  };

  const handleReview = (productId) => {
    window.location.href = `/feedback?product_id=${productId}`;
  };

  const formatPrice = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  const trackingSteps = ["Confirmed", "Shipped", "Out for Delivery", "Delivered"];
  const getStatusIndex = (status) => trackingSteps.indexOf(status);
  const formatDateTime = (dateObj) =>
    dateObj.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  const getEta = (orderDate, status) => {
    const d = new Date(orderDate);
    if (Number.isNaN(d.getTime())) return "ETA unavailable";
    if (status === "Delivered") return "Delivered";
    const extraDays = status === "Out for Delivery" ? 0 : status === "Shipped" ? 1 : 3;
    d.setDate(d.getDate() + extraDays);
    return d.toLocaleDateString("en-IN", { dateStyle: "medium" });
  };
  const getTrackingEvents = (order) => {
    const base = new Date(order.orderDate);
    if (Number.isNaN(base.getTime())) return [];
    const currentIndex = getStatusIndex(order.status);

    const shipped = new Date(base);
    shipped.setHours(shipped.getHours() + 24);
    const outForDelivery = new Date(base);
    outForDelivery.setHours(outForDelivery.getHours() + 48);
    const delivered = new Date(base);
    delivered.setHours(delivered.getHours() + 72);

    return [
      {
        label: "Order Confirmed",
        time: base,
        done: currentIndex >= 0,
      },
      {
        label: "Shipped",
        time: shipped,
        done: currentIndex >= 1,
      },
      {
        label: "Out for Delivery",
        time: outForDelivery,
        done: currentIndex >= 2,
      },
      {
        label: "Delivered",
        time: delivered,
        done: currentIndex >= 3,
      },
    ].map((event, idx) => {
      if (event.done) {
        return {
          ...event,
          timeText: formatDateTime(event.time),
          note: "Completed",
        };
      }

      if (idx === currentIndex + 1) {
        return {
          ...event,
          timeText: `Expected by ${event.time.toLocaleDateString("en-IN", { dateStyle: "medium" })}`,
          note: "Expected",
        };
      }

      return {
        ...event,
        timeText: "Date will be shown after this step is reached",
        note: "Pending",
      };
    });
  };

  const paidOrders = orders.filter((o) => o.paymentStatus === "Paid").length;
  const unpaidOrders = orders.filter((o) => o.paymentStatus === "Unpaid").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="section-title">My Orders</h2>
            <p className="section-subtitle mx-auto">
              Track purchases, payment status, and delivery progress.
            </p>
          </div>
          <div style={{ maxWidth: "900px" }} className="mx-auto">
            <div className="d-flex flex-column gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div className="card p-4" key={`sk-order-${idx}`}>
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <div className="container text-center py-5">
          <h4 className="fw-bold mb-2">Could not load orders</h4>
          <p className="text-danger mb-3">{error}</p>
          <button className="btn btn-outline-primary" onClick={() => (window.location.href = "/login")}>
            Go to Login
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section order-page-v2">
      <div className="container">
        <div className="order-hero-v2 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-lg-7">
              <h2 className="section-title mb-1">My Orders</h2>
              <p className="section-subtitle mb-0">
                Track purchases, payment status, and delivery progress.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="order-stats-v2">
                <div className="order-stat-v2">
                  <span>Total</span>
                  <strong>{orders.length}</strong>
                </div>
                <div className="order-stat-v2">
                  <span>Paid</span>
                  <strong>{paidOrders}</strong>
                </div>
                <div className="order-stat-v2">
                  <span>Unpaid</span>
                  <strong>{unpaidOrders}</strong>
                </div>
                <div className="order-stat-v2">
                  <span>Delivered</span>
                  <strong>{deliveredOrders}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="fw-bold mb-2">No orders yet</h4>
            <p className="text-muted mb-4">
              Once you place an order, it will show up here.
            </p>
            <button
              className="btn btn-primary px-4"
              onClick={() => (window.location.href = "/userhome")}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ maxWidth: "980px" }} className="mx-auto">
            <div className="d-flex flex-column gap-4">

            {orders.map((order) => {
              const isUnpaid = order.paymentStatus === "Unpaid";

              return (
                <div key={order.id} className="card p-4 order-card-v2">

                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">Order #{order.id}</h6>
                      <small className="text-muted">
                        Ordered on{" "}
                        {new Date(order.orderDate).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </small>
                    </div>

                    <span
                      className={`badge ${order.status === "Confirmed"
                        ? "bg-success"
                        : order.status === "Shipped"
                          ? "bg-info text-dark"
                          : order.status === "Out for Delivery"
                            ? "bg-warning text-dark"
                          : order.status === "Delivered"
                            ? "bg-primary"
                            : "bg-secondary"
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="d-flex justify-content-end mb-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setTrackingOrder(order)}
                    >
                      Track Order
                    </button>
                  </div>

                  {order.products.map((product, index) => (
                    <div key={index}>
                      <div className="order-item py-3">

                        <OrderImageOrName image={product.image} name={product.name} />

                        <div className="order-details">
                          <div className="fw-semibold">{product.name}</div>
                          <div className="text-muted small mt-1">
                            {formatPrice(product.price)} × {product.qty}
                          </div>
                        </div>

                        <div className="order-actions">
                          <div className="fw-bold text-success mb-2">
                            {formatPrice(product.price * product.qty)}
                          </div>
                          {!isUnpaid && order.status === "Delivered" && (
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() =>
                                handleReview(product.id || product.pid)
                              }
                            >
                              Review
                            </button>
                          )}
                        </div>
                      </div>

                      {index !== order.products.length - 1 && (
                        <hr className="my-0" />
                      )}
                    </div>
                  ))}

                  {/* Footer */}
                  <div className="d-flex justify-content-between align-items-center pt-3 mt-3 border-top">
                    <div>
                      <span className="text-muted me-2">Payment:</span>
                      <span
                        className={`badge ${order.paymentStatus === "Paid"
                          ? "bg-success"
                          : "bg-warning text-dark"
                          }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div className="fw-bold text-success fs-5">
                      {formatPrice(order.totalAmount)}
                    </div>
                  </div>

                  {isUnpaid && (
                    <div className="text-end mt-3">
                      <button
                        className="btn btn-warning"
                        onClick={() =>
                          handlePayment(order.totalAmount.toFixed(2))
                        }
                      >
                        Pay Now
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        )}
      </div>

      {trackingOrder && (
        <div className="modal-backdrop-custom">
          <div className="modal-card order-track-modal-v2">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h6 className="fw-bold mb-0">Track Order #{trackingOrder.id}</h6>
                <small className="text-muted">
                  ETA: {getEta(trackingOrder.orderDate, trackingOrder.status)}
                </small>
              </div>
              <button className="btn btn-sm btn-light" onClick={() => setTrackingOrder(null)}>
                Close
              </button>
            </div>

            <div className="flipkart-track-v2 mt-3 mb-3">
              {trackingSteps.map((step, idx) => {
                const currentIndex = getStatusIndex(trackingOrder.status);
                const done = idx <= currentIndex;
                return (
                  <div key={`track-${step}`} className="fk-step-wrap-v2">
                    <div className={`fk-step-dot-v2 ${done ? "done" : ""}`}>{done ? "✓" : ""}</div>
                    {idx < trackingSteps.length - 1 && (
                      <div className={`fk-step-line-v2 ${idx < currentIndex ? "done" : ""}`} />
                    )}
                    <div className={`fk-step-label-v2 ${done ? "done" : ""}`}>{step}</div>
                  </div>
                );
              })}
            </div>

            <div className="track-events-v2 mb-3">
              {getTrackingEvents(trackingOrder).map((event, idx) => (
                <div className="track-event-row-v2" key={`${trackingOrder.id}-event-${idx}`}>
                  <div>
                    <div className="fw-semibold">{event.label}</div>
                    <div className="small text-muted">{event.timeText}</div>
                  </div>
                  <span className={`badge ${event.done ? "bg-success" : "bg-secondary"}`}>
                    {event.note}
                  </span>
                </div>
              ))}
            </div>

            <div className="small text-muted">
              {trackingOrder.status === "Delivered"
                ? "Your order has been delivered."
                : trackingOrder.status === "Out for Delivery"
                  ? "Your order is out for delivery."
                : trackingOrder.status === "Shipped"
                  ? "Your package is on the way."
                  : "Your order is confirmed and being prepared for shipment."}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserOrders;
