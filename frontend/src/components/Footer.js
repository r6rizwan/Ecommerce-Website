import React from "react";

const Footer = () => {
  return (
    <footer className="border-top bg-white mt-auto">
      <div className="container-xl py-3 text-center">
        <small className="text-muted">
          © {new Date().getFullYear()} ShopSphere. All rights reserved.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
