import React, { useEffect, useState, useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ConfirmDialog from "../components/ConfirmDialog";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [utype, setUtype] = useState(localStorage.getItem("utype"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [cartCount, setCartCount] = useState(0);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isLoggedIn = !!utype;
  const user_id = localStorage.getItem("userID");

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

  useEffect(() => {
    fetchCartCount();
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cart-update", handleCartUpdate);
    return () => window.removeEventListener("cart-update", handleCartUpdate);
  }, [fetchCartCount]);

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

  const handleConfirmLogout = () => {
    setShowLogoutDialog(false);
    localStorage.clear();
    window.dispatchEvent(new Event("app-storage"));
    navigate("/");
  };

  const homeLink =
    utype === "admin" ? "/adminhome" : utype === "user" ? "/userhome" : "/";

  const showSearch = utype === "user" && location.pathname.startsWith("/user");

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top bg-white border-bottom shadow-sm">
        <div className="container-xl">
          {/* Brand */}
          <NavLink className="navbar-brand fw-bold text-primary" to={homeLink}>
            ShopSphere
          </NavLink>

          {showSearch && (
            <form
              className="navbar-search ms-lg-4 d-none d-lg-flex"
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/userhome?q=${encodeURIComponent(searchTerm.trim())}`);
              }}
            >
              <input
                type="search"
                className="form-control"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </form>
          )}

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
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              <li className="nav-item">
                <NavLink to={homeLink} className="nav-link">
                  Home
                </NavLink>
              </li>

              {/* ADMIN MENU */}
              {utype === "admin" && (
                <>
                  <li className="nav-item">
                    <NavLink to="/orders" className="nav-link">Orders</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/productview" className="nav-link">Products</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/categoryview" className="nav-link">Categories</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/feedbackview" className="nav-link">Feedback</NavLink>
                  </li>
                </>
              )}

              {/* USER MENU */}
              {utype === "user" && (
                <>
                  <li className="nav-item">
                    <NavLink to="/userorders" className="nav-link">My Orders</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/aboutus" className="nav-link">About</NavLink>
                  </li>
                  <li className="nav-item position-relative">
                    <NavLink to="/usercart" className="nav-link">
                      <i className="bi bi-cart3 fs-5"></i>
                      {cartCount > 0 && (
                        <span className="cart-badge">
                          {cartCount}
                        </span>
                      )}
                    </NavLink>
                  </li>
                </>
              )}

              {/* GUEST MENU */}
              {!isLoggedIn && (
                <>
                  <li className="nav-item">
                    <NavLink to="/aboutus" className="nav-link">About</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">Login</NavLink>
                  </li>
                  <li className="nav-item ms-lg-2">
                    <NavLink to="/register" className="btn btn-primary px-3">
                      Sign Up
                    </NavLink>
                  </li>
                </>
              )}

              {/* USER DROPDOWN */}
              {(utype === "user" || utype === "admin") && (
                <li className="nav-item dropdown ms-lg-3">
                  <button
                    className="btn btn-outline-primary dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    {userName?.split(" ")[0]}
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => setShowLogoutDialog(true)}
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

      {/* 🔔 Logout Confirmation Dialog */}
      <ConfirmDialog
        show={showLogoutDialog}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onCancel={() => setShowLogoutDialog(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Navbar;
