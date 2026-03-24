import React, { useState, useEffect } from "react";
import { adminAuthHeader } from "../superAdmin/superAdminAuth";
import ConfirmDialog from "../shared/ConfirmDialog";
import MessageDialog from "../shared/MessageDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const CategoryView = () => {
    const [CatData, setCatData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [confirmCategoryId, setConfirmCategoryId] = useState(null);
    const [dialog, setDialog] = useState({ show: false, title: "", message: "" });

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/getcategory`)
            .then((res) => res.json())
            .then((data) => setCatData(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const DeleteCat = async (id) => {
        setConfirmCategoryId(id);
    };

    const confirmDeleteCategory = async () => {
        const id = confirmCategoryId;
        if (!id) return;
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/deletecategory/${id}`,
                { method: "DELETE", headers: adminAuthHeader() }
            );

            if (res.ok) {
                setCatData((prev) => prev.filter((c) => c.id !== id));
            } else {
                setDialog({ show: true, title: "Delete Failed", message: "Failed to delete category." });
            }
        } catch (err) {
            setDialog({ show: true, title: "Delete Failed", message: "Error deleting category." });
        } finally {
            setConfirmCategoryId(null);
        }
    };

    const filteredCategories = CatData.filter((c) =>
        c.category_name?.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <section className="section">
            <div className="text-center mb-4 admin-hero-v2">
                <h2 className="section-title">Categories</h2>
                <p className="section-subtitle mx-auto mb-0">
                    Organize products with clean, searchable categories.
                </p>
            </div>

            <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-between mb-3 toolbar admin-grid-toolbar-v3">
                <input
                    type="search"
                    className="form-control"
                    placeholder="Search categories..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <span className="chip">{filteredCategories.length} results</span>
            </div>

            <div className="card admin-panel-v2 admin-grid-card-v3">
                <div className="table-responsive">
                    <table className="table align-middle mb-0 admin-grid-table-v3">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Category Name</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan="3" className="text-center py-4">
                                        <div className="skeleton-line w-60 mx-auto mb-2" />
                                        <div className="skeleton-line w-40 mx-auto" />
                                    </td>
                                </tr>
                            )}

                            {!loading && filteredCategories.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted py-4">
                                        No categories found.
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                filteredCategories.map((category, index) => (
                                    <tr key={category.id}>
                                        <td>{index + 1}</td>
                                        <td className="fw-semibold">
                                            {category.category_name}
                                        </td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => DeleteCat(category.id)}
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
            <ConfirmDialog
                show={!!confirmCategoryId}
                title="Delete Category?"
                message="This category will be permanently removed."
                onCancel={() => setConfirmCategoryId(null)}
                onConfirm={confirmDeleteCategory}
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

export default CategoryView;
