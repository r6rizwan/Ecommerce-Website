import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const PublicLayout = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");

    return (
        <div className="d-flex flex-column min-vh-100">
            {!isAdminRoute && <NavBar />}

            <main className="flex-grow-1">
                <Outlet />
            </main>

            {!isAdminRoute && <Footer />}
        </div>
    );
};

export default PublicLayout;
