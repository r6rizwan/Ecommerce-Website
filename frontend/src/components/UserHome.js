import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const UserHome = () => {
  const [ProductData, setProductData] = useState([]);
  const [FilteredData, setFilteredData] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [SelectedCategories, setSelectedCategories] = useState([]);
  const [PriceRange, setPriceRange] = useState(0);
  const [MaxPrice, setMaxPrice] = useState(100000);
  const [SearchTerm, setSearchTerm] = useState("");
  const [SortBy, setSortBy] = useState("relevance");
  const [Loading, setLoading] = useState(true);
  const user_id = localStorage.getItem("userID");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetch("http://localhost:3001/api/getproduct")
      .then((res) => res.json())
      .then((data) => {
        setProductData(data);
        setFilteredData(data);

        const prices = data.map((p) => Number(p.price) || 0);
        const max = prices.length ? Math.max(...prices) : 0;
        setMaxPrice(max);
        setPriceRange(max);

        const uniqueCategories = [...new Set(data.map((p) => p.category_name))];
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchTerm(q);
    } else if (SearchTerm) {
      setSearchTerm("");
    }
  }, [searchParams, SearchTerm]);

  useEffect(() => {
    let filtered = ProductData.filter(
      (p) => Number(p.price) <= PriceRange
    );

    if (SelectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        SelectedCategories.includes(p.category_name)
      );
    }

    if (SearchTerm.trim()) {
      const term = SearchTerm.trim().toLowerCase();
      filtered = filtered.filter((p) => {
        const name = (p.product_name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const cat = (p.category_name || "").toLowerCase();
        return name.includes(term) || desc.includes(term) || cat.includes(term);
      });
    }

    setFilteredData(filtered);
  }, [PriceRange, SelectedCategories, ProductData, SearchTerm]);

  const SortedData = useMemo(() => {
    const data = [...FilteredData];
    if (SortBy === "price-asc") {
      data.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (SortBy === "price-desc") {
      data.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (SortBy === "name-asc") {
      data.sort((a, b) =>
        String(a.product_name).localeCompare(String(b.product_name))
      );
    } else if (SortBy === "name-desc") {
      data.sort((a, b) =>
        String(b.product_name).localeCompare(String(a.product_name))
      );
    }
    return data;
  }, [FilteredData, SortBy]);

  const addToCart = async (product) => {
    if (!user_id) {
      const existing = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const idx = existing.findIndex((i) => String(i.id) === String(product.id));
      if (idx >= 0) {
        existing[idx].qty += 1;
        existing[idx].total = existing[idx].qty * Number(existing[idx].price || 0);
      } else {
        existing.push({
          id: product.id,
          product_name: product.product_name,
          image: product.image,
          price: Number(product.price || 0),
          qty: 1,
          total: Number(product.price || 0),
        });
      }
      localStorage.setItem("guestCart", JSON.stringify(existing));
      window.dispatchEvent(new Event("cart-update"));
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/addtocart/${product.id}`,
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceRange(MaxPrice);
    setSortBy("relevance");
  };

  const formatPrice = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const appliedFilterCount =
    (SearchTerm.trim() ? 1 : 0) +
    (SelectedCategories.length > 0 ? SelectedCategories.length : 0) +
    (PriceRange < MaxPrice ? 1 : 0);

  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="section-title">All Products</h2>
          <p className="section-subtitle mx-auto">
            Compare prices, filter by category, and find the best deals fast.
          </p>
        </div>

      <div className="row">
        {/* Filters */}
        <div className="col-lg-3 mb-4 d-none d-lg-block">
          <div className="card p-3 sticky-top filter-card" style={{ top: "90px" }}>
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
                    id={`cat-${cat}`}
                    checked={SelectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  <label className="form-check-label" htmlFor={`cat-${cat}`}>
                    {cat}
                  </label>
                </div>
              ))}
            </div>

            <button
              className="btn btn-outline-secondary btn-sm mt-3 w-100"
              onClick={handleClearFilters}
              disabled={appliedFilterCount === 0}
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Products */}
        <div className="col-lg-9">
          <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between mb-3 toolbar">
            <div className="flex-grow-1">
              <input
                type="search"
                className="form-control"
                placeholder="Search products, categories, or descriptions..."
                value={SearchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="d-flex gap-2 align-items-center">
              <button
                className="btn btn-outline-secondary d-lg-none"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#mobileFilters"
                aria-controls="mobileFilters"
              >
                Filters
                {appliedFilterCount > 0 && (
                  <span className="badge bg-primary ms-2">
                    {appliedFilterCount}
                  </span>
                )}
              </button>
              <span className="text-muted small">
                {SortedData.length} results
              </span>
              <select
                className="form-select"
                style={{ minWidth: "170px" }}
                value={SortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {appliedFilterCount > 0 && (
            <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
              {SearchTerm.trim() && (
                <button
                  className="chip"
                  onClick={() => setSearchTerm("")}
                >
                  Search: "{SearchTerm.trim()}" ×
                </button>
              )}
              {PriceRange < MaxPrice && (
                <button
                  className="chip"
                  onClick={() => setPriceRange(MaxPrice)}
                >
                  Price up to {formatPrice(PriceRange)} ×
                </button>
              )}
              {SelectedCategories.map((cat) => (
                <button
                  key={cat}
                  className="chip"
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat} ×
                </button>
              ))}
            </div>
          )}

          {Categories.length > 0 && (
            <div className="category-strip mb-3">
              {Categories.map((cat) => (
                <button
                  key={`strip-${cat}`}
                  className="chip"
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="row g-3">
            {Loading && (
              <>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div className="col-sm-6 col-md-4" key={`sk-${idx}`}>
                    <div className="card h-100">
                      <div className="skeleton-img" />
                      <div className="card-body">
                        <div className="skeleton-line w-40 mb-2" />
                        <div className="skeleton-line w-80 mb-2" />
                        <div className="skeleton-line w-50 mb-3" />
                        <div className="skeleton-line w-100 mb-1" />
                        <div className="skeleton-line w-90" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {!Loading && SortedData.length === 0 && (
              <div className="text-center py-5">
                <h5 className="fw-bold mb-2">No products found</h5>
                <p className="text-muted mb-3">
                  Try adjusting your filters or search term.
                </p>
                <button
                  className="btn btn-outline-primary"
                  onClick={handleClearFilters}
                >
                  Clear filters
                </button>
              </div>
            )}

            {!Loading &&
              SortedData.map((product) => (
              <div className="col-sm-6 col-md-4 col-xl-3" key={product.id}>
                <div className="product-card">
                  <img
                    src={`http://localhost:3001/uploads/${product.image}`}
                    alt={product.product_name}
                    className="card-img-top product-card-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/default-product.png";
                    }}
                  />

                  <div className="product-card-body d-flex flex-column">
                    <span className="badge bg-light text-primary mb-2">
                      {product.category_name}
                    </span>

                    <h6 className="fw-semibold text-truncate mb-1">
                      {product.product_name}
                    </h6>

                    <div className="price-row mb-2">
                      <span className="price">{formatPrice(product.price)}</span>
                      <span className="delivery-chip">Fast delivery</span>
                    </div>

                    <p className="text-muted small text-truncate">
                      {product.description}
                    </p>

                    <div className="d-flex gap-2 mt-auto">
                      <button
                        className="btn btn-outline-primary btn-sm flex-grow-1"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        View Details
                      </button>
                      <button
                        className="btn btn-primary btn-sm flex-grow-1"
                      onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Filters Offcanvas */}
      <div
        className="offcanvas offcanvas-bottom h-75"
        tabIndex="-1"
        id="mobileFilters"
        aria-labelledby="mobileFiltersLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="mobileFiltersLabel">
            Filters
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
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
              <div className="form-check" key={`m-${cat}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`m-cat-${cat}`}
                  checked={SelectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                <label className="form-check-label" htmlFor={`m-cat-${cat}`}>
                  {cat}
                </label>
              </div>
            ))}
          </div>

          <div className="d-flex gap-2 mt-4">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={handleClearFilters}
              disabled={appliedFilterCount === 0}
            >
              Clear filters
            </button>
            <button
              className="btn btn-primary w-100"
              data-bs-dismiss="offcanvas"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default UserHome;
