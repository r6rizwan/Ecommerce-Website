import React from "react";

const AboutUsPage = () => {
  return (
    <section className="section about-page-v2">
      <div className="container" style={{ maxWidth: "1140px" }}>
        <div className="about-hero-v2 mb-4">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <span className="chip mb-2 d-inline-block">About ShopSphere</span>
              <h1 className="section-title mb-2">Smarter shopping, faster delivery</h1>
              <p className="section-subtitle mb-0">
                We are building a reliable ecommerce experience with curated products,
                secure checkout, and responsive support.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="about-stats-v2">
                <div className="about-stat-v2">
                  <h5>10K+</h5>
                  <p>Orders fulfilled</p>
                </div>
                <div className="about-stat-v2">
                  <h5>4.7 / 5</h5>
                  <p>Avg customer rating</p>
                </div>
                <div className="about-stat-v2">
                  <h5>24x7</h5>
                  <p>Customer support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="card p-4 h-100">
              <h4 className="fw-bold mb-3">What we focus on</h4>
              <p className="text-secondary mb-3">
                ShopSphere is designed for simple product discovery, transparent
                pricing, and a smooth checkout flow. We keep improving speed, trust,
                and usability across all screens.
              </p>
              <div className="about-pill-row">
                <span className="chip">Quality products</span>
                <span className="chip">Fast delivery</span>
                <span className="chip">Secure payments</span>
                <span className="chip">Easy returns</span>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card p-4 h-100">
              <h5 className="fw-bold mb-3">Why customers choose us</h5>
              <ul className="about-list-v2 mb-0">
                <li>Wide range across categories</li>
                <li>Clear pricing and order tracking</li>
                <li>Reliable post-purchase support</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card p-4 p-lg-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <h4 className="fw-bold mb-2">Contact us</h4>
              <p className="text-secondary mb-0">
                Need help with orders, returns, or account issues? Reach out and
                we will get back quickly.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="about-contact-grid-v2">
                <a className="contact-card-v2" href="mailto:support@shopsphere-demo.com">
                  <span className="contact-label">Email</span>
                  <span className="contact-value">support@shopsphere-demo.com</span>
                </a>
                <a className="contact-card-v2" href="tel:+919000112233">
                  <span className="contact-label">Phone</span>
                  <span className="contact-value">+91-90001-12233</span>
                </a>
                <div className="contact-card-v2">
                  <span className="contact-label">Address</span>
                  <span className="contact-value">221 Market Street, Pune, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsPage;
