import React from "react";

const categories = [
  { label: "Mobiles", icon: "📱" },
  { label: "Laptops", icon: "💻" },
  { label: "Audio", icon: "🎧" },
  { label: "Fashion", icon: "👕" },
  { label: "Home", icon: "🛋️" },
  { label: "Appliances", icon: "🧺" },
];

const bestSellers = [
  { name: "UltraPhone X", price: "₹44,999", tag: "Top Rated", meta: "128GB · 5G" },
  { name: "ProBook Air", price: "₹61,990", tag: "Best Value", meta: "16GB RAM · SSD" },
  { name: "SmartTV 50", price: "₹34,499", tag: "Trending", meta: "4K UHD · 50 inch" },
  { name: "NoiseBuds Pro", price: "₹2,999", tag: "Fast Selling", meta: "ANC · 30h battery" },
];

const Home = () => {
  return (
    <section className="section ss-home">
      <div className="container ss-container">
        <div className="ss-hero">
          <div className="ss-hero-left">
            <span className="ss-chip ss-chip-accent">ShopSphere</span>
            <h1 className="ss-hero-title">Smart Shopping, Better Deals, Faster Checkout</h1>
            <p className="ss-hero-subtitle">
              Discover trending products, compare top picks, and place orders in seconds with a clean and reliable shopping flow.
            </p>
            <div className="ss-hero-actions">
              <a href="/userhome" className="ss-btn ss-btn-primary">
                Start Shopping
              </a>
              <a href="/register" className="ss-btn ss-btn-ghost">
                Create Account
              </a>
            </div>
          </div>

          <div className="ss-hero-right">
            <div className="ss-hero-stat">
              <p className="ss-hero-stat-label">Daily Orders</p>
              <p className="ss-hero-stat-value">1,250+</p>
            </div>
            <div className="ss-hero-stat">
              <p className="ss-hero-stat-label">Happy Customers</p>
              <p className="ss-hero-stat-value">50,000+</p>
            </div>
          </div>
        </div>

        <div className="ss-trust-grid">
          <div className="ss-card ss-trust-card">
            <span className="ss-trust-icon">🔒</span>
            <p className="ss-trust-title">Secure Payments</p>
            <p className="ss-trust-subtitle">Trusted and encrypted checkout.</p>
          </div>
          <div className="ss-card ss-trust-card">
            <span className="ss-trust-icon">🚚</span>
            <p className="ss-trust-title">Fast Delivery</p>
            <p className="ss-trust-subtitle">Quick dispatch and live tracking.</p>
          </div>
          <div className="ss-card ss-trust-card">
            <span className="ss-trust-icon">↩️</span>
            <p className="ss-trust-title">Easy Returns</p>
            <p className="ss-trust-subtitle">Hassle-free replacement process.</p>
          </div>
        </div>

        <div className="ss-section">
          <div className="ss-section-head">
            <h3 className="ss-section-title">Featured Categories</h3>
            <a className="ss-section-link" href="/userhome">
              View all →
            </a>
          </div>
          <div className="ss-category-grid">
            {categories.map((cat) => (
              <a key={cat.label} href="/userhome" className="ss-card ss-category-card">
                <span className="ss-category-emoji">{cat.icon}</span>
                <span className="ss-category-label">{cat.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="ss-section">
          <div className="ss-section-head">
            <h3 className="ss-section-title">Best Sellers</h3>
            <a className="ss-section-link" href="/userhome">
              Browse products →
            </a>
          </div>
          <div className="ss-product-grid">
            {bestSellers.map((item) => (
              <a key={item.name} href="/userhome" className="ss-card ss-product-card">
                <div className="ss-product-media" />
                <div className="ss-product-content">
                  <div className="ss-product-head">
                    <span className="ss-chip ss-chip-soft">{item.tag}</span>
                  </div>
                  <h6 className="ss-product-name">{item.name}</h6>
                  <p className="ss-product-meta">{item.meta}</p>
                  <div className="ss-product-foot">
                    <span className="ss-price">{item.price}</span>
                    <span className="ss-stock-pill">In stock</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Home;
