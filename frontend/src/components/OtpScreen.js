import React from 'react'
import { useNavigate } from "react-router-dom";

const OtpScreen = () => {
    const navigate = useNavigate();
    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center text-primary fw-bold">OTP Verification</h2>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="otp" className="form-label">Enter OTP</label>
                            <input type="text" className="form-control" id="otp" placeholder="Enter the OTP sent to your email" />
                        </div>
                        <button type="submit" onClick={() => navigate('/resetpassword')} className="btn btn-primary w-100">Verify OTP</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default OtpScreen
