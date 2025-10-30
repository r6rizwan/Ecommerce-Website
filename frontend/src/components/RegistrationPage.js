// import React from 'react'

// const RegistrationPage = () => {
//     return (
//         <div class="container mt-4">
//             <div class="row">
//                 <div class="card border border-3 border-success bg-warning">
//                     <div class="card-header mt-3 bg-dark text-white text-center">
//                         <h1>Registration_Form</h1>
//                     </div>

//                     <div class="card-body bg-info">
//                         <div class="mt-3 ">
//                             <label>Name :</label>
//                             <input type="text" class="form-control mt-2"></input>
//                         </div>

//                         <div class="mt-3 ">
//                             <label>Email :</label>
//                             <input type="email" class="form-control mt-2"></input>
//                         </div>

//                         <div class="mt-3 ">
//                             <label>Password :</label>
//                             <input type="password" class="form-control mt-2"></input>
//                         </div>

//                         <div class="mt-3 ">
//                             <button class="btn btn-outline-success ">Submit</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default RegistrationPage


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";


// const RegistrationPage = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({ 'name': '', 'gender': '', 'city': '', 'address': '', 'pincode': '', 'email': '', 'password': '' });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       console.log("Form Data Submitted:", formData);

//       const response = await axios.post('http://localhost:3001/api/register', formData);

//       console.log("Server Response:", response);

//       if (response.data.success) {
//         alert(response.data.message);
//         navigate('/login');
//       } else {
//         alert("Registration failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("There was an error submitting the form!", error);
//       alert("An error occurred during registration. Please try again later.");
//     }
//   };

//   return (
//     // <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//     <div className="d-flex justify-content-center py-5 bg-light">
//       <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
//         <h3 className="text-center mb-4 text-primary fw-bold">Sign Up</h3>

//         <form onSubmit={handleSubmit}>
//           {/* Name Field */}
//           <div className="mb-3">
//             <label htmlFor="name" className="form-label">
//               Full Name
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="name"
//               name="name"
//               placeholder="Enter your full name"
//               required value={formData.name} onChange={handleChange}
//             />
//           </div>

//           {/* Gender Field */}
//           <div className="mb-3">
//             <label htmlFor="gender" className="form-label">
//               Gender
//             </label>
//             <select
//               className="form-select"
//               id="gender"
//               name="gender"
//               required
//               value={formData.gender}
//               onChange={handleChange}
//             >
//               <option value="" disabled>Select your gender</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>

//           </div>

//           {/* city Field */}
//           <div className="mb-3">
//             <label htmlFor="city" className="form-label">
//               City
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="city"
//               name="city"
//               placeholder="Enter your city"
//               required
//               value={formData.city} onChange={handleChange}
//             />
//           </div>

//           {/* Address Field */}
//           <div className="mb-3">
//             <label htmlFor="address" className="form-label">
//               Address
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="address"
//               name="address"
//               placeholder="Enter your address"
//               required
//               value={formData.address} onChange={handleChange}
//             />
//           </div>

//           {/* Pincode Field */}
//           <div className="mb-3">
//             <label htmlFor="pincode" className="form-label">
//               Pincode
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="pincode"
//               name="pincode"
//               placeholder="Enter your pincode"
//               required
//               value={formData.pincode} onChange={handleChange}
//             />
//           </div>

//           {/* Email Field */}
//           <div className="mb-3">
//             <label htmlFor="email" className="form-label">
//               Email Address
//             </label>
//             <input
//               type="email"
//               className="form-control"
//               id="email"
//               name="email"
//               placeholder="Enter your email"
//               required
//               value={formData.email} onChange={handleChange}
//             />
//           </div>

//           {/* Password Field */}
//           <div className="mb-3">
//             <label htmlFor="password" className="form-label">
//               Password
//             </label>
//             <input
//               type="password"
//               className="form-control"
//               id="password"
//               name="password"
//               placeholder="Create a password"
//               required
//               value={formData.password} onChange={handleChange}
//             />
//           </div>

//           {/* Register Button */}
//           <button type="submit" className="btn btn-primary w-100">
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegistrationPage;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegistrationPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    city: "",
    address: "",
    pincode: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Form Data Submitted:", formData);

      const response = await axios.post("http://localhost:3001/api/register", formData);

      console.log("Server Response:", response);

      if (response.status === 200 && response.data.success) {
        alert(response.data.message || "Registration successful!");
        setFormData({
          name: "",
          gender: "",
          city: "",
          address: "",
          pincode: "",
          email: "",
          password: "",
        }); // Reset form
        navigate("/login");
      } else {
        alert(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("There was an error submitting the form!", error);
      alert("An error occurred during registration. Please try again later.");
    }
  };

  return (
    <div className="d-flex justify-content-center py-5 bg-light">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-4 text-primary fw-bold">Sign Up</h3>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Enter your full name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Gender Field */}
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">
              Gender
            </label>
            <select
              className="form-select"
              id="gender"
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select your gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* City Field */}
          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control"
              id="city"
              name="city"
              placeholder="Enter your city"
              required
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          {/* Address Field */}
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              placeholder="Enter your address"
              required
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Pincode Field */}
          <div className="mb-3">
            <label htmlFor="pincode" className="form-label">
              Pincode
            </label>
            <input
              type="text"
              className="form-control"
              id="pincode"
              name="pincode"
              placeholder="Enter your pincode"
              pattern="[0-9]{6}"
              title="Please enter a valid 6-digit pincode"
              required
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Create a password"
              minLength="6"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Register Button */}
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
