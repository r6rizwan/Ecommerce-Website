import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductAddPage = () => {
    const navigate = useNavigate();
    const [CatData, setCatData] = useState([]);

    const [formData, setFormData] = useState({
        categoryName: '',
        productName: '',
        quantity: '',
        uom: '',
        price: '',
        stock: '',
        description: ''
    });

    const [imageFile, setImageFile] = useState(null);

    const ImageFile = (e) => {
        setImageFile(e.target.files[0]);
    }

    useEffect(() => {
        fetch('http://localhost:3001/api/getcategory')
            .then(response => response.json())
            .then(data => setCatData(data))
            .catch(error => console.error('Error fetching category data:', error));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        try {
            console.log("Product Added:", formData);
            // Prepare form data for upload (important for images)
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });
            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }
            // Send POST request to backend
            const response = await axios.post(
                "http://localhost:3001/api/addproduct",
                formDataToSend,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.status === 200) {
                alert("Product added successfully!");
                // Reset form
                setFormData({
                    categoryName: '',
                    productName: '',
                    quantity: '',
                    uom: '',
                    price: '',
                    stock: '',
                    description: ''
                });
                setImageFile(null);
                // Navigate to product view page
                navigate("/productview");
            } else {
                alert("Failed to add product. Please try again.");
            }

        } catch (error) {
            console.error("There was an error adding product!", error);
            alert("An error occurred during the process. Please try again later.");
        }
    }

    return (
        <div className="d-flex justify-content-center py-5 bg-light">
            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "500px" }}>
                <h3 className="text-center mb-4 text-primary fw-bold">Add Product</h3>

                <form onSubmit={handleSubmit}>
                    {/* Category Name */}
                    <div className="mb-3">
                        <label htmlFor="categoryName" className="form-label">
                            Category Name
                        </label>
                        <select
                            className="form-select"
                            id="categoryName"
                            name="categoryName"
                            required
                            value={formData.categoryName}
                            onChange={handleChange}
                        >
                            <option value="" disabled>
                                Select Category
                            </option>
                            {CatData.map((category, index) => (
                                <div key={index}>
                                    <option value={category.category_name}>{category.category_name}</option>
                                </div>
                            ))}
                        </select>
                    </div>

                    {/* Product Name */}
                    <div className="mb-3">
                        <label htmlFor="productName" className="form-label">
                            Product Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="productName"
                            name="productName"
                            placeholder="Enter product name"
                            required
                            value={formData.productName} onChange={handleChange}

                        />
                    </div>

                    {/* Quantity */}
                    <div className="mb-3">
                        <label htmlFor="quantity" className="form-label">
                            Quantity
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="quantity"
                            name="quantity"
                            placeholder="Enter quantity"
                            min="0"
                            required
                            value={formData.quantity} onChange={handleChange}
                        />
                    </div>

                    {/* Unit of Measure (UOM) */}
                    <div className="mb-3">
                        <label htmlFor="uom" className="form-label">
                            Unit of Measure (UOM)
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="uom"
                            name="uom"
                            placeholder="e.g., kg, liter, pcs"
                            required
                            value={formData.uom} onChange={handleChange}
                        />
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">
                            Price
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="price"
                            name="price"
                            placeholder="Enter price"
                            min="0"
                            step="0.01"
                            required
                            value={formData.price} onChange={handleChange}
                        />
                    </div>

                    {/* Stock */}
                    <div className="mb-3">
                        <label htmlFor="stock" className="form-label">
                            Stock
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="stock"
                            name="stock"
                            placeholder="Enter stock quantity"
                            min="0"
                            required
                            value={formData.stock} onChange={handleChange}
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">
                            Product Image
                        </label>
                        <input
                            type="file"
                            className="form-control"
                            id="image"
                            name="image"
                            accept="image/*" onChange={ImageFile}
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            rows="3"
                            placeholder="Enter product description"
                            value={formData.description} onChange={handleChange}
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary w-100">
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProductAddPage;


// import React, { useState } from 'react';
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const ProductAddPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     categoryName: '',
//     productName: '',
//     quantity: '',
//     uom: '',
//     price: '',
//     stock: '',
//     image: null,
//     description: ''
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: files ? files[0] : value, // handle file separately
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Prepare form data for upload (important for images)
//       const formDataToSend = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         formDataToSend.append(key, value);
//       });

//       const response = await axios.post(
//         "http://localhost:3001/api/addproduct",
//         formDataToSend,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       if (response.status === 200) {
//         alert("✅ Product added successfully!");
//         setFormData({
//           categoryName: '',
//           productName: '',
//           quantity: '',
//           uom: '',
//           price: '',
//           stock: '',
//           image: null,
//           description: '',
//         });
//         navigate("/productview");
//       } else {
//         alert("⚠️ Failed to add product. Please try again.");
//       }
//     } catch (error) {
//       console.error("❌ Error adding product:", error);
//       alert("An error occurred during the process. Please try again later.");
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center py-5 bg-light">
//       <div className="card shadow p-4" style={{ width: "100%", maxWidth: "500px" }}>
//         <h3 className="text-center mb-4 text-primary fw-bold">Add Product</h3>

//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           {/* Category Name */}
//           <div className="mb-3">
//             <label htmlFor="categoryName" className="form-label">
//               Category Name
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="categoryName"
//               name="categoryName"
//               placeholder="Enter category name"
//               required
//               value={formData.categoryName}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Product Name */}
//           <div className="mb-3">
//             <label htmlFor="productName" className="form-label">
//               Product Name
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="productName"
//               name="productName"
//               placeholder="Enter product name"
//               required
//               value={formData.productName}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Quantity */}
//           <div className="mb-3">
//             <label htmlFor="quantity" className="form-label">
//               Quantity
//             </label>
//             <input
//               type="number"
//               className="form-control"
//               id="quantity"
//               name="quantity"
//               min="0"
//               required
//               value={formData.quantity}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Unit of Measure */}
//           <div className="mb-3">
//             <label htmlFor="uom" className="form-label">
//               Unit of Measure (UOM)
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="uom"
//               name="uom"
//               placeholder="e.g., kg, liter, pcs"
//               required
//               value={formData.uom}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Price */}
//           <div className="mb-3">
//             <label htmlFor="price" className="form-label">
//               Price (₹)
//             </label>
//             <input
//               type="number"
//               className="form-control"
//               id="price"
//               name="price"
//               min="0"
//               step="0.01"
//               required
//               value={formData.price}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Stock */}
//           <div className="mb-3">
//             <label htmlFor="stock" className="form-label">
//               Stock
//             </label>
//             <input
//               type="number"
//               className="form-control"
//               id="stock"
//               name="stock"
//               min="0"
//               required
//               value={formData.stock}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Image Upload */}
//           <div className="mb-3">
//             <label htmlFor="image" className="form-label">
//               Product Image
//             </label>
//             <input
//               type="file"
//               className="form-control"
//               id="image"
//               name="image"
//               accept="image/*"
//               onChange={handleChange}
//             />
//           </div>

//           {/* Description */}
//           <div className="mb-3">
//             <label htmlFor="description" className="form-label">
//               Description
//             </label>
//             <textarea
//               className="form-control"
//               id="description"
//               name="description"
//               rows="3"
//               placeholder="Enter product description"
//               value={formData.description}
//               onChange={handleChange}
//             ></textarea>
//           </div>

//           {/* Submit Button */}
//           <button type="submit" className="btn btn-primary w-100">
//             Add Product
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductAddPage;
