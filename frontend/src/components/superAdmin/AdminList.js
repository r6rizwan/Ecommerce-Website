import { useEffect, useState } from 'react';
import { authHeader } from './superAdminAuth';

const AdminList = ({ refresh }) => {
    const [admins, setAdmins] = useState([]);

    const loadAdmins = async () => {
        const res = await fetch(
            'http://localhost:3001/api/super-admin/admins',
            { headers: authHeader() }
        );
        const data = await res.json();
        setAdmins(data.admins || []);
    };

    useEffect(() => {
        loadAdmins();
    }, [refresh]);

    const deleteAdmin = async (id) => {
        if (!window.confirm('Delete this admin?')) return;

        await fetch(
            `http://localhost:3001/api/super-admin/admin/${id}`,
            { method: 'DELETE', headers: authHeader() }
        );

        loadAdmins();
    };

    return (
        <div className="card p-3">
            <h5>Admins</h5>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map((a) => (
                        <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>{a.username}</td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteAdmin(a.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {admins.length === 0 && (
                        <tr>
                            <td colSpan="3" className="text-center">
                                No admins found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminList;
