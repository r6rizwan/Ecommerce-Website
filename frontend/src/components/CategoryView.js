import React, { useState, useEffect } from 'react'

const CategoryView = () => {
    const [CatData, setCatData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/getcategory')
            .then(response => response.json())
            .then(data => setCatData(data))
            .catch(error => console.error('Error fetching category data:', error));
    }, []);

    const DeleteCat = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/deletecategory/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCatData(CatData.filter(category => category.id !== id));
            } else {
                console.error('Failed to delete the category.');
            }
        } catch (error) {
            console.error('Error deleting the category:', error);
        }
    }

    return (
        <div className="container my-5">
            <div className="text-center">
                <h1 className="mb-4">Categories</h1>
                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Categories</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {CatData.map((category, index) => (
                            <tr key={index}>
                                <td>{category.category_name}</td>
                                <td> <i className='fa fa-trash text-danger' onClick={() => { if (window.confirm('Are you sure you want to delete this category?')) DeleteCat(category.id); }}></i></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CategoryView


// import React, { useState, useEffect } from 'react';

// const CategoryView = () => {
//   const [CatData, setCatData] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:3001/api/getcategory')
//       .then((response) => response.json())
//       .then((data) => setCatData(data))
//       .catch((error) => console.error('Error fetching category data:', error));
//   }, []);

//   const DeleteReg = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this category?')) return;

//     try {
//       const response = await fetch(`http://localhost:3001/api/deletecategory/${id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         setCatData(CatData.filter((category) => category.id !== id));
//       } else {
//         console.error('Failed to delete the category.');
//       }
//     } catch (error) {
//       console.error('Error deleting the category:', error);
//     }
//   };

//   return (
//     <div className="container my-5">
//       <h1 className="text-center mb-5 fw-bold">📂 Categories</h1>

//       {CatData.length === 0 ? (
//         <div className="text-center text-muted">
//           <p>No categories found.</p>
//         </div>
//       ) : (
//         <div className="row g-4">
//           {CatData.map((category) => (
//             <div className="col-6 col-md-4 col-lg-3" key={category.id}>
//               <div className="card category-card shadow-sm border-0 text-center h-100">
//                 <div className="card-body d-flex flex-column justify-content-between">
//                   <div>
//                     <div
//                       className="rounded-circle bg-light mx-auto mb-3 d-flex align-items-center justify-content-center"
//                       style={{
//                         width: '80px',
//                         height: '80px',
//                         boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
//                       }}
//                     >
//                       <i className="fa fa-tags fa-2x text-primary"></i>
//                     </div>
//                     <h5 className="card-title fw-semibold text-capitalize">
//                       {category.category_name}
//                     </h5>
//                   </div>

//                   <button
//                     className="btn btn-outline-danger btn-sm mt-3"
//                     onClick={() => DeleteReg(category.id)}
//                   >
//                     <i className="fa fa-trash"></i> Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoryView;
