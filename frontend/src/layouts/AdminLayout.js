import React, { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";

const AdminLayout = () => {
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const location = useLocation();

    const [openDropdown, setOpenDropdown] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // 👇 THIS is the missing piece
    const manualCloseRef = useRef(false);

    const closeDropdown = () => {
        manualCloseRef.current = true;
        setOpenDropdown(null);
    };

    const toggleDropdown = (menu) => {
        manualCloseRef.current = false;
        setOpenDropdown((prev) => (prev === menu ? null : menu));
    };

    useEffect(() => {
        // 🚨 If user manually closed dropdown, DO NOTHING
        if (manualCloseRef.current) {
            manualCloseRef.current = false;
            return;
        }

        if (
            location.pathname.startsWith("/product") ||
            location.pathname.startsWith("/addproduct")
        ) {
            setOpenDropdown("products");
        } else if (location.pathname.startsWith("/category")) {
            setOpenDropdown("categories");
        } else {
            setOpenDropdown(null);
        }
    }, [location.pathname]);

    return (
        <div className="d-flex min-vh-100 bg-light">
            {/* Sidebar */}
            <aside
                className={`bg-white border-end p-3 admin-sidebar ${sidebarOpen ? "d-block" : "d-none"
                    } d-md-block`}
                style={{ width: "260px" }}
            >
                <h5 className="fw-bold mb-4 text-primary text-center">
                    Admin Panel
                </h5>

                <ul className="nav flex-column gap-1">
                    <li className="nav-item">
                        <NavLink to="/adminhome" className="nav-link" onClick={closeDropdown}>
                            <i className="bi bi-speedometer2 me-2"></i> Dashboard
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink to="/orders" className="nav-link" onClick={closeDropdown}>
                            <i className="bi bi-box-seam me-2"></i> Orders
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink
                            to="/feedbackview"
                            className="nav-link"
                            onClick={closeDropdown}
                        >
                            <i className="bi bi-chat-dots me-2"></i> Reviews
                        </NavLink>
                    </li>

                    {/* Products */}
                    <li className="nav-item mt-2">
                        <button
                            className={`nav-link w-100 text-start d-flex align-items-center ${openDropdown === "products" ? "active open" : ""
                                }`}
                            onClick={() => toggleDropdown("products")}
                        >
                            <span>
                                <i className="bi bi-bag me-2"></i> Products
                            </span>
                            <span className="dropdown-caret"></span>
                        </button>

                        {openDropdown === "products" && (
                            <ul className="nav flex-column ms-4">
                                <li className="nav-item">
                                    <NavLink
                                        to="/productview"
                                        className="nav-link small"
                                    >
                                        View Products
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/addproduct"
                                        className="nav-link small"
                                    >
                                        Add Product
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Categories */}
                    <li className="nav-item mt-2">
                        <button
                            className={`nav-link w-100 text-start d-flex align-items-center ${openDropdown === "categories" ? "active open" : ""
                                }`}
                            onClick={() => toggleDropdown("categories")}
                        >
                            <span>
                                <i className="bi bi-tags me-2"></i> Categories
                            </span>
                            <span className="dropdown-caret"></span>
                        </button>

                        {openDropdown === "categories" && (
                            <ul className="nav flex-column ms-4">
                                <li className="nav-item">
                                    <NavLink
                                        to="/categoryview"
                                        className="nav-link small"
                                    >
                                        View Categories
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/category"
                                        className="nav-link small"
                                    >
                                        Add Category
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className="nav-item mt-2">
                        <NavLink
                            to="/registerview"
                            className="nav-link"
                            onClick={closeDropdown}
                        >
                            <i className="bi bi-people me-2"></i> Users
                        </NavLink>
                    </li>

                    <li className="nav-item mt-auto">
                        <button
                            className="btn btn-outline-danger w-100 mt-4"
                            onClick={() => setShowLogoutDialog(true)}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i> Logout
                        </button>
                    </li>


                </ul>
            </aside>

            {/* Mobile Toggle */}
            <button
                className="btn btn-primary d-md-none position-fixed m-3"
                style={{ zIndex: 1050 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <i className="bi bi-list"></i>
            </button>

            {/* Content */}
            <main className="flex-grow-1 p-4">
                <Outlet />
            </main>
            <ConfirmDialog
                show={showLogoutDialog}
                title="Confirm Logout"
                message="Are you sure you want to logout?"
                onCancel={() => setShowLogoutDialog(false)}
                onConfirm={() => {
                    setShowLogoutDialog(false);
                    closeDropdown();
                    localStorage.clear();
                    window.location.href = "/";
                }}
            />

        </div>
    );
};

export default AdminLayout;
