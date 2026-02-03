import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { setAdminToken } from './superAdmin/superAdminAuth';

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
      const response = await axios.post("http://localhost:3001/api/authlogin", {
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
                  `http://localhost:3001/api/addtocart/${item.id}`,
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
    <section className="section">
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="section-title">Welcome Back</h2>
          <p className="section-subtitle mx-auto">
            Log in to continue shopping and track your orders.
          </p>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-4">

          <div className="card p-4">
            {errorMsg && (
              <div className="alert alert-danger py-2" role="alert">
                {errorMsg}
              </div>
            )}

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
    </section>
  );
};

export default NewLogin;
