import React from 'react'
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();
    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center text-primary fw-bold">Forgot Password</h2>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter your email" />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" onClick={() => navigate('/otpscreen')}>Reset Password</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
