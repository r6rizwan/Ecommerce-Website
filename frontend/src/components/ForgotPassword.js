import React, { useState } from "react";

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
    <section className="section">
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="section-title">Forgot Password</h2>
          <p className="section-subtitle mx-auto">
            We will send a one-time password to your email.
          </p>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-4">

          <div className="card p-4">
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

            {message && (
              <div
                className={`alert mt-3 ${message.type === "success"
                    ? "alert-success"
                    : "alert-danger"
                  }`}
              >
                {message.text}
              </div>
            )}
          </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
