import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user_id = localStorage.getItem("userID");

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);

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

  const loadCart = useCallback(async () => {
    if (!user_id) {
      const guest = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCartItems(guest);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:3001/api/getcartitems/${user_id}`
      );
      setCartItems(res.data || []);
    } catch (err) {
      console.error("Error loading cart items:", err);
    }
  }, [user_id]);

  useEffect(() => {
    loadCart();
    const handleCartUpdate = () => loadCart();
    window.addEventListener("cart-update", handleCartUpdate);
    return () => window.removeEventListener("cart-update", handleCartUpdate);
  }, [loadCart]);

  const inCart = useMemo(() => {
    if (!product) return false;
    return cartItems.some((i) => String(i.pid ?? i.id) === String(product.id));
  }, [cartItems, product]);

  const addToCart = async (item) => {
    if (!user_id) {
      const existing = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const idx = existing.findIndex((i) => String(i.id) === String(item.id));
      if (idx >= 0) {
        existing[idx].qty += 1;
        existing[idx].total = existing[idx].qty * Number(existing[idx].price || 0);
      } else {
        existing.push({
          id: item.id,
          product_name: item.product_name,
          image: item.image,
          price: Number(item.price || 0),
          qty: 1,
          total: Number(item.price || 0),
        });
      }
      localStorage.setItem("guestCart", JSON.stringify(existing));
      window.dispatchEvent(new Event("cart-update"));
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/addtocart/${item.id}`,
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
      <section className="section">
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

        <div className="card p-4 product-detail-card">
          <div className="row g-4">
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

              <div className="row g-3">
                <div className="col-md-7">
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
                <div className="col-md-5">
                  <div className="buy-box">
                    <div className="price mb-2">₹{Number(product.price).toFixed(2)}</div>
                    <div className="stock mb-2">
                      {Number(product.stock) > 0 ? "In stock" : "Limited stock"}
                    </div>
                    <div className="text-muted small mb-3">
                      Free delivery on orders above ₹999
                    </div>
                    {inCart ? (
                      <button
                        className="btn btn-outline-secondary w-100 mb-2"
                        onClick={() => navigate("/usercart")}
                      >
                        In Cart
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary w-100 mb-2"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    )}
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() => navigate("/usercart")}
                    >
                      Go to Cart
                    </button>
                  </div>
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
