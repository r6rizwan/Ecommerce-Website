import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import MessageDialog from "../shared/MessageDialog";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const formatPrice = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const ProductImageOrName = ({ image, name }) => {
  const [showName, setShowName] = useState(!(image && String(image).trim()));

  if (showName) {
    return <div className="ssu-image-fallback">{name}</div>;
  }

  return (
    <img
      src={`${API_BASE_URL}/uploads/${image}`}
      alt={name}
      className="ssu-product-image"
      loading="lazy"
      onError={() => setShowName(true)}
    />
  );
};

const ProductCard = ({ product, inCart, onView, onAdd, onCart }) => {
  const discount = 8 + (Number(product.id || 0) % 18);

  return (
    <article className="ssu-product-card">
      <button className="ssu-product-media" type="button" onClick={onView} aria-label={`View ${product.product_name}`}>
        <ProductImageOrName image={product.image} name={product.product_name} />
      </button>

      <div className="ssu-product-content">
        <div className="ssu-product-row">
          <span className="ssu-chip">Save {discount}%</span>
          <span className="ssu-stock-pill">In stock</span>
        </div>

        <span className="ssu-product-category">{String(product.category_name || "").toUpperCase()}</span>
        <h3 className="ssu-product-title">{product.product_name}</h3>
        <p className="ssu-product-meta">{product.description || "High quality product"}</p>

        <div className="ssu-product-pricing">
          <strong className="ssu-price">{formatPrice(product.price)}</strong>
          <span className="ssu-mrp">{formatPrice(Number(product.price || 0) * 1.15)}</span>
        </div>

        <div className="ssu-product-actions">
          <button className="ssu-btn ssu-btn-ghost" onClick={onView}>
            View Details
          </button>

          {inCart ? (
            <button className="ssu-btn ssu-btn-primary" onClick={onCart}>
              In Cart
            </button>
          ) : (
            <button className="ssu-btn ssu-btn-primary" onClick={onAdd}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const UserHome = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [dialog, setDialog] = useState({ show: false, title: "", message: "" });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = localStorage.getItem("userID");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/getproduct`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];

        setProducts(list);
        setFilteredProducts(list);

        const prices = list.map((p) => Number(p.price) || 0);
        const derivedMaxPrice = prices.length > 0 ? Math.max(...prices) : 0;
        setMaxPrice(derivedMaxPrice);
        setPriceRange(derivedMaxPrice);

        setCategories([...new Set(list.map((p) => p.category_name).filter(Boolean))]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const loadCart = useCallback(async () => {
    if (!userId) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCartItems(guestCart);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/getcartitems/${userId}`);
      setCartItems(res.data || []);
    } catch (err) {
      console.error("Error loading cart items:", err);
    }
  }, [userId]);

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => loadCart();
    window.addEventListener("cart-update", handleCartUpdate);

    return () => window.removeEventListener("cart-update", handleCartUpdate);
  }, [loadCart]);

  useEffect(() => {
    const queryValue = searchParams.get("q") || "";
    setSearchTerm(queryValue);
  }, [searchParams]);

  useEffect(() => {
    let next = products.filter((p) => Number(p.price) <= priceRange);

    if (selectedCategories.length > 0) {
      next = next.filter((p) => selectedCategories.includes(p.category_name));
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      next = next.filter((p) => {
        const name = String(p.product_name || "").toLowerCase();
        const description = String(p.description || "").toLowerCase();
        const category = String(p.category_name || "").toLowerCase();
        return name.includes(q) || description.includes(q) || category.includes(q);
      });
    }

    setFilteredProducts(next);
  }, [products, searchTerm, selectedCategories, priceRange]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    if (sortBy === "price-asc") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => String(a.product_name).localeCompare(String(b.product_name)));
    } else if (sortBy === "name-desc") {
      list.sort((a, b) => String(b.product_name).localeCompare(String(a.product_name)));
    }

    return list;
  }, [filteredProducts, sortBy]);

  const cartProductIds = useMemo(
    () => new Set(cartItems.map((item) => String(item.pid ?? item.id))),
    [cartItems]
  );

  const addToCart = async (product) => {
    if (!userId) {
      const existingGuestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const foundIndex = existingGuestCart.findIndex((item) => String(item.id) === String(product.id));

      if (foundIndex >= 0) {
        existingGuestCart[foundIndex].qty += 1;
        existingGuestCart[foundIndex].total =
          existingGuestCart[foundIndex].qty * Number(existingGuestCart[foundIndex].price || 0);
      } else {
        existingGuestCart.push({
          id: product.id,
          product_name: product.product_name,
          image: product.image,
          price: Number(product.price || 0),
          qty: 1,
          total: Number(product.price || 0),
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(existingGuestCart));
      window.dispatchEvent(new Event("cart-update"));
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/addtocart/${product.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      if (res.ok) {
        window.dispatchEvent(new Event("cart-update"));
      } else {
        setDialog({ show: true, title: "Add to Cart Failed", message: "Could not add this item to cart." });
      }
    } catch (err) {
      setDialog({ show: true, title: "Add to Cart Failed", message: "Error adding item to cart." });
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceRange(maxPrice);
    setSortBy("relevance");
  };

  const activeFilterCount =
    (searchTerm.trim() ? 1 : 0) +
    (selectedCategories.length > 0 ? selectedCategories.length : 0) +
    (priceRange < maxPrice ? 1 : 0);

  return (
    <section className="section ssu-home">
      <div className="container ssu-container">
        <header className="ssu-hero">
          <div className="ssu-hero-row">
            <div className="ssu-hero-left">
              <span className="ssu-chip ssu-chip-accent">ShopSphere Marketplace</span>
              <h1 className="ssu-hero-title">Find Better Deals, Faster</h1>
              <p className="ssu-hero-subtitle">
                Explore trending products, compare prices instantly, and add items to cart in one click.
              </p>
            </div>
          </div>

          <div className="ssu-toolbar-card">
            <div className="ssu-toolbar-left">
              <button
                className="ssu-btn ssu-btn-ghost ssu-filter-btn"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#uhxMobileFilters"
                aria-controls="uhxMobileFilters"
              >
                Filters
                {activeFilterCount > 0 && <span className="badge bg-primary ms-2">{activeFilterCount}</span>}
              </button>

              <input
                id="uhx-search"
                type="search"
                className="form-control ssu-search-input"
                placeholder="Search by product, category, or keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select className="form-select ssu-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="relevance">Sort: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </header>

        {activeFilterCount > 0 && (
          <div className="ssu-applied-filters">
            {searchTerm.trim() && (
              <button className="ssu-pill" onClick={() => setSearchTerm("")}>Search: {searchTerm} ×</button>
            )}
            {priceRange < maxPrice && (
              <button className="ssu-pill" onClick={() => setPriceRange(maxPrice)}>
                Price: up to {formatPrice(priceRange)} ×
              </button>
            )}
            {selectedCategories.map((category) => (
              <button className="ssu-pill" key={category} onClick={() => handleCategoryChange(category)}>
                {category} ×
              </button>
            ))}
          </div>
        )}

        <div className="ssu-trust-grid">
          <div className="ssu-trust-card">
            <span className="ssu-trust-icon">🚚</span>
            <span className="ssu-trust-title">Fast Delivery</span>
            <span className="ssu-trust-subtitle">Quick dispatch</span>
          </div>
          <div className="ssu-trust-card">
            <span className="ssu-trust-icon">✅</span>
            <span className="ssu-trust-title">Quality Assured</span>
            <span className="ssu-trust-subtitle">Curated products</span>
          </div>
          <div className="ssu-trust-card">
            <span className="ssu-trust-icon">💳</span>
            <span className="ssu-trust-title">Secure Checkout</span>
            <span className="ssu-trust-subtitle">Safe payments</span>
          </div>
        </div>

        <div className="ssu-main">
          <aside className="ssu-filters">
            <div className="ssu-filter-head">
              <h2 className="ssu-filter-title">Filters</h2>
              <button className="ssu-clear-link" onClick={handleClearFilters} disabled={activeFilterCount === 0}>
                Clear
              </button>
            </div>

            <div className="ssu-filter-block">
              <label className="form-label fw-semibold">Price up to {formatPrice(priceRange)}</label>
              <input
                type="range"
                className="form-range"
                min="0"
                max={maxPrice}
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
            </div>

            <div className="ssu-filter-block">
              <h3 className="ssu-filter-subtitle">Categories</h3>
              {categories.map((category) => (
                <label className="form-check ssu-check" key={category}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span className="form-check-label">{category}</span>
                </label>
              ))}
            </div>
          </aside>

          <section className="ssu-products">
            {loading ? (
              <div className="ssu-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div className="ssu-product-card ssu-skeleton" key={`sk-${index}`}>
                    <div className="ssu-skeleton-image" />
                    <div className="ssu-skeleton-content">
                      <div className="ssu-skeleton-line short" />
                      <div className="ssu-skeleton-line" />
                      <div className="ssu-skeleton-line medium" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="ssu-empty">
                <div className="ssu-empty-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try changing search, filters, or sort to discover more products.</p>
                <button className="ssu-btn ssu-btn-ghost" onClick={handleClearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="ssu-grid">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    inCart={cartProductIds.has(String(product.id))}
                    onView={() => navigate(`/product/${product.id}`)}
                    onAdd={() => addToCart(product)}
                    onCart={() => navigate("/usercart")}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <div
        className="offcanvas offcanvas-bottom h-75"
        tabIndex="-1"
        id="uhxMobileFilters"
        aria-labelledby="uhxMobileFiltersLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="uhxMobileFiltersLabel">
            Filters
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>

        <div className="offcanvas-body">
          <div className="mb-4">
            <label className="form-label fw-semibold">Price up to {formatPrice(priceRange)}</label>
            <input
              type="range"
              className="form-range"
              min="0"
              max={maxPrice}
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
          </div>

          <div>
            <h6 className="fw-semibold mb-2">Categories</h6>
            {categories.map((category) => (
              <div className="form-check" key={`mobile-${category}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`mobile-${category}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <label className="form-check-label" htmlFor={`mobile-${category}`}>
                  {category}
                </label>
              </div>
            ))}
          </div>

          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-outline-secondary w-100" onClick={handleClearFilters}>
              Clear filters
            </button>
            <button className="btn btn-primary w-100" data-bs-dismiss="offcanvas">
              Apply
            </button>
          </div>
        </div>
      </div>
      <MessageDialog
        show={dialog.show}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog({ show: false, title: "", message: "" })}
      />
    </section>
  );
};

export default UserHome;
