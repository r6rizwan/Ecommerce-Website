import React, { useState } from "react";
import MessageDialog from "../shared/MessageDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address." });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch(`${API_BASE_URL}/api/forgotpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setMessage({
          type: "success",
          text: "OTP sent to your registered email.",
        });
        localStorage.setItem("resetEmail", email);
        setTimeout(() => (window.location.href = "/otpscreen"), 1000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Email not found.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <section className="section auth-page-v2">
      <div className="container" style={{ maxWidth: "760px" }}>
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">

          <div className="card p-4 auth-card-v2">
            <span className="chip mb-2">Password Recovery</span>
            <h4 className="fw-bold mb-1">Forgot Password</h4>
            <p className="text-muted mb-3">
              We will send a one-time password to your registered email.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>

          </div>

          </div>
        </div>
      </div>
      <MessageDialog
        show={!!message}
        title={message?.type === "success" ? "Success" : "Request Failed"}
        message={message?.text || ""}
        onClose={() => setMessage(null)}
      />
    </section>
  );
};

export default ForgotPassword;
