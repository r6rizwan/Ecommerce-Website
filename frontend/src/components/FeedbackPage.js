import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useLocation } from "react-router-dom";

const FeedbackPage = () => {
    const [formData, setFormData] = useState({
        pid: '',
        aboutProduct: '',
        aboutService: '',
        comments: '',
        star_rating: 0,
    });

    const [hoverRating, setHoverRating] = useState(0);
    const location = useLocation();


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const pid = queryParams.get("product_id");
        const user_id = localStorage.getItem("userID");

        if (pid && user_id) {
            // Fetch existing feedback for this product and user
            axios.get(`http://localhost:3001/api/userfeedback/${pid}/${user_id}`)
                .then((res) => {
                    if (res.data) {
                        setFormData({
                            pid,
                            aboutProduct: res.data.about_product || '',
                            aboutService: res.data.about_service || '',
                            comments: res.data.comments || '',
                            star_rating: res.data.star_rating || 0,
                        });
                    }
                })
                .catch(() => console.log("No existing feedback found."));
        }
    }, [location]);


    // Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const user_id = localStorage.getItem("userID");
        if (!user_id) {
            alert("User not logged in. Please log in to submit feedback.");
            return;
        }

        // Validate star rating
        if (formData.star_rating < 1 || formData.star_rating > 5) {
            alert("Please select a valid star rating between 1 and 5!");
            return;
        }

        try {
            const payload = { ...formData, user_id };
            console.log("Submitting feedback:", payload);

            const response = await axios.post("http://localhost:3001/api/feedback", payload);

            if (response.status === 200) {
                alert("Feedback submitted successfully!");
                // Reset form
                setFormData({
                    pid: '',
                    aboutProduct: '',
                    aboutService: '',
                    comments: '',
                    star_rating: 0,
                });
                setHoverRating(0);
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);

            if (error.response?.data?.message === "You have already reviewed this product.") {
                alert("You have already submitted feedback for this product.");
            } else {
                alert("An error occurred while submitting feedback. Please try again.");
            }
        }
    };

    return (
        <div className="d-flex justify-content-center py-5 bg-light">
            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "450px" }}>
                <h3 className="text-center mb-4 text-primary fw-bold">Feedback Form</h3>

                <form onSubmit={handleSubmit}>
                    {/* Star Rating */}
                    <div className="mb-3 text-center">
                        <label className="form-label d-block fw-semibold">Rate the Product</label>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i
                                key={star}
                                className={`bi ${star <= (hoverRating || formData.star_rating)
                                    ? "bi-star-fill text-warning"
                                    : "bi-star"
                                    } fs-4 mx-1`}
                                style={{ cursor: "pointer", transition: "color 0.2s" }}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setFormData({ ...formData, star_rating: star })}
                            ></i>
                        ))}
                    </div>

                    {/* About Product Field */}
                    <div className="mb-3">
                        <label htmlFor="aboutProduct" className="form-label">About Product</label>
                        <input
                            type="text"
                            className="form-control"
                            id="aboutProduct"
                            name="aboutProduct"
                            placeholder="What do you think about our product?"
                            required
                            value={formData.aboutProduct}
                            onChange={handleChange}
                        />
                    </div>

                    {/* About Service Field */}
                    <div className="mb-3">
                        <label htmlFor="aboutService" className="form-label">About Service</label>
                        <input
                            type="text"
                            className="form-control"
                            id="aboutService"
                            name="aboutService"
                            placeholder="Share your thoughts on our service"
                            required
                            value={formData.aboutService}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Comments Field */}
                    <div className="mb-3">
                        <label htmlFor="comments" className="form-label">Additional Comments</label>
                        <textarea
                            className="form-control"
                            id="comments"
                            name="comments"
                            rows="3"
                            placeholder="Any suggestions or feedback?"
                            required
                            value={formData.comments}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary w-100">
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackPage;
