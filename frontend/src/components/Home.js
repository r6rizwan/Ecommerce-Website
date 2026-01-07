import React from "react";

const Home = () => {
  return (
    <section className="py-5">
      <div className="row align-items-center min-vh-75">
        <div className="col-md-8 mx-auto text-center">

          <span className="badge bg-primary-subtle text-primary mb-3">
            Welcome
          </span>

          <h1 className="display-5 fw-bold mb-3">
            A Better Way to Shop Online
          </h1>

          <p className="lead text-muted mb-4">
            Discover quality products, seamless checkout, and a smooth shopping experience —
            all in one place.
          </p>

          <div className="d-flex justify-content-center gap-3">
            <a href="/register" className="btn btn-primary px-4">
              Get Started
            </a>
            <a href="/login" className="btn btn-outline-primary px-4">
              Login
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Home;
