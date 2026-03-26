import React, { useState, useEffect } from "react";
import MessageDialog from "../shared/MessageDialog";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const OTPScreen = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({ show: false, title: "", message: "", onCloseRedirect: "" });
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      setDialog({
        show: true,
        title: "Session Expired",
        message: "Please request a new OTP.",
        onCloseRedirect: "/forgotpassword",
      });
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setDialog({ show: true, title: "Invalid OTP", message: "Please enter the OTP.", onCloseRedirect: "" });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setDialog({
          show: true,
          title: "Success",
          message: "OTP verified successfully.",
          onCloseRedirect: "/resetpassword",
        });
      } else {
        setDialog({
          show: true,
          title: "Verification Failed",
          message: data.message || "Invalid OTP.",
          onCloseRedirect: "",
        });
      }
    } catch (err) {
      setLoading(false);
      setDialog({
        show: true,
        title: "Error",
        message: "Something went wrong. Please try again.",
        onCloseRedirect: "",
      });
    }
  };

  return (
    <section className="section auth-page-v2">
      <div className="container" style={{ maxWidth: "760px" }}>
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">

          <div className="card p-4 auth-card-v2">
            <span className="chip mb-2">Verification</span>
            <h4 className="fw-bold mb-1">OTP Verification</h4>
            <p className="text-muted mb-3">
              Enter the OTP sent to your email to continue.
            </p>
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
      <MessageDialog
        show={dialog.show}
        title={dialog.title}
        message={dialog.message}
        onClose={() => {
          const redirect = dialog.onCloseRedirect;
          setDialog({ show: false, title: "", message: "", onCloseRedirect: "" });
          if (redirect) window.location.href = redirect;
        }}
      />
    </section>
  );
};

export default OTPScreen;
