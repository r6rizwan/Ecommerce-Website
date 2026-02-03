import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user_id = localStorage.getItem("userID");

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/getproduct")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const item = list.find((p) => String(p.id) === String(id));
        setProduct(item || null);
        if (item) {
          const rel = list
            .filter(
              (p) =>
                p.category_name === item.category_name &&
                String(p.id) !== String(item.id)
            )
            .slice(0, 4);
          setRelated(rel);
        }
      })
      .catch(() => setError("Could not load product details."))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async (pid) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/addtocart/${pid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id }),
        }
      );

      if (res.ok) {
        window.dispatchEvent(new Event("cart-update"));
      } else {
        alert("Could not add to cart");
      }
    } catch (err) {
      alert("Error adding item to cart");
    }
  };

  if (loading) {
    return (
      <section className="py-5">
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div className="card p-4">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="skeleton-img" />
              </div>
              <div className="col-lg-6">
                <div className="skeleton-line w-80 mb-3" />
                <div className="skeleton-line w-40 mb-3" />
                <div className="skeleton-line w-100 mb-2" />
                <div className="skeleton-line w-90 mb-2" />
                <div className="skeleton-line w-80 mb-4" />
                <div className="skeleton-line w-50" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="py-5 text-center">
        <h4 className="fw-bold mb-2">Product not found</h4>
          <p className="text-muted mb-4">
            {error || "We couldn't find that product."}
          </p>
        <button className="btn btn-outline-primary" onClick={() => navigate("/userhome")}>
          Back to products
        </button>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: "1100px" }}>
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
          Back
        </button>

        <div className="card p-4">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div className="product-gallery">
                <img
                  src={`http://localhost:3001/uploads/${product.image}`}
                  alt={product.product_name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/default-product.png";
                  }}
                />
              </div>
            </div>

            <div className="col-lg-6">
              <span className="badge bg-light text-primary mb-2">
                {product.category_name}
              </span>
              <h2 className="fw-bold mb-2">{product.product_name}</h2>
              <div className="product-price mb-3">₹{Number(product.price).toFixed(2)}</div>

              <p className="text-muted mb-4">
                {product.description || "No description available."}
              </p>

              <div className="d-flex gap-2 flex-wrap mb-4">
                <button
                  className="btn btn-primary px-4"
                  onClick={() => addToCart(product.id)}
                >
                  Add to Cart
                </button>
                <button
                  className="btn btn-outline-primary px-4"
                  onClick={() => navigate("/usercart")}
                >
                  Go to Cart
                </button>
              </div>

              <div className="product-meta">
                <div className="meta-item">
                  <span className="label">Unit</span>
                  <span className="value">{product.uom || "N/A"}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Stock</span>
                  <span className="value">{product.stock ?? "N/A"}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Quantity</span>
                  <span className="value">{product.qty ?? "N/A"}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Delivery</span>
                  <span className="value">2-4 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-3">
          <div className="col-lg-8">
            <div className="card p-4">
              <h5 className="fw-bold mb-2">Product Details</h5>
              <p className="text-muted mb-0">
                {product.description || "No additional details available."}
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card p-4">
              <h5 className="fw-bold mb-2">Why ShopSphere</h5>
              <ul className="product-specs">
                <li>Secure checkout</li>
                <li>Quality-checked products</li>
                <li>Easy returns</li>
                <li>Fast delivery</li>
              </ul>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-4">
            <h5 className="fw-bold mb-3">You may also like</h5>
            <div className="row g-4">
              {related.map((item) => (
                <div className="col-sm-6 col-md-3" key={item.id}>
                  <div className="card h-100">
                    <img
                      src={`http://localhost:3001/uploads/${item.image}`}
                      alt={item.product_name}
                      className="card-img-top product-card-img-sm"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/default-product.png";
                      }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h6 className="fw-semibold text-truncate">
                        {item.product_name}
                      </h6>
                      <p className="fw-bold text-primary mb-3">
                        ₹{Number(item.price).toFixed(2)}
                      </p>
                      <button
                        className="btn btn-outline-primary btn-sm mt-auto"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetail;
