import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MessageDialog from "../shared/MessageDialog";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ProductImageOrName = ({ image, name, className, fallbackClassName }) => {
  const [showName, setShowName] = useState(!(image && String(image).trim()));

  if (showName) {
    return <div className={fallbackClassName}>{name}</div>;
  }

  return (
    <img
      src={`${API_BASE_URL}/uploads/${image}`}
      alt={name}
      className={className}
      onError={() => setShowName(true)}
    />
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user_id = localStorage.getItem("userID");

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [dialog, setDialog] = useState({ show: false, title: "", message: "" });

  const getDiscountPercent = (price) => {
    const numeric = Number(price || 0);
    if (!numeric) return 0;
    const original = numeric * 1.18;
    return Math.round(((original - numeric) / original) * 100);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/getproduct`)
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
        `${API_BASE_URL}/api/getcartitems/${user_id}`
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
      const res = await fetch(`${API_BASE_URL}/api/addtocart/${item.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id }),
      });

      if (res.ok) {
        window.dispatchEvent(new Event("cart-update"));
      } else {
        setDialog({ show: true, title: "Add to Cart Failed", message: "Could not add this item to cart." });
      }
    } catch (err) {
      setDialog({ show: true, title: "Add to Cart Failed", message: "Error adding item to cart." });
    }
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: "1140px" }}>
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
        <p className="text-muted mb-4">{error || "We couldn't find that product."}</p>
        <button className="btn btn-outline-primary" onClick={() => navigate("/userhome")}>
          Back to products
        </button>
      </section>
    );
  }

  const price = Number(product.price || 0);
  const mrp = price * 1.18;
  const discount = getDiscountPercent(price);
  const etaMinDaysRaw = Number(product.delivery_days_min);
  const etaMaxDaysRaw = Number(product.delivery_days_max);
  const etaMinDays =
    Number.isFinite(etaMinDaysRaw) && etaMinDaysRaw >= 0 ? etaMinDaysRaw : 4;
  const etaMaxDays =
    Number.isFinite(etaMaxDaysRaw) && etaMaxDaysRaw >= etaMinDays
      ? etaMaxDaysRaw
      : Math.max(etaMinDays, 6);
  const etaStart = new Date();
  etaStart.setDate(etaStart.getDate() + etaMinDays);
  const etaEnd = new Date();
  etaEnd.setDate(etaEnd.getDate() + etaMaxDays);
  const etaText = `${etaStart.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${etaEnd.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "1140px" }}>
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
          Back
        </button>

        <div className="detail-shell-v2">
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-6">
              <div className="detail-media-v2 h-100">
                {discount > 0 && <span className="deal-badge">Save {discount}%</span>}
                <ProductImageOrName
                  image={product.image}
                  name={product.product_name}
                  fallbackClassName="detail-image-fallback-v2"
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="detail-content-v2 h-100">
                <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                  <span className="product-category-pill badge bg-primary-subtle text-primary">
                    {product.category_name}
                  </span>
                  <span className="rating-chip">4.3 ★</span>
                  <span className="chip">Free delivery</span>
                </div>

                <h2 className="detail-title-v2 mb-2">{product.product_name}</h2>

                <div className="price-row-v2 mb-1">
                  <span className="price">₹{price.toFixed(2)}</span>
                  <span className="mrp">₹{mrp.toFixed(2)}</span>
                </div>
                <div className="text-success small fw-semibold mb-3">
                  You save ₹{(mrp - price).toFixed(2)} on this deal
                </div>

                <p className="text-muted mb-4">
                  {product.description || "No description available."}
                </p>

                <div className="detail-meta-grid mb-4">
                  <div className="detail-meta-item">
                    <span className="label">Unit</span>
                    <span className="value">{product.uom || "N/A"}</span>
                  </div>
                  <div className="detail-meta-item">
                    <span className="label">Stock</span>
                    <span className="value">{product.stock ?? "N/A"}</span>
                  </div>
                  <div className="detail-meta-item">
                    <span className="label">Quantity</span>
                    <span className="value">{product.qty ?? "N/A"}</span>
                  </div>
                  <div className="detail-meta-item">
                    <span className="label">Delivery ETA</span>
                    <span className="value">{etaText}</span>
                  </div>
                </div>

                <div className="detail-actions-v2">
                  {inCart ? (
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/usercart")}
                    >
                      In Cart
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                  )}
                  <button className="btn btn-outline-primary" onClick={() => navigate("/usercart")}>
                    Go to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-3">
          <div className="col-lg-8">
            <div className="card p-4 h-100">
              <h5 className="fw-bold mb-2">Product Details</h5>
              <p className="text-muted mb-0">
                {product.description || "No additional details available."}
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card p-4 h-100">
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
            <div className="row g-4 product-grid-v2">
              {related.map((item) => (
                <div className="col-sm-6 col-md-3" key={item.id}>
                  <div className="product-card-v2 h-100">
                    <ProductImageOrName
                      image={item.image}
                      name={item.product_name}
                      className="product-card-img-v2"
                      fallbackClassName="product-card-fallback-v2"
                    />
                    <div className="product-card-body-v2 d-flex flex-column">
                      <h6 className="fw-semibold text-truncate product-title-v2">
                        {item.product_name}
                      </h6>
                      <div className="price-row-v2 mb-3">
                        <span className="price">₹{Number(item.price).toFixed(2)}</span>
                      </div>
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
      <MessageDialog
        show={dialog.show}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog({ show: false, title: "", message: "" })}
      />
    </section>
  );
};

export default ProductDetail;
