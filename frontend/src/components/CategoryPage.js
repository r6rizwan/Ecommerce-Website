import React, { useState } from "react";
import axios from "axios";

const CategoryPage = () => {
    const [formData, setFormData] = useState({ categoryName: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:3001/api/addcategory",
                formData
            );

            if (response.status === 200) {
                alert("Category added successfully!");
                setFormData({ categoryName: "" });
            } else {
                alert("Failed to add category.");
            }
        } catch (error) {
            alert("Error adding category.");
        }
    };

    return (
        <section className="py-5">
            <div className="row justify-content-center">
                <div className="col-md-4">

                    <div className="card p-4">
                        <h3 className="fw-bold text-center mb-1">Add Category</h3>
                        <p className="text-muted text-center mb-4">
                            Create a new product category
                        </p>

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

                            <button type="submit" className="btn btn-primary w-100">
                                Add Category
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CategoryPage;
