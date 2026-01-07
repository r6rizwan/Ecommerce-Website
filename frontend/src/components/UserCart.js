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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary"></div>
        <span className="ms-2">Loading cart...</span>
      </div>
    );
  }

  return (
    <section className="py-5">
      <h2 className="fw-bold text-center mb-4">My Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-muted fs-5">
          Your cart is empty. Start shopping!
        </p>
      ) : (
        <div className="container" style={{ maxWidth: "900px" }}>
          <div className="card p-4">

            {cartItems.map((item, index) => (
              <div key={item.id}>
                <div className="d-flex align-items-start gap-3 py-3">

                  {/* Image */}
                  <img
                    src={`http://localhost:3001/uploads/${item.image}`}
                    alt={item.product_name}
                    className="rounded"
                    style={{ width: "80px", height: "80px", objectFit: "contain" }}
                  />

                  {/* Details */}
                  <div className="flex-grow-1">
                    <h6 className="fw-semibold mb-1">
                      {item.product_name}
                    </h6>
                    <div className="text-muted mb-2">
                      ₹{item.price.toFixed(2)}
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      {/* Quantity */}
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        className="form-control form-control-sm text-center"
                        style={{ width: "70px" }}
                      />

                      {/* Item Total */}
                      <span className="fw-bold text-success">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    className="btn btn-outline-danger btn-sm mt-1"
                    onClick={() => handleRemove(item.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>

                {index !== cartItems.length - 1 && <hr className="my-0" />}
              </div>
            ))}

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center pt-4 mt-3 border-top">
              <h5 className="fw-bold mb-0">
                Total:{" "}
                <span className="text-success">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </h5>

              <button
                className="btn btn-primary btn-lg px-4"
                onClick={() =>
                  (window.location.href = `/paybill?uid=${user_id}&price=${totalPrice.toFixed(2)}`)
                }
              >
                Checkout
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default UserCart;
