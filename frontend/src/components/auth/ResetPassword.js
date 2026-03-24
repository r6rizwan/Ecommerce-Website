import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageDialog from "../shared/MessageDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const ResetPassword = () => {
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { newPassword, confirmPassword } = formData;

        if (!newPassword || !confirmPassword) {
            setMessage({ type: "error", text: "Please fill in both fields." });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({
                type: "error",
                text: "Password must be at least 6 characters long.",
            });
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match." });
            return;
        }

        const email = localStorage.getItem("resetEmail");
        if (!email) {
            setMessage({
                type: "error",
                text: "Session expired. Please request a new OTP.",
            });
            navigate("/forgotpassword");
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/resetpassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            });

            const data = await response.json();
            if (data.success) {
                setMessage({
                    type: "success",
                    text: "Password reset successfully!",
                });
                localStorage.removeItem("resetEmail");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setMessage({
                    type: "error",
                    text: data.message || "Password reset failed.",
                });
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: "Something went wrong. Try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section auth-page-v2">
            <div className="container" style={{ maxWidth: "760px" }}>
                <div className="row justify-content-center">
                    <div className="col-md-7 col-lg-6">

                    <div className="card p-4 auth-card-v2">
                        <span className="chip mb-2">Security</span>
                        <h4 className="fw-bold mb-1">Reset Password</h4>
                        <p className="text-muted mb-3">
                            Create a new secure password for your account.
                        </p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">New Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    id="newPassword"
                                    placeholder="New password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Confirm Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    id="confirmPassword"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-check mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="showPassword"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                                <label className="form-check-label" htmlFor="showPassword">
                                    Show passwords
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>

                    </div>

                    </div>
                </div>
            </div>
            <MessageDialog
                show={!!message}
                title={message?.type === "success" ? "Success" : "Reset Failed"}
                message={message?.text || ""}
                onClose={() => setMessage(null)}
            />
        </section>
    );
};

export default ResetPassword;
