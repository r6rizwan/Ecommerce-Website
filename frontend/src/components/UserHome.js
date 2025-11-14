import React, { useState, useEffect } from 'react';

const UserHome = () => {
  const [ProductData, setProductData] = useState([]);
  const [FilteredData, setFilteredData] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [SelectedCategories, setSelectedCategories] = useState([]);
  const [PriceRange, setPriceRange] = useState(0);
  const [MaxPrice, setMaxPrice] = useState(100000);
  const user_id = localStorage.getItem("userID");

  useEffect(() => {
    fetch('http://localhost:3001/api/getproduct')
      .then((response) => response.json())
      .then((data) => {
        setProductData(data);
        setFilteredData(data);

        // Find max price dynamically
        const max = Math.max(...data.map((p) => Number(p.price) || 0));
        setMaxPrice(max);
        setPriceRange(max);

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((p) => p.category_name))];
        setCategories(uniqueCategories);
      })
      .catch((error) => console.error('Error fetching product data:', error));
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = ProductData.filter((product) => Number(product.price) <= PriceRange);

    if (SelectedCategories.length > 0) {
      filtered = filtered.filter((p) => SelectedCategories.includes(p.category_name));
    }

    setFilteredData(filtered);
  }, [PriceRange, SelectedCategories, ProductData]);

  const addToCart = async (pid) => {
    try {
      const response = await fetch(`http://localhost:3001/api/addtocart/${pid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id }),
      });

      if (response.ok) {
        window.dispatchEvent(new Event('cart-update'));
      } else {
        const errMsg = await response.text();
        alert(`Could not add to cart: ${errMsg}`);
      }
    } catch (error) {
      console.error('Error Adding to the Cart:', error);
      alert('Error adding item to cart');
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-5 fw-bold">Our Latest Products</h2>

      <div className="row">
        {/* Sidebar Filter */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow border-0 p-3 sticky-top" style={{ top: '80px' }}>
            <h5 className="fw-bold mb-3">Filter By</h5>

            {/* Price Range */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Price Range: ₹0 - ₹{PriceRange}
              </label>
              <input
                type="range"
                className="form-range"
                min="0"
                max={MaxPrice}
                step="100"
                value={PriceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <div className="d-flex justify-content-between small text-muted">
                <span>₹0</span>
                <span>₹{MaxPrice}</span>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h6 className="fw-semibold mb-2">Categories</h6>
              {Categories.map((category) => (
                <div className="form-check" key={category}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={category}
                    id={`cat-${category}`}
                    checked={SelectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <label className="form-check-label" htmlFor={`cat-${category}`}>
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="col-lg-9">
          <div className="row g-4">
            {FilteredData.length === 0 && (
              <div className="text-center text-muted">
                <p>No products found matching your filters.</p>
              </div>
            )}

            {FilteredData.map((product) => (
              <div className="col-sm-6 col-md-4" key={product.id}>
                <div className="card h-100 shadow-sm border-0 product-card">
                  <div className="position-relative">
                    <img
                      src={`http://localhost:3001/uploads/${product.image}`}
                      alt={product.product_name}
                      className="card-img-top p-3 rounded"
                      style={{
                        height: '220px',
                        objectFit: 'contain',
                        backgroundColor: '#f8f9fa',
                      }}
                    />
                    <span className="badge bg-success position-absolute top-0 start-0 m-2">
                      {product.category_name}
                    </span>
                  </div>

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-truncate">{product.product_name}</h5>
                    <p className="fw-bold fs-5 text-primary mb-3">₹{product.price}</p>
                    <p className="card-text text-truncate text-secondary">
                      {product.description}
                    </p>

                    <div className="mt-auto">
                      <button
                        className="btn btn-warning btn-sm w-100"
                        type="button"
                        onClick={() => addToCart(product.id)}
                      >
                        <i className="fa fa-shopping-cart"></i> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
