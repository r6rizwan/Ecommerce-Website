import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ emailOrUsername: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("Login Attempt:", formData);

      const response = await axios.post("http://localhost:3001/api/authlogin", {
        username: formData.emailOrUsername,
        password: formData.password,
      });

      console.log("Server Response:", response.data);

      if (response.status === 200 && response.data.success) {
        // Save user info to localStorage
        localStorage.setItem("user", response.data.username);
        localStorage.setItem("utype", response.data.utype);

        // Redirect based on user type
        if (response.data.utype === "admin") {
          navigate("/adminhome");
        } else {
          navigate("/userhome");
        }
      } else {
        alert(response.data.message || "Invalid credentials. Please try again.");
        setFormData({ ...formData, password: "" }); // clear password field
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again later.");
      setFormData({ ...formData, password: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center py-5 bg-light">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-4 text-primary fw-bold">Login</h3>

        <form onSubmit={handleSubmit}>
          {/* Username or Email */}
          <div className="mb-3">
            <label htmlFor="emailOrUsername" className="form-label">
              Username or Email
            </label>
            <input
              type="text"
              className="form-control"
              id="emailOrUsername"
              name="emailOrUsername"
              placeholder="Enter your username or email"
              required
              value={formData.emailOrUsername}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Don’t have an account?{" "}
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Sign Up
            </span>
          </small>
        </div>
      </div>
    </div>
  );
};

export default NewLogin;
