import React from "react";

const ContactUsPage = () => {
  return (
    <section className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 text-center">

          <h1 className="fw-bold mb-3">Contact Us</h1>
          <p className="text-muted mb-4">
            We’re here to help. Reach out to us anytime.
          </p>

          <div className="card p-4">
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
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactUsPage;
