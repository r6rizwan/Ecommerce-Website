import React, { useState, useEffect } from "react";

const OTPScreen = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [email, setEmail] = useState("");

  // Fetch email from localStorage when component mounts
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
        setTimeout(() => {
          window.location.href = "/resetpassword";
        }, 1000);
      } else {
        setMessage({ type: "error", text: data.message || "Invalid OTP." });
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setLoading(false);
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow p-4 rounded-4 border-0">
            <h3 className="text-center text-primary fw-bold mb-4">
              OTP Verification
            </h3>

            <p className="text-center text-muted mb-4">
              We’ve sent an OTP to <strong>{email}</strong>. Please enter it below.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="otp" className="form-label fw-semibold">
                  Enter OTP
                </label>
                <input
                  type="number"
                  id="otp"
                  className="form-control"
                  placeholder="Enter your 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mt-2 fw-semibold"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

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
  );
};

export default OTPScreen;
