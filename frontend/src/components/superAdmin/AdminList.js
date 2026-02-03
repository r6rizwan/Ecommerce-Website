import { useEffect, useMemo, useState } from 'react';
import { superAdminAuthHeader } from './superAdminAuth';

const AdminList = ({ refresh }) => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

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

    const filtered = useMemo(() => {
        if (!query.trim()) return admins;
        const q = query.trim().toLowerCase();
        return admins.filter((a) =>
            `${a.id} ${a.username}`.toLowerCase().includes(q)
        );
    }, [admins, query]);

    return (
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
                            <th className="text-end">Action</th>
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
    );
};

export default AdminList;
