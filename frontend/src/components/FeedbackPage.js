import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const FeedbackPage = () => {
    const [formData, setFormData] = useState({
        pid: "",
        aboutProduct: "",
        aboutService: "",
        comments: "",
        star_rating: 0,
    });

    const [hoverRating, setHoverRating] = useState(0);
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const pid = queryParams.get("product_id");
        const user_id = localStorage.getItem("userID");

        if (pid && user_id) {
            axios
                .get(`http://localhost:3001/api/userfeedback/${pid}/${user_id}`)
                .then((res) => {
                    if (res.data) {
                        setFormData({
                            pid,
                            aboutProduct: res.data.about_product || "",
                            aboutService: res.data.about_service || "",
                            comments: res.data.comments || "",
                            star_rating: res.data.star_rating || 0,
                        });
                    }
                })
                .catch(() => { });
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user_id = localStorage.getItem("userID");
        setMessage("");
        setMessageType("danger");

        if (!user_id) {
            setMessage("Please login to submit feedback.");
            return;
        }

        if (formData.star_rating < 1) {
            setMessage("Please select a star rating.");
            return;
        }

        try {
            setLoading(true);
            const payload = { ...formData, user_id };
            const res = await axios.post(
                "http://localhost:3001/api/feedback",
                payload
            );

            if (res.status === 200) {
                setMessage("Feedback submitted successfully!");
                setMessageType("success");
                setFormData({
                    pid: "",
                    aboutProduct: "",
                    aboutService: "",
                    comments: "",
                    star_rating: 0,
                });
                setHoverRating(0);
            }
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Error submitting feedback. Try again."
            );
            setMessageType("danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">

                    <div className="card p-4">
                        <h3 className="fw-bold text-center mb-1">Product Feedback</h3>
                        <p className="text-muted text-center mb-4">
                            Share your experience with us
                        </p>

                        {message && (
                            <div className={`alert alert-${messageType} py-2`} role="alert">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Star Rating */}
                            <div className="mb-4 text-center">
                                <label className="form-label fw-semibold d-block mb-2">
                                    Rate the product
                                </label>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                        key={star}
                                        className={`bi ${star <= (hoverRating || formData.star_rating)
                                                ? "bi-star-fill text-warning"
                                                : "bi-star text-muted"
                                            } fs-3 mx-1`}
                                        style={{ cursor: "pointer" }}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() =>
                                            setFormData({ ...formData, star_rating: star })
                                        }
                                    ></i>
                                ))}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">About Product</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="aboutProduct"
                                    placeholder="Your thoughts about the product"
                                    required
                                    value={formData.aboutProduct}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">About Service</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="aboutService"
                                    placeholder="Your experience with our service"
                                    required
                                    value={formData.aboutService}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Additional Comments</label>
                                <textarea
                                    className="form-control"
                                    name="comments"
                                    rows="3"
                                    placeholder="Any suggestions or feedback"
                                    required
                                    value={formData.comments}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit Feedback"}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FeedbackPage;
