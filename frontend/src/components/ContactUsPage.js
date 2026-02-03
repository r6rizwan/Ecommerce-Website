import React from "react";

const ContactUsPage = () => {
  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: "900px" }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold mb-2">Contact Us</h1>
          <p className="text-muted">
            We’re here to help. Reach out to us anytime.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card p-4 h-100">
              <h5 className="fw-bold mb-3">Get in touch</h5>
              <p className="mb-2">
                <strong>Email:</strong>{" "}
                <a href="mailto:rizwan@gmail.com">rizwan@gmail.com</a>
              </p>
              <p className="mb-2">
                <strong>Phone:</strong> +91-9988765670
              </p>
              <p className="mb-0">
                <strong>Address:</strong> Keshwapur, Hubli, Karnataka
              </p>
              <div className="d-flex gap-2 mt-3">
                <a className="btn btn-primary" href="mailto:rizwan@gmail.com">
                  Email Us
                </a>
                <a className="btn btn-outline-primary" href="tel:+919988765670">
                  Call Us
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-4 h-100">
              <h5 className="fw-bold mb-3">Support hours</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Mon–Fri</span>
                <span>9:00 AM – 7:00 PM</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Saturday</span>
                <span>10:00 AM – 5:00 PM</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Sunday</span>
                <span>Closed</span>
              </div>
              <hr />
              <p className="text-muted mb-0">
                We usually respond within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsPage;
