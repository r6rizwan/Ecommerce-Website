import { useEffect, useMemo, useState } from 'react';
import { superAdminAuthHeader } from './superAdminAuth';

const AdminList = ({ refresh }) => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetAdminId, setResetAdminId] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    const loadAdmins = async () => {
        setLoading(true);
        const res = await fetch(
            'http://localhost:3001/api/super-admin/admins',
            { headers: superAdminAuthHeader() }
        );
        const data = await res.json();
        setAdmins(data.admins || []);
        setLoading(false);
    };

    useEffect(() => {
        loadAdmins();
    }, [refresh]);

    const deleteAdmin = async (id) => {
        if (!window.confirm('Delete this admin?')) return;

        await fetch(
            `http://localhost:3001/api/super-admin/admin/${id}`,
            { method: 'DELETE', headers: superAdminAuthHeader() }
        );

        loadAdmins();
    };

    const openResetModal = (id) => {
        setResetAdminId(id);
        setNewPassword('');
        setResetMessage('');
        setShowResetModal(true);
    };

    const closeResetModal = () => {
        setShowResetModal(false);
        setResetAdminId(null);
        setNewPassword('');
        setResetMessage('');
    };

    const resetAdminPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            setResetMessage('Password must be at least 6 characters.');
            return;
        }

        setResetLoading(true);
        setResetMessage('');

        const res = await fetch(
            `http://localhost:3001/api/super-admin/admin/${resetAdminId}/reset-password`,
            {
                method: 'POST',
                headers: superAdminAuthHeader(),
                body: JSON.stringify({ newPassword })
            }
        );

        const data = await res.json();
        if (!data.success) {
            setResetMessage(data.message || 'Failed to reset password');
        } else {
            setResetMessage('Password reset successfully');
        }
        setResetLoading(false);
    };

    const filtered = useMemo(() => {
        if (!query.trim()) return admins;
        const q = query.trim().toLowerCase();
        return admins.filter((a) =>
            `${a.id} ${a.username}`.toLowerCase().includes(q)
        );
    }, [admins, query]);

    return (
        <>
            <div className="card p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Admins</h5>
                    <span className="text-muted small">{filtered.length} users</span>
                </div>

                <input
                    className="form-control mb-3"
                    placeholder="Search by email or ID..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Email</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan="3" className="text-center py-4">
                                        <div className="skeleton-line w-60 mx-auto mb-2" />
                                        <div className="skeleton-line w-40 mx-auto" />
                                    </td>
                                </tr>
                            )}

                            {!loading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted py-4">
                                        No admins found
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                filtered.map((a) => (
                                    <tr key={a.id}>
                                        <td>{a.id}</td>
                                        <td>{a.username}</td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-outline-primary btn-sm me-2"
                                                onClick={() => openResetModal(a.id)}
                                            >
                                                Reset
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => deleteAdmin(a.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showResetModal && (
                <div className="modal-backdrop-custom">
                    <div className="modal-card">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="fw-bold mb-0">Reset Admin Password</h6>
                            <button className="btn btn-sm btn-light" onClick={closeResetModal}>
                                ✕
                            </button>
                        </div>
                        <p className="text-muted small mb-3">
                            Set a new password for this admin (min 6 characters).
                        </p>
                        {resetMessage && (
                            <div className="alert alert-info py-2">{resetMessage}</div>
                        )}
                        <form onSubmit={resetAdminPassword}>
                            <input
                                type="password"
                                className="form-control mb-3"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <div className="d-flex gap-2 justify-content-end">
                                <button type="button" className="btn btn-outline-secondary" onClick={closeResetModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={resetLoading}>
                                    {resetLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminList;
