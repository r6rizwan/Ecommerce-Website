import React from 'react'
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const[data,setData]=React.useState({});

    const handleChange=(e)=>{
        const newdata={...data}
        newdata[e.target.id]=e.target.value
        setData(newdata)
        console.log(newdata);
    }

    // submit form with API call
    const SubmitForm=(e)=>{
        e.preventDefault();
        const email=data.email;
        console.log(email); 
        const url="http://localhost:3001/api/forgotpassword";
        fetch(url,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                email:email
            })
        }).then((res)=>res.json())
        .then((data)=>{
            console.log(data);
        });
    }   

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center text-primary fw-bold">Forgot Password</h2>
            <form onSubmit={SubmitForm}>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" onChange={handleChange} className="form-control" id="email" placeholder="Enter your email" />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" onClick={() => navigate('/otpscreen')}>Reset Password</button>
                    </div>
                </div>
            
            </div>
            </form>
        </div>
    )
}

export default ForgotPassword
