import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto footer-v3">
      <div className="container-xl py-4">
        <div className="text-center">
          <small className="text-muted">
            © {new Date().getFullYear()} ShopSphere. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
