import React, { useState } from 'react'
import axios from "axios";

const CategoryPage = () => {

    const [formData, setFormData] = useState({ 'categoryName': '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Form Data Submitted:", formData);

            const response = await axios.post('http://localhost:3001/api/addcategory', formData);
            if (response.status === 200) {
                alert("Category added successfully!");
            } else {
                alert("Failed to add category. Please try again.");
            }
        } catch (error) {
            console.error("There was an error adding the category!", error);
            alert("An error occurred during the process. Please try again later.");
        }
    }

    return (
        // <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="d-flex justify-content-center py-5 bg-light">
            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h3 className="text-center mb-4 text-primary fw-bold">Add Category</h3>

                <form onSubmit={handleSubmit}>
                    {/* Category Name Field */}
                    <div className="mb-3">
                        <label htmlFor="categoryName" className="form-label">
                            Category Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="categoryName"
                            name="categoryName"
                            placeholder="Enter category name"
                            required
                            value={formData.name} onChange={handleChange}
                        />
                    </div>

                    {/* Add Category Button */}
                    <button type="submit" className="btn btn-primary w-100">
                        Add Category
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CategoryPage


// import React, { useState } from 'react';
// import axios from 'axios';

// const CategoryPage = () => {
//   const [formData, setFormData] = useState({ categoryName: '' });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.categoryName.trim()) {
//       alert('Please enter a category name.');
//       return;
//     }

//     setLoading(true);

//     try {
//       console.log('Form Data Submitted:', formData);
//       const response = await axios.post('http://localhost:3001/api/addcategory', formData);

//       if (response.status === 200) {
//         alert('✅ Category added successfully!');
//         setFormData({ categoryName: '' });
//       } else {
//         alert('❌ Failed to add category. Please try again.');
//       }
//     } catch (error) {
//       console.error('There was an error adding the category!', error);
//       alert('⚠️ An error occurred during the process. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center py-5 bg-light min-vh-100">
//       <div
//         className="card shadow-lg border-0 p-4"
//         style={{
//           width: '100%',
//           maxWidth: '420px',
//           borderRadius: '15px',
//         }}
//       >
//         <div className="text-center mb-4">
//           <div
//             className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
//             style={{ width: '70px', height: '70px' }}
//           >
//             <i className="fa fa-tags fa-2x"></i>
//           </div>
//           <h3 className="fw-bold">Add New Category</h3>
//           <p className="text-muted small">Organize your products efficiently</p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="categoryName" className="form-label fw-semibold">
//               Category Name
//             </label>
//             <input
//               type="text"
//               className="form-control form-control-lg shadow-sm"
//               id="categoryName"
//               name="categoryName"
//               placeholder="e.g. Electronics, Fashion, Grocery..."
//               required
//               value={formData.categoryName}
//               onChange={handleChange}
//             />
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary btn-lg w-100 fw-semibold mt-2"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <i className="fa fa-spinner fa-spin me-2"></i> Adding...
//               </>
//             ) : (
//               <>
//                 <i className="fa fa-plus me-2"></i> Add Category
//               </>
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CategoryPage;
