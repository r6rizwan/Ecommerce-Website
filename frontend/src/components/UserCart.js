import React, { useState } from "react";

const UserCart = () => {
  // Example cart items (replace with API data later)
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Laptop", price: 45000, quantity: 1 },
    { id: 2, name: "Wireless Mouse", price: 1200, quantity: 2 },
    { id: 3, name: "Headphones", price: 2500, quantity: 1 },
  ]);

  // Handle quantity change
  const handleQuantityChange = (id, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Number(qty) } : item
      )
    );
  };

  // Remove item from cart
  const handleRemove = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center text-primary fw-bold">My Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Price (₹)</th>
                <th>Quantity</th>
                <th>Total (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      className="form-control"
                      style={{ width: "80px" }}
                    />
                  </td>
                  <td>{item.price * item.quantity}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="text-end fw-bold">
                  Total:
                </td>
                <td colSpan="2" className="fw-bold">
                  ₹{totalPrice}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center mt-4">
        <button className="btn btn-success me-2" disabled={cartItems.length === 0}>
          Proceed to Checkout
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setCartItems([])}
          disabled={cartItems.length === 0}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default UserCart;
