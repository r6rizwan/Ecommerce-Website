import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { adminAuthHeader } from "../superAdmin/superAdminAuth";
import MessageDialog from "../shared/MessageDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const ProductAddPage = () => {
    const navigate = useNavigate();
    const [CatData, setCatData] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const [formData, setFormData] = useState({
        categoryName: "",
        productName: "",
        quantity: "",
        uom: "",
        price: "",
        stock: "",
        description: "",
        deliveryDaysMin: "4",
        deliveryDaysMax: "6",
    });

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/getcategory`)
            .then((res) => res.json())
            .then((data) => setCatData(data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setPreviewUrl(file ? URL.createObjectURL(file) : "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (Number(formData.deliveryDaysMin) > Number(formData.deliveryDaysMax)) {
            setMessage("Delivery ETA min days cannot be greater than max days.");
            setMessageType("danger");
            setLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([k, v]) =>
                formDataToSend.append(k, v)
            );
            if (imageFile) formDataToSend.append("image", imageFile);

            const res = await axios.post(
                `${API_BASE_URL}/api/addproduct`,
                formDataToSend,
                {
                    headers: {
                        ...adminAuthHeader(),
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res.status === 200) {
                setMessage("Product added successfully!");
                setMessageType("success");
                navigate("/productview");
            } else {
                setMessage("Failed to add product.");
                setMessageType("danger");
            }
        } catch (err) {
            setMessage(err?.response?.data?.message || "Error adding product.");
            setMessageType("danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section">
            <div className="text-center mb-4 admin-hero-v2">
                <h2 className="section-title">Add Product</h2>
                <p className="section-subtitle mx-auto mb-0">
                    Add new inventory with pricing, stock, and images.
                </p>
            </div>
            <div className="row justify-content-center g-4">
                <div className="col-lg-7">

                    <div className="card p-4 admin-form-card-v2">
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
                                {previewUrl && (
                                    <div className="mt-3 text-center">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="img-preview"
                                        />
                                    </div>
                                )}
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

                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label">Delivery ETA Min (days)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="deliveryDaysMin"
                                        min="1"
                                        value={formData.deliveryDaysMin}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Delivery ETA Max (days)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="deliveryDaysMax"
                                        min="1"
                                        value={formData.deliveryDaysMax}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? "Adding..." : "Add Product"}
                            </button>
                        </form>
                    </div>

                </div>
                <div className="col-lg-4">
                    <div className="card p-4 admin-panel-v2 h-100">
                        <h6 className="fw-bold mb-2">Publishing Checklist</h6>
                        <ul className="product-specs mb-3">
                            <li>Use clear product names</li>
                            <li>Upload high-quality image</li>
                            <li>Keep stock and quantity accurate</li>
                            <li>Write short and specific description</li>
                        </ul>
                        <div className="admin-preview-v3">
                            <span className="chip mb-2">Preview</span>
                            <div className="fw-semibold">{formData.productName || "New product"}</div>
                            <div className="text-muted small">{formData.categoryName || "No category selected"}</div>
                            <div className="mt-2 fw-bold text-success">
                                ₹{Number(formData.price || 0).toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <MessageDialog
                show={!!message}
                title={messageType === "success" ? "Success" : "Product Add Failed"}
                message={message}
                onClose={() => setMessage("")}
            />
        </section>
    );
};

export default ProductAddPage;
