import React, { useState, useEffect } from 'react'

const ProductView = () => {
    const [ProductData, setProductData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/getproduct')
            .then(response => response.json())
            .then(data => setProductData(data))
            .catch(error => console.error('Error fetching product data:', error));
    }, []);

    const DeleteReg = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/deleteproduct/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setProductData(ProductData.filter(product => product.id !== id));
            } else {
                console.error('Failed to delete the product.');
            }
        } catch (error) {
            console.error('Error deleting the product:', error);
        }
    }

    return (
        <div className="container my-5">
            <div className="text-center">
                <h1 className="mb-4">Products</h1>
                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>UoM</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Image</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ProductData.map((product, index) => (
                            <tr key={index}>
                                <td>{product.product_name}</td>
                                <td>{product.category_name}</td>
                                <td>{product.qty}</td>
                                <td>{product.uom}</td>
                                <td>{product.price}</td>
                                <td>{product.stock}</td>
                                <td><img src={`http://localhost:3001/uploads/${product.image}`} alt={product.product_name} width="150" height="150" /></td>
                                <td>{product.description}</td>
                                <td> <i className='fa fa-trash text-danger' onClick={() => { if (window.confirm('Are you sure you want to delete this product?')) DeleteReg(product.id); }}></i></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductView
