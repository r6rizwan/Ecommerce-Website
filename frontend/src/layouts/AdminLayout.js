import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";

const AdminLayout = () => {
    const location = useLocation();

    // detect active sections
    const isProductsActive = location.pathname.startsWith("/product");
    const isCategoriesActive = location.pathname.startsWith("/category");
    const isReportsActive = location.pathname.startsWith("/reports");

    const [openDropdown, setOpenDropdown] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const toggleDropdown = (menu) => {
        setOpenDropdown((prev) => (prev === menu ? null : menu));
    };

    // Auto open dropdown based on active path
    useEffect(() => {
        if (location.pathname.startsWith("/product")) setOpenDropdown("products");
        else if (location.pathname.startsWith("/category")) setOpenDropdown("categories");
        else if (location.pathname.startsWith("/reports")) setOpenDropdown("reports");
        else setOpenDropdown(null);
    }, [location.pathname]);



    return (
        <div className="d-flex flex-column flex-md-row">
            {/* Sidebar Toggle Button for Mobile */}
            <button
                className="btn btn-primary d-md-none m-2"
                onClick={toggleSidebar}
            >
                <i className="bi bi-list me-1"></i> Menu
            </button>

            {/* Sidebar */}
            <div
                className={`bg-primary text-white p-4 d-flex flex-column sticky-top ${sidebarOpen ? "d-block" : "d-none"
                    } d-md-flex`}
                style={{ minHeight: "100vh", width: sidebarOpen ? "100%" : "auto" }}
            >
                <h4 className="fw-bold mb-4 text-center">E-Commerce Admin</h4>

                <ul className="nav flex-column">
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/adminhome"
                            className="nav-link text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <i className="bi bi-speedometer2 me-2"></i> Dashboard
                        </NavLink>
                    </li>

                    <li className="nav-item mb-2">
                        <NavLink
                            to="/orders"
                            className="nav-link text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <i className="bi bi-box-seam me-2"></i> Orders
                        </NavLink>
                    </li>

                    <li className="nav-item mb-2">
                        <NavLink
                            to="/feedbackview"
                            className="nav-link text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <i className="bi bi-chat-dots me-2"></i> Reviews
                        </NavLink>
                    </li>

                    {/* Products Dropdown */}
                    <li
                        className={`nav-item dropdown mb-2 pt-2 ps-3 ${openDropdown === "products" ? "show" : ""
                            }`}
                    >
                        <button
                            className={`nav-link dropdown-toggle text-white w-100 text-start border-0 bg-transparent p-0 ${isProductsActive ? "fw-bold text-warning" : ""
                                }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown("products");
                            }}
                        >
                            <i className="bi bi-bag me-2"></i> Products
                        </button>

                        <ul
                            className={`dropdown-menu ${openDropdown === "products" ? "show" : ""
                                }`}
                        >
                            <li>
                                <NavLink
                                    className="dropdown-item"
                                    to="/productview"
                                    onClick={() => {
                                        setOpenDropdown(null);
                                        setSidebarOpen(false);
                                    }}
                                >
                                    View Products
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    className="dropdown-item"
                                    to="/addproduct"
                                    onClick={() => {
                                        setOpenDropdown(null);
                                        setSidebarOpen(false);
                                    }}
                                >
                                    Add Product
                                </NavLink>
                            </li>
                        </ul>
                    </li>

                    {/* Categories Dropdown */}
                    <li
                        className={`nav-item dropdown mb-2 pt-2 ps-3 ${openDropdown === "categories" ? "show" : ""
                            }`}
                    >
                        <button
                            className={`nav-link dropdown-toggle text-white w-100 text-start border-0 bg-transparent p-0 ${isCategoriesActive ? "fw-bold text-warning" : ""
                                }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown("categories");
                            }}
                        >
                            <i className="bi bi-tags me-2"></i> Categories
                        </button>

                        <ul
                            className={`dropdown-menu ${openDropdown === "categories" ? "show" : ""
                                }`}
                        >
                            <li>
                                <NavLink
                                    className="dropdown-item"
                                    to="/categoryview"
                                    onClick={() => {
                                        setOpenDropdown(null);
                                        setSidebarOpen(false);
                                    }}
                                >
                                    View Categories
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    className="dropdown-item"
                                    to="/category"
                                    onClick={() => {
                                        setOpenDropdown(null);
                                        setSidebarOpen(false);
                                    }}
                                >
                                    Add Category
                                </NavLink>
                            </li>
                        </ul>
                    </li>

                    {/* Reports Dropdown */}
                    <li
                        className={`nav-item dropdown mb-2 pt-2 ps-3 ${openDropdown === "reports" ? "show" : ""
                            }`}
                    >
                        <button
                            className={`nav-link dropdown-toggle text-white w-100 text-start border-0 bg-transparent p-0 ${isReportsActive ? "fw-bold text-warning" : ""
                                }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown("reports");
                            }}
                        >
                            <i className="bi bi-bar-chart-line me-2"></i> Reports
                        </button>

                        <ul
                            className={`dropdown-menu ${openDropdown === "reports" ? "show" : ""
                                }`}
                        >
                            <li>
                                <NavLink
                                    className="dropdown-item"
                                    to="/reports/yearly"
                                    onClick={() => {
                                        setOpenDropdown(null);
                                        setSidebarOpen(false);
                                    }}
                                >
                                    Yearly Sales
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    className="dropdown-item"
                                    to="/reports/monthly"
                                    onClick={() => {
                                        setOpenDropdown(null);
                                        setSidebarOpen(false);
                                    }}
                                >
                                    Monthly Sales
                                </NavLink>
                            </li>
                        </ul>
                    </li>

                    {/* Users */}
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/registerview"
                            className="nav-link text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <i className="bi bi-people me-2"></i> Users
                        </NavLink>
                    </li>

                    {/* Logout */}
                    <li className="nav-item mt-auto">
                        <button
                            className="btn btn-outline-light w-100 mt-3"
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = "/";
                            }}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i> Logout
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <main className="flex-grow-1 p-3 bg-light">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
