import { useState } from 'react';
import { superAdminAuthHeader } from './superAdminAuth';
import MessageDialog from '../shared/MessageDialog';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const CreateAdminForm = ({ onCreated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const createAdmin = async (e) => {
        e.preventDefault();
        setMsg('');
        setMsgType('info');
        setLoading(true);

        try {
            const res = await fetch(
                `${API_BASE_URL}/api/super-admin/create-admin`,
                {
                    method: 'POST',
                    headers: superAdminAuthHeader(),
                    body: JSON.stringify({ username, password }),
                }
            );

            const data = await res.json();

            if (data.success) {
                setMsg('Admin created successfully');
                setMsgType('success');
                setUsername('');
                setPassword('');
                onCreated();
            } else {
                setMsg(data.message || 'Failed to create admin');
                setMsgType('danger');
            }
        } catch {
            setMsg('Failed to create admin');
            setMsgType('danger');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-4 h-100 admin-form-card-v2">
            <span className="chip mb-2">Role Provisioning</span>
            <h5 className="fw-bold mb-2">Create Admin</h5>
            <p className="text-muted mb-3">Add a new admin user with credentials.</p>

            <form onSubmit={createAdmin}>
                <label className="form-label">Admin Email</label>
                <input
                    className="form-control mb-3"
                    placeholder="admin@email.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label className="form-label">Password</label>
                <div className="input-group mb-3">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword((s) => !s)}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>

                <button className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Admin'}
                </button>
            </form>

            <div className="small text-muted mt-3">
                Password should be at least 6 characters and not reused across accounts.
            </div>
            <MessageDialog
                show={!!msg}
                title={msgType === 'success' ? 'Success' : 'Admin Creation Failed'}
                message={msg}
                onClose={() => setMsg('')}
            />
        </div>
    );
};

export default CreateAdminForm;
