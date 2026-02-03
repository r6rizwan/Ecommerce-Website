import React, { useState, useEffect } from "react";

const ProductView = () => {
    const [ProductData, setProductData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");

    useEffect(() => {
        fetch("http://localhost:3001/api/getproduct")
            .then((res) => res.json())
            .then((data) => setProductData(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const DeleteReg = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(
                `http://localhost:3001/api/deleteproduct/${id}`,
                { method: "DELETE" }
            );

            if (res.ok) {
                setProductData((prev) =>
                    prev.filter((product) => product.id !== id)
                );
            } else {
                alert("Failed to delete product.");
            }
        } catch (err) {
            alert("Error deleting product.");
        }
    };

    return (
        <section className="py-4">
            <h2 className="fw-bold text-center mb-4">Products</h2>

            <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-between mb-3">
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
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Qty</th>
                                <th>UoM</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Image</th>
                                <th>Description</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan="10" className="text-center py-4">
                                        <div className="skeleton-line w-60 mx-auto mb-2" />
                                        <div className="skeleton-line w-40 mx-auto" />
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                ProductData.filter((p) =>
                                    p.product_name?.toLowerCase().includes(query.toLowerCase())
                                )
                                    .filter((p) =>
                                        category === "all" ? true : p.category_name === category
                                    ).length === 0 && (
                                <tr>
                                    <td colSpan="10" className="text-center text-muted py-4">
                                        No products found.
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                ProductData.filter((p) =>
                                    p.product_name?.toLowerCase().includes(query.toLowerCase())
                                )
                                    .filter((p) =>
                                        category === "all" ? true : p.category_name === category
                                    )
                                    .map((product, index) => (
                                    <tr key={product.id}>
                                        <td>{index + 1}</td>
                                        <td className="fw-semibold">
                                            {product.product_name}
                                        </td>
                                        <td>{product.category_name}</td>
                                        <td>{product.qty}</td>
                                        <td>{product.uom}</td>
                                        <td>₹{product.price}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <img
                                                src={`http://localhost:3001/uploads/${product.image}`}
                                                alt={product.product_name}
                                                className="rounded img-frame img-cover img-thumb-sm"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = "/default-product.png";
                                                }}
                                            />
                                        </td>
                                        <td
                                            className="text-truncate"
                                            style={{ maxWidth: "200px" }}
                                        >
                                            {product.description}
                                        </td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => DeleteReg(product.id)}
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

export default ProductView;
