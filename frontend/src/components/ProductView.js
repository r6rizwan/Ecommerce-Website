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
                                <td>
                                    <img src={product.image} alt={product.product_name} width="100" height="100"></img>
                                </td>
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

// import React, { useState, useEffect } from 'react';

// const ProductView = () => {
//   const [ProductData, setProductData] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:3001/api/getproduct')
//       .then((response) => response.json())
//       .then((data) => setProductData(data))
//       .catch((error) => console.error('Error fetching product data:', error));
//   }, []);

//   const DeleteReg = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this product?')) return;

//     try {
//       const response = await fetch(`http://localhost:3001/api/deleteproduct/${id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         setProductData(ProductData.filter((product) => product.id !== id));
//       } else {
//         console.error('Failed to delete the product.');
//       }
//     } catch (error) {
//       console.error('Error deleting the product:', error);
//     }
//   };

//   return (
//     <div className="container my-5">
//       <h1 className="text-center mb-5 fw-bold">🛍️ Our Products</h1>

//       <div className="row g-4">
//         {ProductData.length === 0 && (
//           <div className="text-center text-muted">
//             <p>No products available.</p>
//           </div>
//         )}

//         {ProductData.map((product) => (
//           <div className="col-sm-6 col-md-4 col-lg-3" key={product.id}>
//             <div className="card h-100 shadow-sm border-0 product-card">
//               <div className="position-relative">
//                 <img
//                   src={product.image}
//                   alt={product.product_name}
//                   className="card-img-top p-3 rounded"
//                   style={{ height: '220px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
//                 />
//                 <span className="badge bg-success position-absolute top-0 start-0 m-2">
//                   {product.category_name}
//                 </span>
//               </div>

//               <div className="card-body d-flex flex-column">
//                 <h5 className="card-title text-truncate">{product.product_name}</h5>
//                 <p className="text-muted small mb-2">{product.uom} | Stock: {product.stock}</p>
//                 <p className="fw-bold fs-5 text-primary mb-3">₹{product.price}</p>
//                 <p className="card-text text-truncate text-secondary">{product.description}</p>

//                 <div className="mt-auto d-flex justify-content-between align-items-center">
//                   <button className="btn btn-outline-danger btn-sm" onClick={() => DeleteReg(product.id)}>
//                     <i className="fa fa-trash"></i> Delete
//                   </button>
//                   <button className="btn btn-warning btn-sm">
//                     <i className="fa fa-shopping-cart"></i> Add to Cart
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductView;
