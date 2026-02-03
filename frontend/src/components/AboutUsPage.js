import React from "react";

const AboutUsPage = () => {
    return (
        <section className="section">
            <div className="container">
                {/* Page Title */}
                <div className="text-center mb-5">
                    <h1 className="section-title">About & Contact</h1>
                    <p className="section-subtitle mx-auto">
                        Learn more about us and get in touch
                    </p>
                </div>

                {/* About Us */}
                <section className="mb-5">
                    <h3 className="fw-bold mb-3">About Us</h3>
                    <p className="text-secondary">
                        Welcome to our e-commerce platform! We are committed to providing
                        high-quality products at competitive prices while ensuring a smooth
                        and reliable shopping experience.
                    </p>
                    <p className="text-secondary">
                        Our team carefully curates products across multiple categories,
                        focusing on quality, value, and customer satisfaction. Whether you're
                        shopping for essentials or something special, we aim to serve you
                        better every day.
                    </p>
                </section>
                <hr />

                {/* Contact Us */}
                <section className="mt-5">
                    <h3 className="fw-bold mb-3">Contact Us</h3>
                    <p className="text-secondary">
                        Have questions or need support? We'd love to hear from you.
                    </p>

                    <div className="mt-4">
                        <p>
                            <strong>Email:</strong>{" "}
                            <a href="mailto:rizwan@gmail.com">rizwan@gmail.com</a>
                        </p>
                        <p>
                            <strong>Phone:</strong> +91-9988765670
                        </p>
                        <p>
                            <strong>Address:</strong> Hubli, Karnataka, India.
                        </p>
                    </div>
                </section>
            </div>
        </section>
    );
};

export default AboutUsPage;
