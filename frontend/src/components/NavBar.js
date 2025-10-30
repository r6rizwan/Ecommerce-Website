// import React from "react";
// import { NavLink } from "react-router-dom";

// const Navbar = () => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//       <div className="container">
//         <NavLink className="navbar-brand fw-bold" to="/">
//           E-Commerce Website
//         </NavLink>

//         {/* Toggle Button for Mobile */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Navbar Links */}
//         <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//           <ul className="navbar-nav">
//             <li className="nav-item">
//               <NavLink
//                 to="/"
//                 className={({ isActive }) =>
//                   "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                 }
//               >
//                 Home
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink
//                 to="/category"
//                 className={({ isActive }) =>
//                   "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                 }
//               >
//                 Category
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink
//                 to="/feedback"
//                 className={({ isActive }) =>
//                   "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                 }
//               >
//                 Feedback
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink
//                 to="/addproduct"
//                 className={({ isActive }) =>
//                   "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                 }
//               >
//                 Product
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink
//                 to="/login"
//                 className={({ isActive }) =>
//                   "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                 }
//               >
//                 Login
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink
//                 to="/register"
//                 className={({ isActive }) =>
//                   "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                 }
//               >
//                 Sign Up
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink
//                 to="/registerview"
//                 className={({ isActive }) =>
//                   "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                 }
//               >
//                 Registered Users
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink
//                 to="/categoryview"
//                 className={({ isActive }) =>
//                   "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                 }
//               >
//                 View Categories
//               </NavLink>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import React from "react";
// import { NavLink } from "react-router-dom";

// const Navbar = () => {
//   let user = localStorage.getItem("user");
//   console.log(user);
//   let utype = localStorage.getItem("utype");

//   // const Logout = () => {
//   //   localStorage.clear();
//   //   window.location.href = "/";
//   //   window.location.reload();
//   // }

//   if (utype === 'admin') {
//     return (
//       <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//         <div className="container">
//           <NavLink className="navbar-brand fw-bold" to="/">
//             E-Commerce Website
//           </NavLink>

//           {/* Toggle Button for Mobile */}
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//             <ul className="navbar-nav">

//               <li className="nav-item">
//                 <NavLink
//                   to="/"
//                   className={({ isActive }) =>
//                     "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                   }
//                 >
//                   Home
//                 </NavLink>
//               </li>

//               <li className="nav-item dropdown">
//                 <NavLink
//                   to="#"
//                   className="nav-link dropdown-toggle"
//                   role="button"
//                   data-bs-toggle="dropdown"
//                 >
//                   Category
//                 </NavLink>
//                 <ul className="dropdown-menu">
//                   <li>
//                     <NavLink className="dropdown-item" to="/categoryview">
//                       View Categories
//                     </NavLink>
//                   </li>
//                   <li>
//                     <NavLink className="dropdown-item" to="/category">
//                       Add Category
//                     </NavLink>
//                   </li>
//                 </ul>
//               </li>

//               <li className="nav-item dropdown">
//                 <NavLink
//                   to="#"
//                   className="nav-link dropdown-toggle"
//                   role="button"
//                   data-bs-toggle="dropdown"
//                 >
//                   Products
//                 </NavLink>
//                 <ul className="dropdown-menu">
//                   <li>
//                     <NavLink className="dropdown-item" to="/productview">
//                       View Products
//                     </NavLink>
//                   </li>
//                   <li>
//                     <NavLink className="dropdown-item" to="/addproduct">
//                       Add Product
//                     </NavLink>
//                   </li>
//                 </ul>
//               </li>

//               <li className="nav-item">
//                 <NavLink
//                   to="/orders"
//                   className={({ isActive }) =>
//                     "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                   }
//                 >
//                   Orders
//                 </NavLink>
//               </li>

//               <li className="nav-item">
//                 <NavLink
//                   to="/registerview"
//                   className={({ isActive }) =>
//                     "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                   }
//                 >
//                   Users
//                 </NavLink>
//               </li>

//               <li className="nav-item">
//                 <NavLink
//                   to="/feedbackview"
//                   className={({ isActive }) =>
//                     "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                   }
//                 >
//                   Feedbacks
//                 </NavLink>
//               </li>

//               <NavLink
//                 to="/login"
//                 onClick={() => {
//                   localStorage.clear();
//                   window.location.reload();
//                 }}
//                 className={({ isActive }) => "nav-link" + (isActive ? " active fw-bold text-light" : "")}
//               >
//                 Logout
//               </NavLink>


//               {/* <li className="nav-item">

//                 <button className="btn btn-danger" onClick={Logout()}> Logout </button>  

//               </li> */}
//             </ul>
//           </div>
//         </div>
//       </nav>
//     );
//   }
//   else if (utype === 'user') {
//     return (
//       <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//         <div className="container">
//           <NavLink className="navbar-brand fw-bold" to="/">
//             E-Commerce Website
//           </NavLink>

//           {/* Toggle Button for Mobile */}
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//             <ul className="navbar-nav">

//               <li className="nav-item">
//                 <NavLink
//                   to="/"
//                   className={({ isActive }) =>
//                     "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                   }
//                 >
//                   Home
//                 </NavLink>
//               </li>

//               <li className="nav-item dropdown">
//                 <NavLink
//                   to="#"
//                   className="nav-link dropdown-toggle"
//                   role="button"
//                   data-bs-toggle="dropdown"
//                 >
//                   Categories
//                 </NavLink>
//                 <ul className="dropdown-menu">
//                   <li>
//                     <NavLink className="dropdown-item" to="/categoryview">
//                       Laptop
//                     </NavLink>
//                   </li>
//                   <li>
//                     <NavLink className="dropdown-item" to="/category">
//                       TV
//                     </NavLink>
//                   </li>
//                   <li>
//                     <NavLink className="dropdown-item" to="/category">
//                       Washing Machine
//                     </NavLink>
//                   </li>
//                 </ul>
//               </li>

//               <li className="nav-item">
//                 <NavLink
//                   to="/orders"
//                   className={({ isActive }) =>
//                     "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                   }
//                 >
//                   My Orders
//                 </NavLink>
//               </li>

//               <li className="nav-item">
//                 <NavLink
//                   to="/cart"
//                   className={({ isActive }) =>
//                     "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                   }
//                 >
//                   My Cart
//                 </NavLink>
//               </li>

//               {/* <li className="nav-item">

//                 <button className="btn btn-danger" onClick={Logout()}> Logout </button>  

//               </li> */}
//             </ul>
//           </div>

//         </div>
//       </nav>
//     );
//   }
//   else {
//     return (
//       <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//         <div className="container">
//           <NavLink className="navbar-brand fw-bold" to="/">
//             E-Commerce Website
//           </NavLink>

//           {/* Toggle Button for Mobile */}
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           {/* Navbar Links */}
//           <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//             <ul className="navbar-nav">
//               <li className="nav-item">
//                 <NavLink
//                   to="/"
//                   className={({ isActive }) =>
//                     "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                   }
//                 >
//                   Home
//                 </NavLink>
//               </li>

//               <li className="nav-item">
//                 <NavLink
//                   to="/"
//                   className={({ isActive }) =>
//                     "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                   }
//                 >
//                   About Us
//                 </NavLink>
//               </li>

//               <li className="nav-item">
//                 <NavLink
//                   to="/"
//                   className={({ isActive }) =>
//                     "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                   }
//                 >
//                   Contact Us
//                 </NavLink>
//               </li>

//               <li className="nav-item">
//                 <NavLink
//                   to="/login"
//                   className={({ isActive }) =>
//                     "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                   }
//                 >
//                   Login
//                 </NavLink>
//               </li>

//               <li className="nav-item">
//                 <NavLink
//                   to="/register"
//                   className={({ isActive }) =>
//                     "nav-link" + (isActive ? " active fw-bold text-light" : "")
//                   }
//                 >
//                   Sign Up
//                 </NavLink>
//               </li>
//             </ul>
//           </div>

//         </div>
//       </nav>
//     );
//   }
// };

// export default Navbar;


// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const user = localStorage.getItem("user");
//   const utype = localStorage.getItem("utype");
//   console.log("Navbar User:", user);
//   console.log("Navbar Utype:", utype);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/", { replace: true });
//   };


//   // ---------------- ADMIN NAVBAR ----------------
//   if (utype === "admin") {
//     return (
//       <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//         <div className="container">
//           <NavLink className="navbar-brand fw-bold" to="/">
//             E-Commerce Website
//           </NavLink>

//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//             <ul className="navbar-nav">

//               <li className="nav-item">
//                 <NavLink to={utype === "admin" ? "/adminhome" : "/"} className="nav-link">
//                   Home
//                 </NavLink>
//               </li>

//               <li className="nav-item dropdown">
//                 <button
//                   className="nav-link dropdown-toggle btn btn-link text-decoration-none"
//                   type="button"
//                   data-bs-toggle="dropdown"
//                 >
//                   Category
//                 </button>
//                 <ul className="dropdown-menu">
//                   <li><NavLink className="dropdown-item" to="/categoryview">View Categories</NavLink></li>
//                   <li><NavLink className="dropdown-item" to="/category">Add Category</NavLink></li>
//                 </ul>
//               </li>

//               <li className="nav-item dropdown">
//                 <button
//                   className="nav-link dropdown-toggle btn btn-link text-decoration-none"
//                   type="button"
//                   data-bs-toggle="dropdown"
//                 >
//                   Products
//                 </button>
//                 <ul className="dropdown-menu">
//                   <li><NavLink className="dropdown-item" to="/productview">View Products</NavLink></li>
//                   <li><NavLink className="dropdown-item" to="/addproduct">Add Product</NavLink></li>
//                 </ul>
//               </li>

//               <li className="nav-item"><NavLink to="/orders" className="nav-link">Orders</NavLink></li>
//               <li className="nav-item"><NavLink to="/registerview" className="nav-link">Users</NavLink></li>
//               <li className="nav-item"><NavLink to="/feedbackview" className="nav-link">Feedbacks</NavLink></li>

//               <li className="nav-item">
//                 <button onClick={handleLogout} className="btn btn-link nav-link text-light">
//                   Logout
//                 </button>
//               </li>

//               <li className="nav-item ms-2">
//                 <span className="navbar-text text-light small">Welcome, {user}</span>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     );
//   }

//   // ---------------- USER NAVBAR ----------------
//   else if (utype === "user") {
//     return (
//       <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//         <div className="container">
//           <NavLink className="navbar-brand fw-bold" to="/">
//             E-Commerce Website
//           </NavLink>

//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//             <ul className="navbar-nav">
//               <li className="nav-item">
//                 <NavLink to={utype === "user" ? "/userhome" : "/"} className="nav-link">
//                   Home
//                 </NavLink>
//               </li>

//               <li className="nav-item dropdown">
//                 <button
//                   className="nav-link dropdown-toggle btn btn-link text-decoration-none"
//                   type="button"
//                   data-bs-toggle="dropdown"
//                 >
//                   Categories
//                 </button>
//                 <ul className="dropdown-menu">
//                   <li><NavLink className="dropdown-item" to="/categoryview">Laptops</NavLink></li>
//                   <li><NavLink className="dropdown-item" to="/categoryview">TVs</NavLink></li>
//                   <li><NavLink className="dropdown-item" to="/categoryview">Washing Machines</NavLink></li>
//                 </ul>
//               </li>

//               <li className="nav-item"><NavLink to="/orders" className="nav-link">My Orders</NavLink></li>
//               <li className="nav-item"><NavLink to="/cart" className="nav-link">My Cart</NavLink></li>

//               <li className="nav-item">
//                 <button onClick={handleLogout} className="btn btn-link nav-link text-light">
//                   Logout
//                 </button>
//               </li>

//               <li className="nav-item ms-2">
//                 <span className="navbar-text text-light small">Welcome, {user}</span>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     );
//   }

//   // ---------------- GUEST NAVBAR ----------------
//   else {
//     return (
//       <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//         <div className="container">
//           <NavLink className="navbar-brand fw-bold" to="/">
//             E-Commerce Website
//           </NavLink>

//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//             <ul className="navbar-nav">
//               <li className="nav-item">
//                 <NavLink to="/" className="nav-link">
//                   Home
//                 </NavLink>
//               </li>

//               <li className="nav-item"><NavLink to="/about" className="nav-link">About Us</NavLink></li>
//               <li className="nav-item"><NavLink to="/contact" className="nav-link">Contact Us</NavLink></li>
//               <li className="nav-item"><NavLink to="/login" className="nav-link">Login</NavLink></li>
//               <li className="nav-item"><NavLink to="/register" className="nav-link">Sign Up</NavLink></li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     );
//   }
// };

// export default Navbar;


import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  // const user = localStorage.getItem("user");
  const utype = localStorage.getItem("utype");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Determine the home link based on user type
  const homeLink =
    utype === "admin" ? "/adminhome" : utype === "user" ? "/userhome" : "/";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to={homeLink}>
          E-Commerce Website
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            {/* Home Link */}
            <li className="nav-item">
              <NavLink to={homeLink} className="nav-link">
                Home
              </NavLink>
            </li>

            {utype === "admin" && (
              <>
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link text-decoration-none"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    Category
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <NavLink className="dropdown-item" to="/categoryview">
                        View Categories
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/category">
                        Add Category
                      </NavLink>
                    </li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link text-decoration-none"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    Products
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <NavLink className="dropdown-item" to="/productview">
                        View Products
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/addproduct">
                        Add Product
                      </NavLink>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <NavLink to="/orders" className="nav-link">
                    Orders
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/registerview" className="nav-link">
                    Users
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/feedbackview" className="nav-link">
                    Feedbacks
                  </NavLink>
                </li>
              </>
            )}

            {utype === "user" && (
              <>
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link text-decoration-none"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    Categories
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <NavLink className="dropdown-item" to="/categoryview">
                        Laptops
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/categoryview">
                        TVs
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/categoryview">
                        Washing Machines
                      </NavLink>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <NavLink to="/orders" className="nav-link">
                    My Orders
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/cart" className="nav-link">
                    My Cart
                  </NavLink>
                </li>
              </>
            )}

            {!utype && (
              <>
                <li className="nav-item">
                  <NavLink to="/aboutus" className="nav-link">
                    About Us
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/contactus" className="nav-link">
                    Contact Us
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}

            {(utype === "admin" || utype === "user") && (
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-link nav-link text-light">
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
