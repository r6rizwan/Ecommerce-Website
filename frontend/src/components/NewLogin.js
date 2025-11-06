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
    setLoading(true);

    try {
      console.log("Login Attempt:", formData);

      const response = await axios.post("http://localhost:3001/api/authlogin", {
        username: formData.emailOrUsername,
        password: formData.password,
      });

      console.log("Server Response:", response.data);

      if (response.status === 200 && response.data.success) {
        // ✅ Store consistent keys
        localStorage.setItem("userName", response.data.username);
        localStorage.setItem("utype", response.data.utype);
        localStorage.setItem("userID", response.data.user_id);
        localStorage.setItem("isLoggedIn", "true");

        // ✅ Notify app of login
        window.dispatchEvent(new Event("app-storage"));

        // ✅ Navigate to correct home page
        navigate(response.data.utype === "admin" ? "/adminhome" : "/userhome");
      } else {
        alert(response.data.message || "Invalid credentials. Please try again.");
        setFormData((prev) => ({ ...prev, password: "" }));
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again later.");
      setFormData((prev) => ({ ...prev, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center py-5 bg-light">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-4 text-primary fw-bold">Login</h3>

        <form onSubmit={handleSubmit}>
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
            Don't have an account?{" "}
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Sign Up
            </span>
          </small>
        </div>

        <div className="text-center mt-3">
          <small>
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot Password?
            </span>
          </small>
        </div>
      </div>
    </div>
  );
};

export default NewLogin;
