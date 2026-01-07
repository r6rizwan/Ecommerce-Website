import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductAddPage = () => {
    const navigate = useNavigate();
    const [CatData, setCatData] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    const [formData, setFormData] = useState({
        categoryName: "",
        productName: "",
        quantity: "",
        uom: "",
        price: "",
        stock: "",
        description: "",
    });

    useEffect(() => {
        fetch("http://localhost:3001/api/getcategory")
            .then((res) => res.json())
            .then((data) => setCatData(data))
            .catch((err) => console.error(err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([k, v]) =>
                formDataToSend.append(k, v)
            );
            if (imageFile) formDataToSend.append("image", imageFile);

            const res = await axios.post(
                "http://localhost:3001/api/addproduct",
                formDataToSend,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.status === 200) {
                alert("Product added successfully!");
                navigate("/productview");
            } else {
                alert("Failed to add product.");
            }
        } catch (err) {
            alert("Error adding product.");
        }
    };

    return (
        <section className="py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">

                    <div className="card p-4">
                        <h3 className="fw-bold text-center mb-1">Add Product</h3>
                        <p className="text-muted text-center mb-4">
                            Enter product details
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    name="categoryName"
                                    required
                                    value={formData.categoryName}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>
                                        Select category
                                    </option>
                                    {CatData.map((c) => (
                                        <option key={c.id} value={c.category_name}>
                                            {c.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Product Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="productName"
                                    required
                                    value={formData.productName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="quantity"
                                        min="0"
                                        required
                                        value={formData.quantity}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">UoM</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="uom"
                                        required
                                        value={formData.uom}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row g-3 mt-1">
                                <div className="col-md-6">
                                    <label className="form-label">Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="price"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Stock</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="stock"
                                        min="0"
                                        required
                                        value={formData.stock}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="mb-3 mt-3">
                                <label className="form-label">Product Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary w-100">
                                Add Product
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProductAddPage;
