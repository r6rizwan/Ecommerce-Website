import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setSuperAdminToken } from './superAdminAuth';

const SuperAdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:3001/api/super-admin/login', {
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
        <div className="row justify-content-center">
            <div className="col-md-4">
                <h3 className="mb-3 text-center">Super Admin Login</h3>

                {error && <div className="alert alert-danger">{error}</div>}

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

                    <button className="btn btn-dark w-100">Login</button>
                </form>
            </div>
        </div>
    );
};

export default SuperAdminLogin;
