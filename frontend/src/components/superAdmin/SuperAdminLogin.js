import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setSuperAdminToken } from './superAdminAuth';
import MessageDialog from '../shared/MessageDialog';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const SuperAdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`${API_BASE_URL}/api/super-admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.message);
                return;
            }

            setSuperAdminToken(data.token);
            navigate('/super-admin/dashboard');
        } catch (err) {
            setError('Server error. Try again.');
        }
    };

    return (
        <section className="auth-page-v2">
            <div className="row justify-content-center">
                <div className="col-md-5 col-lg-4">
                    <div className="card p-4 auth-card-v2">
                        <span className="chip mb-2">Restricted Area</span>
                        <h3 className="mb-1 fw-bold">Super Admin Login</h3>
                        <p className="text-muted mb-3">Manage admins and access settings.</p>

                        <form onSubmit={handleLogin}>
                            <input
                                type="email"
                                className="form-control mb-3"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <input
                                type="password"
                                className="form-control mb-3"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button className="btn btn-primary w-100">Login</button>
                        </form>
                    </div>
                </div>
            </div>
            <MessageDialog
                show={!!error}
                title="Login Failed"
                message={error}
                onClose={() => setError('')}
            />
        </section>
    );
};

export default SuperAdminLogin;
