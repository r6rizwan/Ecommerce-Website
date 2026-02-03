import React from "react";

const Home = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="hero mb-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge-soft mb-3 d-inline-block">Top Deals</span>
              <h1 className="hero-title mb-3">
                Shop faster with curated deals and trusted essentials
              </h1>
              <p className="hero-subtitle mb-4">
                Find electronics, home, fashion, and daily needs in one place.
                Secure checkout and quick delivery.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <a href="/userhome" className="btn btn-primary px-4">
                  Explore Deals
                </a>
                <a href="/register" className="btn btn-outline-primary px-4">
                  Create Account
                </a>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card p-4">
                <h6 className="fw-bold mb-2">Free Delivery</h6>
                <p className="text-muted mb-3">Orders above ₹999</p>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Secure Payments</span>
                  <span className="fw-semibold">Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="section-title">Shop by Category</h3>
          <div className="market-rail">
            {["Mobiles", "Laptops", "Home", "Fashion", "Beauty", "Grocery", "Appliances", "Toys"].map(
              (cat) => (
                <div className="category-tile" key={cat}>
                  <div className="fw-semibold">{cat}</div>
                  <small className="text-muted">Explore</small>
                </div>
              )
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 className="section-title mb-0">Deals of the Day</h3>
            <a className="text-primary fw-semibold" href="/userhome">View all</a>
          </div>
          <div className="market-rail">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div className="deal-card" key={i}>
                <div className="badge-soft mb-2">Limited time</div>
                <div className="fw-semibold mb-1">Top pick #{i}</div>
                <div className="text-muted small mb-2">Best value today</div>
                <div className="deal-price">Up to 40% off</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
