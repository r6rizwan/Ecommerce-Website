import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = formData;

    // Basic validation
    if (!newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in both fields." });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    const email = localStorage.getItem("resetEmail");
    if (!email) {
      setMessage({ type: "error", text: "Session expired. Please request a new OTP." });
      navigate("/forgotpassword");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("http://localhost:3001/api/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: "Password reset successfully!" });
        localStorage.removeItem("resetEmail");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage({ type: "error", text: data.message || "Password reset failed." });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Something went wrong. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow p-4 rounded-4 border-0">
            <h3 className="text-center text-primary fw-bold mb-4">Reset Password</h3>

            <form onSubmit={handleSubmit}>
              {/* New Password */}
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label fw-semibold">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="newPassword"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-semibold">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Show Password Toggle */}
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label className="form-check-label" htmlFor="showPassword">
                  Show Passwords
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-100 fw-semibold"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            {/* Message Display */}
            {message && (
              <div
                className={`alert mt-3 ${
                  message.type === "success" ? "alert-success" : "alert-danger"
                }`}
                role="alert"
              >
                {message.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
