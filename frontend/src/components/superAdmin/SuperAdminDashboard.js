import { useNavigate } from 'react-router-dom';
import { removeSuperAdminToken } from './superAdminAuth';
import CreateAdminForm from './CreateAdminForm';
import AdminList from './AdminList';
import { useState } from 'react';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);

    const logout = () => {
        removeSuperAdminToken();
        navigate('/super-admin/login');
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Super Admin Dashboard</h3>
                <button className="btn btn-outline-danger" onClick={logout}>
                    Logout
                </button>
            </div>

            <CreateAdminForm onCreated={() => setRefresh(!refresh)} />
            <AdminList refresh={refresh} />
        </>
    );
};

export default SuperAdminDashboard;
