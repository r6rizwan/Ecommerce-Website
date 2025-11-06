// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const utype = localStorage.getItem("utype");

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   // Determine the home link based on user type
//   const homeLink =
//     utype === "admin" ? "/adminhome" : utype === "user" ? "/userhome" : "/";

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
//       <div className="container">
//         <NavLink className="navbar-brand fw-bold" to={homeLink}>
//           E-Commerce Website
//         </NavLink>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//           <ul className="navbar-nav">
//             {/* Home Link */}
//             <li className="nav-item">
//               <NavLink to={homeLink} className="nav-link">
//                 Home
//               </NavLink>
//             </li>

//             {utype === "admin" && (
//               <>
//                 <li className="nav-item dropdown">
//                   <button
//                     className="nav-link dropdown-toggle btn btn-link text-decoration-none"
//                     type="button"
//                     data-bs-toggle="dropdown"
//                   >
//                     Category
//                   </button>
//                   <ul className="dropdown-menu">
//                     <li>
//                       <NavLink className="dropdown-item" to="/categoryview">
//                         View Categories
//                       </NavLink>
//                     </li>
//                     <li>
//                       <NavLink className="dropdown-item" to="/category">
//                         Add Category
//                       </NavLink>
//                     </li>
//                   </ul>
//                 </li>

//                 <li className="nav-item dropdown">
//                   <button
//                     className="nav-link dropdown-toggle btn btn-link text-decoration-none"
//                     type="button"
//                     data-bs-toggle="dropdown"
//                   >
//                     Products
//                   </button>
//                   <ul className="dropdown-menu">
//                     <li>
//                       <NavLink className="dropdown-item" to="/productview">
//                         View Products
//                       </NavLink>
//                     </li>
//                     <li>
//                       <NavLink className="dropdown-item" to="/addproduct">
//                         Add Product
//                       </NavLink>
//                     </li>
//                   </ul>
//                 </li>

//                 <li className="nav-item">
//                   <NavLink to="/orders" className="nav-link">
//                     Orders
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink to="/registerview" className="nav-link">
//                     Users
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink to="/feedbackview" className="nav-link">
//                     Feedbacks
//                   </NavLink>
//                 </li>
//               </>
//             )}

//             {utype === "user" && (
//               <>
//                 <li className="nav-item dropdown">
//                   <button
//                     className="nav-link dropdown-toggle btn btn-link text-decoration-none"
//                     type="button"
//                     data-bs-toggle="dropdown"
//                   >
//                     Categories
//                   </button>
//                   <ul className="dropdown-menu">
//                     <li>
//                       <NavLink className="dropdown-item" to="/categoryview">
//                         Laptops
//                       </NavLink>
//                     </li>
//                     <li>
//                       <NavLink className="dropdown-item" to="/categoryview">
//                         TVs
//                       </NavLink>
//                     </li>
//                     <li>
//                       <NavLink className="dropdown-item" to="/categoryview">
//                         Washing Machines
//                       </NavLink>
//                     </li>
//                   </ul>
//                 </li>

//                 <li className="nav-item">
//                   <NavLink to="/orders" className="nav-link">
//                     My Orders
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink to="/usercart" className="nav-link">
//                     My Cart
//                   </NavLink>
//                 </li>
//               </>
//             )}

//             {!utype && (
//               <>
//                 <li className="nav-item">
//                   <NavLink to="/aboutus" className="nav-link">
//                     About Us
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink to="/contactus" className="nav-link">
//                     Contact Us
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink to="/login" className="nav-link">
//                     Login
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink to="/register" className="nav-link">
//                     Sign Up
//                   </NavLink>
//                 </li>
//               </>
//             )}

//             {(utype === "admin" || utype === "user") && (
//               <li className="nav-item">
//                 <button onClick={handleLogout} className="btn btn-link nav-link text-light">
//                   Logout
//                 </button>
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



// import React, { useEffect, useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const navigate = useNavigate();

//   // ✅ base it on utype only
//   const [utype, setUtype] = useState(localStorage.getItem("utype"));
//   const isLoggedIn = !!utype;

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const newUtype = localStorage.getItem("utype");
//       setUtype(newUtype);
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     setUtype(null);
//     navigate("/");
//   };

//   const homeLink =
//     utype === "admin" ? "/adminhome" : utype === "user" ? "/userhome" : "/";

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
//       <div className="container">
//         <NavLink className="navbar-brand fw-bold" to={homeLink}>
//           E-Commerce Website
//         </NavLink>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//           <ul className="navbar-nav">
//             {/* Home */}
//             <li className="nav-item">
//               <NavLink to={homeLink} className="nav-link">
//                 Home
//               </NavLink>
//             </li>

//             {/* ADMIN MENU */}
//             {utype === "admin" && (
//               <>
//                 <li className="nav-item dropdown">
//                   <button
//                     className="nav-link dropdown-toggle btn btn-link text-decoration-none"
//                     type="button"
//                     data-bs-toggle="dropdown"
//                   >
//                     Category
//                   </button>
//                   <ul className="dropdown-menu">
//                     <li>
//                       <NavLink className="dropdown-item" to="/categoryview">
//                         View Categories
//                       </NavLink>
//                     </li>
//                     <li>
//                       <NavLink className="dropdown-item" to="/category">
//                         Add Category
//                       </NavLink>
//                     </li>
//                   </ul>
//                 </li>

//                 <li className="nav-item dropdown">
//                   <button
//                     className="nav-link dropdown-toggle btn btn-link text-decoration-none"
//                     type="button"
//                     data-bs-toggle="dropdown"
//                   >
//                     Products
//                   </button>
//                   <ul className="dropdown-menu">
//                     <li>
//                       <NavLink className="dropdown-item" to="/productview">
//                         View Products
//                       </NavLink>
//                     </li>
//                     <li>
//                       <NavLink className="dropdown-item" to="/addproduct">
//                         Add Product
//                       </NavLink>
//                     </li>
//                   </ul>
//                 </li>

//                 <li className="nav-item">
//                   <NavLink to="/orders" className="nav-link">
//                     Orders
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink to="/registerview" className="nav-link">
//                     Users
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink to="/feedbackview" className="nav-link">
//                     Feedbacks
//                   </NavLink>
//                 </li>
//               </>
//             )}

//             {/* USER MENU */}
//             {utype === "user" && (
//               <>
//                 <li className="nav-item dropdown">
//                   <button
//                     className="nav-link dropdown-toggle btn btn-link text-decoration-none"
//                     type="button"
//                     data-bs-toggle="dropdown"
//                   >
//                     Categories
//                   </button>
//                   <ul className="dropdown-menu">
//                     <li>
//                       <NavLink className="dropdown-item" to="/categoryview">
//                         Laptops
//                       </NavLink>
//                     </li>
//                     <li>
//                       <NavLink className="dropdown-item" to="/categoryview">
//                         TVs
//                       </NavLink>
//                     </li>
//                     <li>
//                       <NavLink className="dropdown-item" to="/categoryview">
//                         Washing Machines
//                       </NavLink>
//                     </li>
//                   </ul>
//                 </li>

//                 <li className="nav-item">
//                   <NavLink to="/orders" className="nav-link">
//                     My Orders
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink to="/usercart" className="nav-link">
//                     My Cart
//                   </NavLink>
//                 </li>
//               </>
//             )}

//             {/* GUEST MENU */}
//             {!isLoggedIn && (
//               <>
//                 <li className="nav-item">
//                   <NavLink to="/aboutus" className="nav-link">
//                     About Us
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink to="/contactus" className="nav-link">
//                     Contact Us
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink to="/login" className="nav-link">
//                     Login
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink to="/register" className="nav-link">
//                     Sign Up
//                   </NavLink>
//                 </li>
//               </>
//             )}

//             {/* LOGOUT */}
//             {isLoggedIn && (
//               <li className="nav-item">
//                 <button
//                     onClick={handleLogout}
//                     className="btn btn-link nav-link text-light"
//                   >
//                   Logout
//                 </button>
//               </li>
//             )}

//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [utype, setUtype] = useState(localStorage.getItem("utype"));
  const isLoggedIn = !!utype;

  // React to localStorage changes across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setUtype(localStorage.getItem("utype"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Listen for custom app-level updates (login/logout in same tab)
  useEffect(() => {
    const handleAppStorageChange = () => {
      setUtype(localStorage.getItem("utype"));
    };
    window.addEventListener("app-storage", handleAppStorageChange);
    return () => window.removeEventListener("app-storage", handleAppStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();

    // 👇 tell the Navbar (in same tab) to update instantly
    window.dispatchEvent(new Event("app-storage"));

    navigate("/");
  };

  const homeLink =
    utype === "admin" ? "/adminhome" : utype === "user" ? "/userhome" : "/";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
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
            <li className="nav-item">
              <NavLink to={homeLink} className="nav-link">
                Home
              </NavLink>
            </li>

            {/* ADMIN MENU */}
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

            {/* USER MENU */}
            {utype === "user" && (
              <>
                {/* <li className="nav-item dropdown">
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
                </li> */}

                <li className="nav-item">
                  <NavLink to="/userOrders" className="nav-link">
                    My Orders
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/usercart" className="nav-link">
                    My Cart
                  </NavLink>
                </li>
              </>
            )}

            {/* GUEST MENU */}
            {!isLoggedIn && (
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

            {/* LOGOUT */}
            {isLoggedIn && (
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-link nav-link text-light"
                >
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
