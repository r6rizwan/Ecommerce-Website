import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address." });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("http://localhost:3001/api/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setMessage({
          type: "success",
          text: "OTP sent successfully to your email.",
        });
        localStorage.setItem("resetEmail", email);
        setTimeout(() => {
          window.location.href = "/otpscreen";
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Email not found.",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow p-4 rounded-4 border-0">
            <h3 className="text-center text-primary fw-bold mb-4">
              Forgot Password
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mt-2 fw-semibold"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>

            {message && (
              <div
                className={`alert mt-3 ${
                  message.type === "success"
                    ? "alert-success"
                    : "alert-danger"
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

export default ForgotPassword;
