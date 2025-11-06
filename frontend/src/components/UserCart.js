// import React, { useState } from "react";

// const UserCart = () => {
//   const [cartItems, setCartItems] = useState([
//     { id: 1, name: "Laptop", price: 45000, quantity: 1 },
//     { id: 2, name: "Wireless Mouse", price: 1200, quantity: 2 },
//     { id: 3, name: "Headphones", price: 2500, quantity: 1 },
//   ]);

//   const handleQuantityChange = (id, qty) => {
//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id ? { ...item, quantity: Number(qty) } : item
//       )
//     );
//   };

//   const handleRemove = (id) => {
//     setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
//   };

//   const totalPrice = cartItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );

//   return (
//     <div className="container my-5">
//       <h1 className="mb-4 text-center text-primary fw-bold">My Cart</h1>

//       {cartItems.length === 0 ? (
//         <p className="text-center">Your cart is empty.</p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-bordered">
//             <thead className="table-light">
//               <tr>
//                 <th>Product</th>
//                 <th>Price (₹)</th>
//                 <th>Quantity</th>
//                 <th>Total (₹)</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cartItems.map((item) => (
//                 <tr key={item.id}>
//                   <td>{item.name}</td>
//                   <td>{item.price}</td>
//                   <td>
//                     <input
//                       type="number"
//                       min="1"
//                       value={item.quantity}
//                       onChange={(e) =>
//                         handleQuantityChange(item.id, e.target.value)
//                       }
//                       className="form-control"
//                       style={{ width: "80px" }}
//                     />
//                   </td>
//                   <td>{item.price * item.quantity}</td>
//                   <td>
//                     <button
//                       className="btn btn-danger btn-sm"
//                       onClick={() => handleRemove(item.id)}
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               <tr>
//                 <td colSpan="3" className="text-end fw-bold">
//                   Total:
//                 </td>
//                 <td colSpan="2" className="fw-bold">
//                   ₹{totalPrice}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       )}

//       <div className="text-center mt-4">
//         <button className="btn btn-success me-2" disabled={cartItems.length === 0}>
//           Proceed to Checkout
//         </button>
//         <button
//           className="btn btn-secondary"
//           onClick={() => setCartItems([])}
//           disabled={cartItems.length === 0}
//         >
//           Clear Cart
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserCart;


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

    console.log("Updating quantity:", { id, qty }); // 👈 ADD THIS

    axios
      .put(`http://localhost:3001/api/updatecart/${id}`, { qty })
      .then(() => {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, qty: Number(qty), total: item.price * qty } : item
          )
        );
      })
      .catch((err) => console.error("Error updating quantity:", err));
  };


  const handleRemove = (id) => {
    axios
      .delete(`http://localhost:3001/api/deletefromcart/${id}`)
      .then(() => setCartItems((prev) => prev.filter((i) => i.id !== id)))
      .catch((err) => console.error("Error removing item:", err));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);

  if (loading) return <p className="text-center my-5">Loading your cart...</p>;

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
                  <td>{item.product_name}</td>
                  <td>{item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="form-control"
                      style={{ width: "80px" }}
                    />
                  </td>
                  <td>{item.total}</td>
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
                  ₹{totalPrice.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="text-center mt-4">
            <button className="btn btn-success me-2" disabled={cartItems.length === 0}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCart;
