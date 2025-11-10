import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";

const AdminLayout = () => {
    const location = useLocation();
    const isReportsActive = location.pathname.startsWith("/reports");
    const [open, setOpen] = useState(false); // dropdown toggle
    const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

    // const toggleDropdown = () => setOpen(!open);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    useEffect(() => {
        setOpen(false);
    }, [location.pathname, sidebarOpen]);

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
                <h4 className="fw-bold mb-4 text-center">Admin Panel</h4>

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
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/productview"
                            className="nav-link text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <i className="bi bi-bag me-2"></i> Products
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/categoryview"
                            className="nav-link text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <i className="bi bi-tags me-2"></i> Categories
                        </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                        <NavLink
                            to="/registerview"
                            className="nav-link text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <i className="bi bi-people me-2"></i> Users
                        </NavLink>
                    </li>

                    {/* Reports Dropdown */}
                    <li className={`nav-item dropdown mb-2 pt-2 ps-3 ${open ? "show" : ""}`}>
                        <button
                            className={`nav-link dropdown-toggle text-white w-100 text-start border-0 bg-transparent p-0 ${isReportsActive ? "fw-bold text-warning" : ""
                                }`}
                            onClick={(e) => {
                                e.stopPropagation(); // prevent bubbling
                                setOpen((prev) => !prev);
                            }}
                        >
                            <i className="bi bi-bar-chart-line me-2"></i> Reports
                        </button>

                        <ul className={`dropdown-menu ${open ? "show" : ""}`}>
                            <li>
                                <NavLink
                                    className="dropdown-item"
                                    to="/reports/yearly"
                                    onClick={() => {
                                        setOpen(false);
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
                                        setOpen(false);
                                        setSidebarOpen(false);
                                    }}
                                >
                                    Monthly Sales
                                </NavLink>
                            </li>
                        </ul>
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
