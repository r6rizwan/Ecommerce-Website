import React, { useState, useEffect } from "react";

const FeedbackView = () => {
    const [feedbackData, setFeedbackData] = useState([]);

    // Fetch all feedbacks on mount
    useEffect(() => {
        fetch("http://localhost:3001/api/getfeedback")
            .then((response) => response.json())
            .then((data) => setFeedbackData(data))
            .catch((error) =>
                console.error("Error fetching feedback data:", error)
            );
    }, []);

    // Delete feedback entry
    const deleteFeedback = async (id) => {
        if (!window.confirm("Are you sure you want to delete this feedback?")) return;

        try {
            const response = await fetch(
                `http://localhost:3001/api/deletefeedback/${id}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                setFeedbackData((prev) => prev.filter((f) => f.id !== id));
            } else {
                console.error("Failed to delete feedback");
            }
        } catch (error) {
            console.error("Error deleting feedback:", error);
        }
    };

    return (
        <div className="container my-5">
            <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">User Feedbacks</h2>
            </div>

            <div className="table-responsive shadow-sm">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>User ID</th>
                            <th>Product ID</th>
                            <th>About Product</th>
                            <th>About Service</th>
                            <th>Comments</th>
                            <th>Star Rating</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbackData.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center text-muted py-4">
                                    No feedback available.
                                </td>
                            </tr>
                        ) : (
                            feedbackData.map((feedback, index) => (
                                <tr key={feedback.id}>
                                    <td>{index + 1}</td>
                                    <td>{feedback.user_id}</td>
                                    <td>{feedback.pid}</td>
                                    <td>{feedback.about_product}</td>
                                    <td>{feedback.about_service}</td>
                                    <td>{feedback.comments}</td>
                                    <td>
                                        {feedback.star_rating && feedback.star_rating > 0 ? (
                                            [...Array(feedback.star_rating)].map((_, i) => (
                                                <i
                                                    key={i}
                                                    className="bi bi-star-fill text-warning mx-1"
                                                ></i>
                                            ))
                                        ) : (
                                            <span className="text-muted">No Rating</span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => deleteFeedback(feedback.id)}
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
    );
};

export default FeedbackView;
