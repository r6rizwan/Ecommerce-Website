import React, { useEffect, useState } from "react";
import axios from "axios";

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = localStorage.getItem("userID");

  // Fetch cart items
  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/getcartitems/${user_id}`)
      .then((res) => setCartItems(res.data))
      .catch((err) => console.error("Error fetching cart:", err))
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
      .catch((err) => console.error("Error updating quantity:", err));
  };

  const handleRemove = (id) => {
    axios
      .delete(`http://localhost:3001/api/deletefromcart/${id}`)
      .then(() => {
        window.dispatchEvent(new Event("cart-update"));
        setCartItems((prev) => prev.filter((i) => i.id !== id));
      })
      .catch((err) => console.error("Error removing item:", err));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-2">Loading your cart...</span>
      </div>
    );

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center text-primary fw-bold">My Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center fs-5 text-secondary">
          Your cart is empty. Start shopping now!
        </p>
      ) : (
        <>
          <div className="d-flex flex-column gap-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="card border-0 shadow-sm rounded-4 p-3"
              >
                <div className="d-flex flex-column flex-md-row align-items-center">
                  {/* Product Image */}
                  <img
                    src={`http://localhost:3001/uploads/${item.image}`}
                    alt={item.product_name}
                    className="me-3 rounded"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      if (!e.target.dataset.fallback) {
                        e.target.src = "/default-product.png";
                        e.target.dataset.fallback = true;
                      }
                    }}

                  />

                  {/* Product Details */}
                  <div className="flex-grow-1 text-center text-md-start">
                    <h5 className="fw-semibold mb-1">{item.product_name}</h5>
                    <p className="text-muted small mb-2">
                      Price: ₹{item.price.toFixed(2)}
                    </p>

                    {/* Quantity Input */}
                    <div className="d-flex justify-content-center justify-content-md-start align-items-center gap-2">
                      <label className="text-muted small mb-0">Qty:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        className="form-control form-control-sm"
                        style={{ width: "70px", textAlign: "center" }}
                      />
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="text-center mt-3 mt-md-0">
                    <div className="fw-bold text-success fs-5">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </div>
                    <button
                      className="btn btn-outline-danger btn-sm mt-2"
                      onClick={() => handleRemove(item.id)}
                    >
                      <i className="bi bi-trash me-1"></i> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="card mt-5 shadow-sm border-0 rounded-4">
            <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
              <h5 className="fw-bold mb-3 mb-md-0">
                Total Amount:{" "}
                <span className="text-success">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </h5>

              <button
                className="btn btn-success btn-lg px-4"
                onClick={() =>
                (window.location.href = `/paybill?uid=${user_id}&price=${totalPrice.toFixed(
                  2
                )}`)
                }
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserCart;
