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
        <section className="section">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
                <div>
                    <h3 className="fw-bold mb-1">Super Admin Dashboard</h3>
                    <div className="text-muted">Manage admins and access controls.</div>
                </div>
                <div className="dashboard-actions">
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setRefresh(!refresh)}
                    >
                        Refresh
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-5">
                    <CreateAdminForm onCreated={() => setRefresh(!refresh)} />
                </div>
                <div className="col-lg-7">
                    <AdminList refresh={refresh} />
                </div>
            </div>
        </section>
    );
};

export default SuperAdminDashboard;
