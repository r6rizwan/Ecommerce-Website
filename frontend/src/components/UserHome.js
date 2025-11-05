import React, { useState, useEffect } from 'react'

const UserHome = () => {
  const [ProductData, setProductData] = useState([]);

  const username = localStorage.getItem("userName");

  useEffect(() => {
    fetch('http://localhost:3001/api/getproduct')
      .then((response) => response.json())
      .then((data) => setProductData(data))
      .catch((error) => console.error('Error fetching product data:', error));
  }, []);

  return (
    <div className="container my-5">
      <div className="text-center">
        <h3 className="mb-4">Welcome {username}</h3>
      </div>
      <h2 className="text-center mb-5 fw-bold">Our Latest Products</h2>
      <div className="row g-4">
        {ProductData.length === 0 && (
          <div className="text-center text-muted">
            <p>No products available.</p>
          </div>
        )}

        {ProductData.map((product) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={product.id}>
            <div className="card h-100 shadow-sm border-0 product-card">
              <div className="position-relative">
                <img src={`http://localhost:3001/uploads/${product.image}`}
                  alt={product.product_name} className="card-img-top p-3 rounded"
                  style={{ height: '220px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}>
                </img>
                <span className="badge bg-success position-absolute top-0 start-0 m-2">
                  {product.category_name}
                </span>
              </div>

              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-truncate">{product.product_name}</h5>
                <p className="text-muted small mb-2">{product.uom} | Stock: {product.stock}</p>
                <p className="fw-bold fs-5 text-primary mb-3">₹{product.price}</p>
                <p className="card-text text-truncate text-secondary">{product.description}</p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <button className="btn btn-warning btn-sm">
                    <i className="fa fa-shopping-cart"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserHome
