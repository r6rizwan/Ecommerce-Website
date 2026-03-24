import React, { useState, useEffect } from "react";
import { adminAuthHeader } from "../superAdmin/superAdminAuth";
import ConfirmDialog from "../shared/ConfirmDialog";
import MessageDialog from "../shared/MessageDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

const ProductThumbOrName = ({ image, name }) => {
    const [showName, setShowName] = useState(!(image && String(image).trim()));

    if (showName) {
        return <div className="admin-product-thumb-fallback">{name}</div>;
    }

    return (
        <img
            src={`${API_BASE_URL}/uploads/${image}`}
            alt={name}
            className="rounded img-frame img-cover img-thumb-sm"
            onError={() => setShowName(true)}
        />
    );
};

const ProductView = () => {
    const [ProductData, setProductData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [confirmProductId, setConfirmProductId] = useState(null);
    const [dialog, setDialog] = useState({ show: false, title: "", message: "" });

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/getproduct`)
            .then((res) => res.json())
            .then((data) => setProductData(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const DeleteReg = async (id) => {
        setConfirmProductId(id);
    };

    const confirmDeleteProduct = async () => {
        const id = confirmProductId;
        if (!id) return;
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/deleteproduct/${id}`,
                { method: "DELETE", headers: adminAuthHeader() }
            );

            if (res.ok) {
                setProductData((prev) =>
                    prev.filter((product) => product.id !== id)
                );
            } else {
                setDialog({ show: true, title: "Delete Failed", message: "Failed to delete product." });
            }
        } catch (err) {
            setDialog({ show: true, title: "Delete Failed", message: "Error deleting product." });
        } finally {
            setConfirmProductId(null);
        }
    };

    const filteredProducts = ProductData.filter((p) =>
        p.product_name?.toLowerCase().includes(query.toLowerCase())
    ).filter((p) => (category === "all" ? true : p.category_name === category));

    return (
        <section className="section">
            <div className="text-center mb-4 admin-hero-v2">
                <h2 className="section-title">Products</h2>
                <p className="section-subtitle mx-auto mb-0">
                    Manage inventory, pricing, and stock levels.
                </p>
            </div>

            <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-between mb-3 toolbar admin-grid-toolbar-v3">
                <input
                    type="search"
                    className="form-control"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ maxWidth: "200px" }}
                >
                    <option value="all">All categories</option>
                    {[...new Set(ProductData.map((p) => p.category_name))].map(
                        (c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        )
                    )}
                </select>
                <span className="chip">{filteredProducts.length} results</span>
            </div>

            <div className="card admin-panel-v2 p-3 p-md-4">
                {loading && (
                    <div className="text-center py-4">
                        <div className="skeleton-line w-60 mx-auto mb-2" />
                        <div className="skeleton-line w-40 mx-auto" />
                    </div>
                )}

                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center text-muted py-4">
                        No products found.
                    </div>
                )}

                {!loading && filteredProducts.length > 0 && (
                    <div className="admin-product-grid-v3">
                        {filteredProducts.map((product, index) => (
                            <div className="admin-product-item-v3" key={product.id}>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div className="d-flex gap-2 flex-wrap">
                                        <span className="chip">#{index + 1}</span>
                                        <span className="chip">{product.category_name}</span>
                                    </div>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => DeleteReg(product.id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>

                                <div className="d-flex gap-3 align-items-center mb-2">
                                    <ProductThumbOrName
                                        image={product.image}
                                        name={product.product_name}
                                    />
                                    <div>
                                        <div className="fw-semibold">{product.product_name}</div>
                                        <div className="text-muted small text-truncate" style={{ maxWidth: "260px" }}>
                                            {product.description || "No description"}
                                        </div>
                                    </div>
                                </div>

                                <div className="admin-product-meta-v3">
                                    <span>Qty: {product.qty}</span>
                                    <span>UoM: {product.uom}</span>
                                    <span>Stock: {product.stock}</span>
                                    <span className="fw-bold text-success">₹{product.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <ConfirmDialog
                show={!!confirmProductId}
                title="Delete Product?"
                message="This product will be permanently removed."
                onCancel={() => setConfirmProductId(null)}
                onConfirm={confirmDeleteProduct}
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

export default ProductView;
