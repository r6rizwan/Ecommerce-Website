import React, { useState, useEffect } from "react";

const UserHome = () => {
  const [ProductData, setProductData] = useState([]);
  const [FilteredData, setFilteredData] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [SelectedCategories, setSelectedCategories] = useState([]);
  const [PriceRange, setPriceRange] = useState(0);
  const [MaxPrice, setMaxPrice] = useState(100000);
  const user_id = localStorage.getItem("userID");

  useEffect(() => {
    fetch("http://localhost:3001/api/getproduct")
      .then((res) => res.json())
      .then((data) => {
        setProductData(data);
        setFilteredData(data);

        const max = Math.max(...data.map((p) => Number(p.price) || 0));
        setMaxPrice(max);
        setPriceRange(max);

        const uniqueCategories = [...new Set(data.map((p) => p.category_name))];
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let filtered = ProductData.filter(
      (p) => Number(p.price) <= PriceRange
    );

    if (SelectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        SelectedCategories.includes(p.category_name)
      );
    }

    setFilteredData(filtered);
  }, [PriceRange, SelectedCategories, ProductData]);

  const addToCart = async (pid) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/addtocart/${pid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id }),
        }
      );

      if (res.ok) {
        window.dispatchEvent(new Event("cart-update"));
      } else {
        alert("Could not add to cart");
      }
    } catch (err) {
      alert("Error adding item to cart");
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
    <section className="py-4">
      <h2 className="fw-bold mb-4 text-center">Latest Products</h2>

      <div className="row">
        {/* Filters */}
        <div className="col-lg-3 mb-4">
          <div className="card p-3 sticky-top" style={{ top: "90px" }}>
            <h6 className="fw-bold mb-3">Filters</h6>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Price: ₹0 – ₹{PriceRange}
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
            </div>

            <div>
              <h6 className="fw-semibold mb-2">Categories</h6>
              {Categories.map((cat) => (
                <div className="form-check" key={cat}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={cat}
                    checked={SelectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  <label className="form-check-label" htmlFor={cat}>
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="col-lg-9">
          <div className="row g-4">
            {FilteredData.length === 0 && (
              <p className="text-muted text-center">
                No products match your filters.
              </p>
            )}

            {FilteredData.map((product) => (
              <div className="col-sm-6 col-md-4" key={product.id}>
                <div className="card h-100">
                  <img
                    src={`http://localhost:3001/uploads/${product.image}`}
                    alt={product.product_name}
                    className="card-img-top p-3"
                    style={{
                      height: "200px",
                      objectFit: "contain",
                      background: "#f8f9fa",
                    }}
                  />

                  <div className="card-body d-flex flex-column">
                    <span className="badge bg-light text-primary mb-2">
                      {product.category_name}
                    </span>

                    <h6 className="fw-semibold text-truncate">
                      {product.product_name}
                    </h6>

                    <p className="fw-bold text-primary mb-2">
                      ₹{product.price}
                    </p>

                    <p className="text-muted small text-truncate">
                      {product.description}
                    </p>

                    <button
                      className="btn btn-outline-primary btn-sm mt-auto"
                      onClick={() => addToCart(product.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserHome;
