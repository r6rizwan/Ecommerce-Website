import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setAdminToken } from './superAdmin/superAdminAuth';

const NewLogin = () => {
  const navigate = useNavigate();
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

        window.dispatchEvent(new Event("app-storage"));
        navigate(response.data.utype === "admin" ? "/adminhome" : "/userhome");
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
    <section className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-4">

          <div className="card p-4">
            <h3 className="fw-bold text-center mb-1">Welcome Back</h3>
            <p className="text-muted text-center mb-4">
              Login to continue shopping
            </p>

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
    </section>
  );
};

export default NewLogin;
