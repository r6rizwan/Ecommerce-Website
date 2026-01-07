import React, { useEffect, useState } from "react";

const RegistrationView = () => {
    const [RegData, setRegData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("http://localhost:3001/api/getregister")
            .then((res) => res.json())
            .then((data) => setRegData(data))
            .catch((err) => console.error(err));
    }, []);

    const DeleteReg = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const res = await fetch(
                `http://localhost:3001/api/deleteregister/${id}`,
                { method: "DELETE" }
            );

            if (res.ok) {
                setRegData((prev) => prev.filter((u) => u.id !== id));
            } else {
                alert("Failed to delete user.");
            }
        } catch {
            alert("Error deleting user.");
        }
    };

    const filteredData = RegData.filter((u) =>
        [u.name, u.email, u.city]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <section className="py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <h2 className="fw-bold mb-0">Registered Users</h2>

                <input
                    type="text"
                    className="form-control w-md-50"
                    placeholder="Search by name, email, or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>Gender</th>
                                <th>City</th>
                                <th>Address</th>
                                <th>Pincode</th>
                                <th>Email</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted py-4">
                                        No matching users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>

                                        <td className="fw-semibold">
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                                                    style={{ width: 36, height: 36 }}
                                                >
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                {user.name}
                                            </div>
                                        </td>

                                        <td>{user.gender}</td>
                                        <td>{user.city}</td>
                                        <td className="text-muted small text-truncate" style={{ maxWidth: 200 }}>
                                            {user.address}
                                        </td>
                                        <td>{user.pincode}</td>
                                        <td className="text-primary">{user.email}</td>

                                        <td className="text-end">
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => DeleteReg(user.id)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default RegistrationView;
