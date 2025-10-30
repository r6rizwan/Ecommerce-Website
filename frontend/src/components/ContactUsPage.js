import React from 'react';

const ContactUsPage = () => {
  return (
    <div className="container my-5">
      <div className="text-center">
        <h1 className="mb-4">Contact Us</h1>
        <p>If you have any questions or need assistance, please reach out to us!</p>
        <p>
          Email:{" "}
          <a href="mailto:rizwan@gmail.com">
            rizwan@gmail.com
          </a>
        </p>
        <p>Phone: +91-9988765670</p>
        <p>Address: Keshwapur, Hubli, Karnataka</p>
      </div>
    </div>
  );
};

export default ContactUsPage;
