import React, { useState, useEffect } from "react";
import { adminAuthHeader } from "../superAdmin/superAdminAuth";
import ConfirmDialog from "../shared/ConfirmDialog";
import MessageDialog from "../shared/MessageDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const FeedbackView = () => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [confirmFeedbackId, setConfirmFeedbackId] = useState(null);
    const [dialog, setDialog] = useState({ show: false, title: "", message: "" });

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/getfeedback`)
            .then((res) => res.json())
            .then((data) => setFeedbackData(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const deleteFeedback = async (id) => {
        setConfirmFeedbackId(id);
    };

    const confirmDeleteFeedback = async () => {
        const id = confirmFeedbackId;
        if (!id) return;
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/deletefeedback/${id}`,
                { method: "DELETE", headers: adminAuthHeader() }
            );

            if (res.ok) {
                setFeedbackData((prev) => prev.filter((f) => f.id !== id));
            } else {
                setDialog({ show: true, title: "Delete Failed", message: "Failed to delete feedback." });
            }
        } catch {
            setDialog({ show: true, title: "Delete Failed", message: "Error deleting feedback." });
        } finally {
            setConfirmFeedbackId(null);
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
        <section className="section">
            <div className="container">
                <div className="text-center mb-4 admin-hero-v2">
                    <h2 className="section-title">User Feedback</h2>
                    <p className="section-subtitle mx-auto mb-0">
                        Track product sentiment and service quality.
                    </p>
                </div>

                <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-between mb-3 toolbar admin-grid-toolbar-v3">
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Search by user, product, or comment..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <span className="chip">{filtered.length} results</span>
                </div>

                <div className="card admin-panel-v2 p-3 p-md-4">
                    {loading && (
                        <div className="text-center py-4">
                            <div className="skeleton-line w-60 mx-auto mb-2" />
                            <div className="skeleton-line w-40 mx-auto" />
                        </div>
                    )}

                    {!loading && filtered.length === 0 && (
                        <div className="text-center text-muted py-4">
                            No feedback available.
                        </div>
                    )}

                    {!loading && filtered.length > 0 && (
                        <div className="admin-review-grid-v3">
                            {filtered.map((f, index) => (
                                <div className="admin-review-item-v3" key={f.id}>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div className="d-flex gap-2 flex-wrap">
                                            <span className="chip">#{index + 1}</span>
                                            <span className="chip">User {f.user_id}</span>
                                            <span className="chip">Product {f.pid}</span>
                                        </div>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => deleteFeedback(f.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>

                                    <div className="small text-muted mb-1">
                                        Product: {f.about_product || "—"}
                                    </div>
                                    <div className="small text-muted mb-2">
                                        Service: {f.about_service || "—"}
                                    </div>
                                    <div className="mb-2">{f.comments || "No comments"}</div>
                                    <div>
                                        {f.star_rating ? (
                                            [...Array(f.star_rating)].map((_, i) => (
                                                <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                                            ))
                                        ) : (
                                            <span className="text-muted">—</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <ConfirmDialog
                show={!!confirmFeedbackId}
                title="Delete Feedback?"
                message="This feedback entry will be permanently removed."
                onCancel={() => setConfirmFeedbackId(null)}
                onConfirm={confirmDeleteFeedback}
            />
            <MessageDialog
                show={dialog.show}
                title={dialog.title}
                message={dialog.message}
                onClose={() => setDialog({ show: false, title: "", message: "" })}
            />
        </section>
    );
};

export default FeedbackView;
