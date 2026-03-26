import React, { useState } from "react";
import axios from "axios";
import { adminAuthHeader } from "../superAdmin/superAdminAuth";
import MessageDialog from "../shared/MessageDialog";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const CategoryPage = () => {
    const [formData, setFormData] = useState({ categoryName: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/addcategory`,
                formData,
                { headers: adminAuthHeader() }
            );

            if (response.status === 200) {
                setMessage("Category added successfully!");
                setMessageType("success");
                setFormData({ categoryName: "" });
            } else {
                setMessage("Failed to add category.");
                setMessageType("danger");
            }
        } catch (error) {
            setMessage(error?.response?.data?.message || "Error adding category.");
            setMessageType("danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section">
            <div className="text-center mb-4 admin-hero-v2">
                <h2 className="section-title">Add Category</h2>
                <p className="section-subtitle mx-auto mb-0">
                    Create a new product category for your store.
                </p>
            </div>
            <div className="row justify-content-center g-4">
                <div className="col-lg-5 col-md-7">

                    <div className="card p-4 admin-form-card-v2">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Category Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="categoryName"
                                    placeholder="Enter category name"
                                    required
                                    value={formData.categoryName}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading || !formData.categoryName.trim()}
                            >
                                {loading ? "Adding..." : "Add Category"}
                            </button>
                        </form>
                    </div>

                </div>
                <div className="col-lg-4 col-md-5">
                    <div className="card p-4 admin-panel-v2 h-100">
                        <h6 className="fw-bold mb-2">Category Guidelines</h6>
                        <ul className="product-specs mb-0">
                            <li>Keep names short and clear</li>
                            <li>Avoid duplicate category names</li>
                            <li>Use singular naming style</li>
                            <li>Group similar products together</li>
                        </ul>
                    </div>
                </div>
            </div>
            <MessageDialog
                show={!!message}
                title={messageType === "success" ? "Success" : "Category Error"}
                message={message}
                onClose={() => setMessage("")}
            />
        </section>
    );
};

export default CategoryPage;
