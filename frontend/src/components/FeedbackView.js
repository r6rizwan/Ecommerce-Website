import React, { useState, useEffect } from "react";

const FeedbackView = () => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetch("http://localhost:3001/api/getfeedback")
            .then((res) => res.json())
            .then((data) => setFeedbackData(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const deleteFeedback = async (id) => {
        if (!window.confirm("Delete this feedback?")) return;

        try {
            const res = await fetch(
                `http://localhost:3001/api/deletefeedback/${id}`,
                { method: "DELETE" }
            );

            if (res.ok) {
                setFeedbackData((prev) => prev.filter((f) => f.id !== id));
            } else {
                alert("Failed to delete feedback.");
            }
        } catch {
            alert("Error deleting feedback.");
        }
    };

    const filtered = feedbackData.filter((f) => {
        const q = query.toLowerCase();
        return (
            f.user_id?.toString().toLowerCase().includes(q) ||
            f.pid?.toString().toLowerCase().includes(q) ||
            f.comments?.toLowerCase().includes(q)
        );
    });

    return (
        <section className="py-4">
            <h2 className="fw-bold text-center mb-4">User Feedback</h2>

            <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-between mb-3">
                <input
                    type="search"
                    className="form-control"
                    placeholder="Search by user, product, or comment..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <span className="text-muted small">
                    {filtered.length} results
                </span>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>Product</th>
                                <th>Product Feedback</th>
                                <th>Service Feedback</th>
                                <th>Comments</th>
                                <th>Rating</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        <div className="skeleton-line w-60 mx-auto mb-2" />
                                        <div className="skeleton-line w-40 mx-auto" />
                                    </td>
                                </tr>
                            )}

                            {!loading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted py-4">
                                        No feedback available.
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                filtered.map((f, index) => (
                                    <tr key={f.id}>
                                        <td>{index + 1}</td>
                                        <td>{f.user_id}</td>
                                        <td>{f.pid}</td>

                                        <td className="text-truncate" style={{ maxWidth: 150 }}>
                                            {f.about_product}
                                        </td>

                                        <td className="text-truncate" style={{ maxWidth: 150 }}>
                                            {f.about_service}
                                        </td>

                                        <td className="text-truncate" style={{ maxWidth: 200 }}>
                                            {f.comments}
                                        </td>

                                        <td>
                                            {f.star_rating ? (
                                                [...Array(f.star_rating)].map((_, i) => (
                                                    <i
                                                        key={i}
                                                        className="bi bi-star-fill text-warning me-1"
                                                    ></i>
                                                ))
                                            ) : (
                                                <span className="text-muted">—</span>
                                            )}
                                        </td>

                                        <td className="text-end">
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => deleteFeedback(f.id)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default FeedbackView;
