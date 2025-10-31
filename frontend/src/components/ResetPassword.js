import React from 'react'

const ResetPassword = () => {
    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center text-primary fw-bold">Reset Password</h2>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">New Password</label>
                            <input type="password" className="form-control" id="newPassword" placeholder="Enter new password" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm new password" />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
