import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const PublicLayout = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");

    return (
        <>
            {!isAdminRoute && <NavBar />}
            <main className="flex-grow-1">
                <Outlet />
            </main>
            {!isAdminRoute && <Footer />}
        </>
    );
};

export default PublicLayout;
