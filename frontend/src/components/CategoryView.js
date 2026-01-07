import React, { useState, useEffect } from "react";

const CategoryView = () => {
    const [CatData, setCatData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/api/getcategory")
            .then((res) => res.json())
            .then((data) => setCatData(data))
            .catch((err) => console.error(err));
    }, []);

    const DeleteCat = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?"))
            return;

        try {
            const res = await fetch(
                `http://localhost:3001/api/deletecategory/${id}`,
                { method: "DELETE" }
            );

            if (res.ok) {
                setCatData((prev) => prev.filter((c) => c.id !== id));
            } else {
                alert("Failed to delete category.");
            }
        } catch (err) {
            alert("Error deleting category.");
        }
    };

    return (
        <section className="py-4">
            <h2 className="fw-bold text-center mb-4">Categories</h2>

            <div className="card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Category Name</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {CatData.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted py-4">
                                        No categories found.
                                    </td>
                                </tr>
                            ) : (
                                CatData.map((category, index) => (
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default CategoryView;
