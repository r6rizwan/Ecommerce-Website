import React, { useState, useEffect } from "react";

const OTPScreen = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      alert("Session expired. Please request a new OTP.");
      window.location.href = "/forgotpassword";
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessage({ type: "error", text: "Please enter the OTP." });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("http://localhost:3001/api/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setMessage({ type: "success", text: "OTP verified successfully!" });
        setTimeout(() => (window.location.href = "/resetpassword"), 1000);
      } else {
        setMessage({ type: "error", text: data.message || "Invalid OTP." });
      }
    } catch (err) {
      setLoading(false);
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="section-title">OTP Verification</h2>
          <p className="section-subtitle mx-auto">
            Enter the OTP sent to your email to continue.
          </p>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-4">

          <div className="card p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">OTP</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
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

            <div className="text-center mt-3">
              <button
                className="btn btn-link text-decoration-none"
                onClick={() => (window.location.href = "/forgotpassword")}
              >
                Resend OTP
              </button>
            </div>
          </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default OTPScreen;
