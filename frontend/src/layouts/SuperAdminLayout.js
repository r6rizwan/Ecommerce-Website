import { Outlet, Navigate } from 'react-router-dom';
import { getSuperAdminToken } from '../components/superAdmin/superAdminAuth';

const SuperAdminLayout = () => {
    const token = getSuperAdminToken();

    // Protect all super-admin routes except login
    if (!token && window.location.pathname !== '/super-admin/login') {
        return <Navigate to="/super-admin/login" replace />;
    }

    return (
        <div className="container mt-4">
            <Outlet />
        </div>
    );
};

export default SuperAdminLayout;
