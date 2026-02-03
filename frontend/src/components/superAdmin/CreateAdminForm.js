import { useState } from 'react';
import { superAdminAuthHeader } from './superAdminAuth';

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
                'http://localhost:3001/api/super-admin/create-admin',
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
        <div className="card p-4 h-100">
            <h5 className="fw-bold mb-2">Create Admin</h5>
            <p className="text-muted mb-3">Add a new admin user with credentials.</p>

            {msg && <div className={`alert alert-${msgType} py-2`}>{msg}</div>}

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
        </div>
    );
};

export default CreateAdminForm;
