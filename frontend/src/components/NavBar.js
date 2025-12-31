import React, { useEffect, useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [utype, setUtype] = useState(localStorage.getItem("utype"));
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const isLoggedIn = !!utype;
  const user_id = localStorage.getItem("userID");

  // Fetch cart count (only for users)
  const fetchCartCount = useCallback(async () => {
    if (utype === "user" && user_id) {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/getcartitems/${user_id}`
        );
        setCartCount(res.data.length);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    }
  }, [utype, user_id]);

  // Initial fetch + cart-update listener
  useEffect(() => {
    fetchCartCount();
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cart-update", handleCartUpdate);
    return () => window.removeEventListener("cart-update", handleCartUpdate);
  }, [fetchCartCount]);

  // Sync user info
  useEffect(() => {
    const syncUser = () => {
      setUtype(localStorage.getItem("utype"));
      setUserName(localStorage.getItem("userName"));
    };
    window.addEventListener("storage", syncUser);
    window.addEventListener("app-storage", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("app-storage", syncUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("app-storage"));
    navigate("/");
  };

  const homeLink =
    utype === "admin" ? "/adminhome" : utype === "user" ? "/userhome" : "/";

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container">
        {/* Brand */}
        <NavLink className="navbar-brand" to={homeLink}>
          ShopSphere
        </NavLink>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">

            {/* Common Home */}
            <li className="nav-item">
              <NavLink to={homeLink} className="nav-link">
                Home
              </NavLink>
            </li>

            {/* ADMIN MENU */}
            {utype === "admin" && (
              <>
                <li className="nav-item">
                  <NavLink to="/orders" className="nav-link">
                    Orders
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/productview" className="nav-link">
                    Products
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/categoryview" className="nav-link">
                    Categories
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
                <li className="nav-item">
                  <NavLink to="/userorders" className="nav-link">
                    My Orders
                  </NavLink>
                </li>

                <li className="nav-item position-relative">
                  <NavLink to="/usercart" className="nav-link position-relative">
                    <i className="bi bi-cart3 fs-5"></i>
                    {cartCount > 0 && (
                      <span className="cart-badge">{cartCount}</span>
                    )}
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/aboutus" className="nav-link">
                    About
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/contactus" className="nav-link">
                    Contact
                  </NavLink>
                </li>
              </>
            )}

            {/* GUEST MENU */}
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <NavLink to="/aboutus" className="nav-link">
                    About
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/contactus" className="nav-link">
                    Contact
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="btn btn-primary ms-2">
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}

            {/* USER DROPDOWN */}
            {(utype === "user" || utype === "admin") && (
              <li className="nav-item dropdown ms-3">
                <button
                  className="btn btn-outline-primary dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  Hi, {userName?.split(" ")[0]}
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
