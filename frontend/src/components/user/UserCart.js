import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

const CartImageOrName = ({ image, name }) => {
  const [showName, setShowName] = useState(!(image && String(image).trim()));

  if (showName) {
    return <div className="cart-thumb-fallback-v2">{name}</div>;
  }

  return (
    <img
      src={`${API_BASE_URL}/uploads/${image}`}
      alt={name}
      className="cart-thumb-v2"
      onError={() => setShowName(true)}
    />
  );
};

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = localStorage.getItem("userID");

  useEffect(() => {
    if (!user_id) {
      const guest = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCartItems(guest);
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/getcartitems/${user_id}`)
      .then((res) => setCartItems(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user_id]);

  const handleQuantityChange = (id, qty) => {
    if (qty < 1) return;

    if (!user_id) {
      setCartItems((prev) => {
        const next = prev.map((item) =>
          item.id === id
            ? { ...item, qty: Number(qty), total: Number(item.price || 0) * Number(qty) }
            : item
        );
        localStorage.setItem("guestCart", JSON.stringify(next));
        window.dispatchEvent(new Event("cart-update"));
        return next;
      });
      return;
    }

    axios
      .put(`${API_BASE_URL}/api/updatecart/${id}`, { qty })
      .then(() => {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, qty: Number(qty), total: Number(item.price || 0) * Number(qty) }
              : item
          )
        );
        window.dispatchEvent(new Event("cart-update"));
      })
      .catch((err) => console.error(err));
  };

  const handleStep = (id, currentQty, delta) => {
    const nextQty = Math.max(1, Number(currentQty) + delta);
    handleQuantityChange(id, nextQty);
  };

  const handleRemove = (id) => {
    if (!user_id) {
      setCartItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        localStorage.setItem("guestCart", JSON.stringify(next));
        window.dispatchEvent(new Event("cart-update"));
        return next;
      });
      return;
    }

    axios
      .delete(`${API_BASE_URL}/api/deletefromcart/${id}`)
      .then(() => {
        setCartItems((prev) => prev.filter((i) => i.id !== id));
        window.dispatchEvent(new Event("cart-update"));
      })
      .catch((err) => console.error(err));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const gstEstimate = totalPrice * 0.18;
  const deliveryCharges = totalPrice > 0 ? 49 : 0;
  const grandTotal = totalPrice + gstEstimate + deliveryCharges;

  if (loading) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: "1120px" }}>
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
      </section>
    );
  }

  return (
    <section className="section cart-page-v2">
      <div className="container" style={{ maxWidth: "1120px" }}>
        <div className="text-center mb-4">
          <h2 className="section-title">My Cart</h2>
          <p className="section-subtitle mx-auto">
            Review your items and proceed to checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="fw-bold mb-2">Your cart is empty</h4>
            <p className="text-muted mb-4">Looks like you haven&apos;t added anything yet.</p>
            <button
              className="btn btn-primary px-4"
              onClick={() => (window.location.href = "/userhome")}
            >
              Back to Shopping
            </button>
          </div>
        ) : (
          <div className="row g-4 align-items-start">
            <div className="col-lg-8">
              <div className="card cart-list-v2 p-4">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="cart-row-v2">
                      <CartImageOrName image={item.image} name={item.product_name} />

                      <div className="cart-details-v2">
                        <h6 className="fw-semibold mb-1">{item.product_name}</h6>
                        <div className="text-muted mb-2">₹{Number(item.price || 0).toFixed(2)}</div>

                        <div className="d-flex align-items-center gap-3 flex-wrap">
                          <div className="qty-stepper-v2">
                            <button
                              className="btn"
                              onClick={() => handleStep(item.id, item.qty, -1)}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                              className="form-control form-control-sm text-center"
                              aria-label="Quantity"
                            />
                            <button
                              className="btn"
                              onClick={() => handleStep(item.id, item.qty, 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <span className="fw-bold text-success">
                            ₹{(Number(item.price || 0) * Number(item.qty || 0)).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline-danger btn-sm cart-remove-v2"
                        onClick={() => handleRemove(item.id)}
                        aria-label="Remove item"
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </div>

                    {index !== cartItems.length - 1 && <hr className="my-3" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card cart-summary-v2 p-4">
                <h5 className="fw-bold mb-3">Order Summary</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Delivery Charges</span>
                  <span>₹{deliveryCharges.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">GST (18%)</span>
                  <span>₹{gstEstimate.toFixed(2)}</span>
                </div>

                <div className="input-group mb-3">
                  <input type="text" className="form-control" placeholder="Promo code" />
                  <button className="btn btn-outline-secondary" type="button">
                    Apply
                  </button>
                </div>

                <div className="d-flex justify-content-between align-items-center border-top pt-3 mb-3">
                  <span className="fw-semibold">Total</span>
                  <span className="fw-bold text-success">₹{grandTotal.toFixed(2)}</span>
                </div>

                <button
                  className="btn btn-primary btn-lg w-100"
                  onClick={() =>
                    user_id
                      ? (window.location.href = `/paybill?uid=${user_id}&total=${grandTotal.toFixed(2)}`)
                      : (window.location.href = "/login?redirect=/usercart")
                  }
                >
                  {user_id ? "Checkout" : "Sign in to checkout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserCart;
