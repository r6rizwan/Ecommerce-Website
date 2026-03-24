import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MessageDialog from "../shared/MessageDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const RegistrationPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    city: "",
    address: "",
    pincode: "",
    email: "",
    password: "",
  });
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
      const response = await axios.post(
        `${API_BASE_URL}/api/register`,
        formData
      );

      if (response.status === 200 && response.data.success) {
        navigate("/login");
      } else {
        setErrorMsg(response.data.message || "Registration failed.");
      }
    } catch (error) {
      setErrorMsg("Registration error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section auth-page-v2">
      <div className="container" style={{ maxWidth: "980px" }}>
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">

          <div className="card p-4 auth-card-v2">
            <div className="mb-3">
              <span className="chip">New Account</span>
              <h3 className="fw-bold mt-2 mb-1">Create Account</h3>
              <p className="text-muted mb-0">
                Join ShopSphere for faster checkout and order tracking.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Enter full name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  placeholder="City"
                  required
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  placeholder="Address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-control"
                  name="pincode"
                  placeholder="6-digit pincode"
                  pattern="[0-9]{6}"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Email address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    name="password"
                    placeholder="Minimum 6 characters"
                    minLength="6"
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
                disabled={loading}
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>

            <div className="text-center mt-3">
              <small className="text-muted">
                Already have an account?{" "}
                <span
                  className="text-primary fw-semibold"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </small>
            </div>
          </div>

          </div>
        </div>
      </div>
      <MessageDialog
        show={!!errorMsg}
        title="Registration Failed"
        message={errorMsg}
        onClose={() => setErrorMsg("")}
      />
    </section>
  );
};

export default RegistrationPage;
