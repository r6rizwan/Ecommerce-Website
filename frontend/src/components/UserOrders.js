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
        const res = await axios.get(
          `http://localhost:3001/api/userorders/${user_id}`
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
    return <p className="text-center text-danger mt-5">{error}</p>;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="section-title">My Orders</h2>
          <p className="section-subtitle mx-auto">
            Track purchases, payment status, and delivery progress.
          </p>
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
          <div style={{ maxWidth: "900px" }} className="mx-auto">
            <div className="d-flex flex-column gap-4">

            {orders.map((order) => {
              const isUnpaid = order.paymentStatus === "Unpaid";

              return (
                <div key={order.id} className="card p-4">

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
                          : order.status === "Delivered"
                            ? "bg-primary"
                            : "bg-secondary"
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Items */}
                  {order.products.map((product, index) => (
                    <div key={index}>
                      <div className="order-item py-3">

                        <img
                          src={`http://localhost:3001/uploads/${product.image}`}
                          alt={product.name}
                          className="order-thumb img-frame img-contain"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/default-product.png";
                          }}
                        />

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
    </section>
  );
};

export default UserOrders;
