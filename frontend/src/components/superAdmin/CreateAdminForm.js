import { useState } from 'react';
import { authHeader } from './superAdminAuth';

const CreateAdminForm = ({ onCreated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');

    const createAdmin = async (e) => {
        e.preventDefault();
        setMsg('');

        const res = await fetch(
            'http://localhost:3001/api/super-admin/create-admin',
            {
                method: 'POST',
                headers: authHeader(),
                body: JSON.stringify({ username, password }),
            }
        );

        const data = await res.json();

        if (data.success) {
            setMsg('Admin created successfully');
            setUsername('');
            setPassword('');
            onCreated();
        } else {
            setMsg(data.message);
        }
    };

    return (
        <div className="card p-3 mb-4">
            <h5>Create Admin</h5>

            {msg && <div className="alert alert-info">{msg}</div>}

            <form onSubmit={createAdmin}>
                <input
                    className="form-control mb-2"
                    placeholder="Admin Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button className="btn btn-success">Create Admin</button>
            </form>
        </div>
    );
};

export default CreateAdminForm;
