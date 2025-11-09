import React from 'react'

const PaySuccess = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="text-center">
        <h1 className="mb-4 text-success">Payment Successful!</h1>
        <p className="lead">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>
      </div>
    </div>
  )
}

export default PaySuccess
