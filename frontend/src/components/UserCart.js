import React, { useEffect, useState } from "react";
import axios from "axios";

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = localStorage.getItem("userID");

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/getcartitems/${user_id}`)
      .then((res) => setCartItems(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user_id]);

  const handleQuantityChange = (id, qty) => {
    if (qty < 1) return;

    axios
      .put(`http://localhost:3001/api/updatecart/${id}`, { qty })
      .then(() => {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, qty: Number(qty), total: item.price * qty }
              : item
          )
        );
      })
      .catch((err) => console.error(err));
  };

  const handleStep = (id, currentQty, delta) => {
    const nextQty = Math.max(1, Number(currentQty) + delta);
    handleQuantityChange(id, nextQty);
  };

  const handleRemove = (id) => {
    axios
      .delete(`http://localhost:3001/api/deletefromcart/${id}`)
      .then(() => {
        window.dispatchEvent(new Event("cart-update"));
        setCartItems((prev) => prev.filter((i) => i.id !== id));
      })
      .catch((err) => console.error(err));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);
  const taxEstimate = totalPrice * 0.05;
  const shippingEstimate = totalPrice > 0 ? 49 : 0;
  const grandTotal = totalPrice + taxEstimate + shippingEstimate;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="container" style={{ maxWidth: "1000px" }}>
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card p-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={`sk-cart-${idx}`} className="d-flex gap-3 py-3">
                    <div className="skeleton-box skeleton-square" />
                    <div className="flex-grow-1">
                      <div className="skeleton-line w-80 mb-2" />
                      <div className="skeleton-line w-40 mb-2" />
                      <div className="skeleton-line w-60" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card p-4">
                <div className="skeleton-line w-60 mb-3" />
                <div className="skeleton-line w-100 mb-2" />
                <div className="skeleton-line w-100 mb-2" />
                <div className="skeleton-line w-100 mb-3" />
                <div className="skeleton-line w-80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-5">
      <h2 className="fw-bold text-center mb-4">My Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="fw-bold mb-2">Your cart is empty</h4>
          <p className="text-muted mb-4">
            Looks like you haven’t added anything yet.
          </p>
          <button
            className="btn btn-primary px-4"
            onClick={() => (window.location.href = "/userhome")}
          >
            Back to Shopping
          </button>
        </div>
      ) : (
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card p-4">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="cart-row py-3">
                      {/* Image */}
                      <img
                        src={`http://localhost:3001/uploads/${item.image}`}
                        alt={item.product_name}
                        className="cart-thumb img-frame img-contain img-thumb-md"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/default-product.png";
                        }}
                      />

                      {/* Details */}
                      <div className="cart-details">
                        <h6 className="fw-semibold mb-1">
                          {item.product_name}
                        </h6>
                        <div className="text-muted mb-2">
                          ₹{item.price.toFixed(2)}
                        </div>

                        <div className="d-flex align-items-center gap-3 flex-wrap">
                          {/* Quantity */}
                          <div className="qty-stepper">
                            <button
                              className="btn btn-light btn-sm"
                              onClick={() => handleStep(item.id, item.qty, -1)}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) =>
                                handleQuantityChange(item.id, e.target.value)
                              }
                              className="form-control form-control-sm text-center"
                              aria-label="Quantity"
                            />
                            <button
                              className="btn btn-light btn-sm"
                              onClick={() => handleStep(item.id, item.qty, 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          {/* Item Total */}
                          <span className="fw-bold text-success">
                            ₹{(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        className="btn btn-outline-danger btn-sm cart-remove"
                        onClick={() => handleRemove(item.id)}
                        aria-label="Remove item"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>

                    {index !== cartItems.length - 1 && <hr className="my-0" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4 align-self-start">
              <div className="card p-4 cart-summary">
                <h5 className="fw-bold mb-3">Order Summary</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span>₹{shippingEstimate.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Tax (est.)</span>
                  <span>₹{taxEstimate.toFixed(2)}</span>
                </div>

                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Promo code"
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    Apply
                  </button>
                </div>

                <div className="d-flex justify-content-between align-items-center border-top pt-3 mb-3">
                  <span className="fw-semibold">Total</span>
                  <span className="fw-bold text-success">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  className="btn btn-primary btn-lg w-100"
                  onClick={() =>
                    (window.location.href = `/paybill?uid=${user_id}&price=${totalPrice.toFixed(2)}`)
                  }
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserCart;
