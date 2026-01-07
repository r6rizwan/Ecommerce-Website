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
  }, [user_id]);

  const handlePayment = (amount) => {
    window.location.href = `/paybill?uid=${user_id}&price=${amount}`;
  };

  const handleReview = (productId) => {
    window.location.href = `/feedback?product_id=${productId}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary"></div>
        <span className="ms-2">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-danger mt-5">{error}</p>;
  }

  return (
    <section className="py-5">
      <h2 className="fw-bold text-center mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-muted fs-5">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <div className="container" style={{ maxWidth: "900px" }}>
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
                      <div className="d-flex align-items-start gap-3 py-3">

                        <img
                          src={`http://localhost:3001/uploads/${product.image}`}
                          alt={product.name}
                          className="rounded"
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "contain",
                          }}
                          onError={(e) =>
                            (e.target.src = "/default-product.png")
                          }
                        />

                        <div className="flex-grow-1">
                          <div className="fw-semibold">{product.name}</div>
                          <div className="text-muted small">
                            ₹{product.price} × {product.qty}
                          </div>
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
                      ₹{order.totalAmount?.toFixed(2)}
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
    </section>
  );
};

export default UserOrders;
