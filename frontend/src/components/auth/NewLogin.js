import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { setAdminToken } from '../superAdmin/superAdminAuth';
import MessageDialog from "../shared/MessageDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const NewLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ emailOrUsername: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await axios.post(`${API_BASE_URL}/api/authlogin`, {
        username: formData.emailOrUsername,
        password: formData.password,
      });

      if (response.data.success && response.data.utype === "admin") {
        setAdminToken(response.data.token);
      }

      if (response.status === 200 && response.data.success) {
        localStorage.setItem("userName", response.data.username);
        localStorage.setItem("utype", response.data.utype);
        localStorage.setItem("userID", response.data.user_id);
        localStorage.setItem("isLoggedIn", "true");

        const redirect = searchParams.get("redirect");

        if (response.data.utype === "user") {
          const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
          if (guestCart.length > 0) {
            for (const item of guestCart) {
              const qty = Number(item.qty || 1);
              for (let i = 0; i < qty; i += 1) {
                await axios.post(
                  `${API_BASE_URL}/api/addtocart/${item.id}`,
                  { user_id: response.data.user_id },
                  { headers: { "Content-Type": "application/json" } }
                );
              }
            }
            localStorage.removeItem("guestCart");
          }
        }

        window.dispatchEvent(new Event("app-storage"));
        window.dispatchEvent(new Event("cart-update"));

        if (redirect) {
          navigate(redirect);
        } else {
          navigate(response.data.utype === "admin" ? "/adminhome" : "/userhome");
        }
      } else {
        setErrorMsg(response.data.message || "Invalid credentials");
        setFormData((p) => ({ ...p, password: "" }));
      }
    } catch (error) {
      setErrorMsg("Login failed. Please try again.");
      setFormData((p) => ({ ...p, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section auth-page-v2">
      <div className="container" style={{ maxWidth: "980px" }}>
        <div className="row justify-content-center align-items-stretch g-4">
          <div className="col-lg-5 d-none d-lg-block">
            <div className="auth-side-v2 h-100">
              <span className="chip">Account Access</span>
              <h2 className="section-title mt-2 mb-2">Welcome Back</h2>
              <p className="section-subtitle mb-4">
                Log in to continue shopping, track orders, and manage payments.
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <span className="chip">Fast checkout</span>
                <span className="chip">Order tracking</span>
                <span className="chip">Secure login</span>
              </div>
            </div>
          </div>

          <div className="col-lg-5 col-md-7">
          <div className="card p-4 auth-card-v2">
            <h4 className="fw-bold mb-2">Login</h4>
            <p className="text-muted mb-3">Use your email or username to continue.</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username or Email</label>
                <input
                  type="text"
                  className="form-control"
                  name="emailOrUsername"
                  placeholder="Enter username or email"
                  required
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    name="password"
                    placeholder="Enter password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading || !formData.emailOrUsername || !formData.password}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="text-center mt-3">
              <small className="text-muted">
                Forgot password?{" "}
                <span
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/forgotpassword")}
                >
                  Reset
                </span>
              </small>
            </div>

            <div className="text-center mt-2">
              <small className="text-muted">
                Don’t have an account?{" "}
                <span
                  className="text-primary fw-semibold"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </span>
              </small>
            </div>
          </div>
          </div>
        </div>
      </div>
      <MessageDialog
        show={!!errorMsg}
        title="Login Failed"
        message={errorMsg}
        onClose={() => setErrorMsg("")}
      />
    </section>
  );
};

export default NewLogin;
