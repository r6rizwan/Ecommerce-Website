import React, { useEffect, useState } from 'react';

const RegistrationView = () => {
    const [RegData, setRegData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/getregister')
            .then(response => response.json())
            .then(data => setRegData(data))
            .catch(error => console.error('Error fetching registration data:', error));
    }, []);

    const DeleteReg = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/deleteregister/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setRegData(RegData.filter(user => user.id !== id));
            } else {
                console.error('Failed to delete the user.');
            }
        } catch (error) {
            console.error('Error deleting the user:', error);
        }
    }

    return (
        <div className="container my-5">
            <div className="text-center">
                <h1 className="mb-4">Registered Users</h1>
                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>City</th>
                            <th>Address</th>
                            <th>Pincode</th>
                            <th>Email</th>
                            <th> Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RegData.map((user, index) => (
                            <tr key={index}>
                                <td>{user.name}</td>
                                <td>{user.gender}</td>
                                <td>{user.city}</td>
                                <td>{user.address}</td>
                                <td>{user.pincode}</td>
                                <td>{user.email}</td>
                                <td> <i className='fa fa-trash text-danger' onClick={() => { if (window.confirm('Are you sure you want to delete this user?')) DeleteReg(user.id); }}></i></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RegistrationView;

// import React, { useEffect, useState } from 'react';

// const RegistrationView = () => {
//   const [RegData, setRegData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     fetch('http://localhost:3001/api/getregister')
//       .then(response => response.json())
//       .then(data => setRegData(data))
//       .catch(error => console.error('Error fetching registration data:', error));
//   }, []);

//   const DeleteReg = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;

//     try {
//       const response = await fetch(`http://localhost:3001/api/deleteregister/${id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         setRegData(RegData.filter(user => user.id !== id));
//       } else {
//         console.error('Failed to delete the user.');
//       }
//     } catch (error) {
//       console.error('Error deleting the user:', error);
//     }
//   };

//   const filteredData = RegData.filter(user =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.city.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="container my-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="fw-bold">👥 Registered Users</h2>
//         <input
//           type="text"
//           placeholder="Search by name, email, or city..."
//           className="form-control w-50 shadow-sm"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="table-responsive">
//         <table className="table align-middle table-hover shadow-sm">
//           <thead className="table-light">
//             <tr>
//               <th scope="col">Profile</th>
//               <th scope="col">Name</th>
//               <th scope="col">Gender</th>
//               <th scope="col">City</th>
//               <th scope="col">Address</th>
//               <th scope="col">Pincode</th>
//               <th scope="col">Email</th>
//               <th scope="col" className="text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map(user => (
//               <tr key={user.id}>
//                 <td>
//                   <div
//                     className="rounded-circle bg-primary text-white text-center fw-bold"
//                     style={{
//                       width: '40px',
//                       height: '40px',
//                       lineHeight: '40px',
//                       fontSize: '0.9rem',
//                     }}
//                   >
//                     {user.name?.charAt(0).toUpperCase() || 'U'}
//                   </div>
//                 </td>
//                 <td className="fw-semibold">{user.name}</td>
//                 <td>{user.gender}</td>
//                 <td>{user.city}</td>
//                 <td className="text-muted small">{user.address}</td>
//                 <td>{user.pincode}</td>
//                 <td className="text-primary">{user.email}</td>
//                 <td className="text-center">
//                   <i
//                     className="fa fa-trash text-danger"
//                     role="button"
//                     onClick={() => DeleteReg(user.id)}
//                   ></i>
//                 </td>
//               </tr>
//             ))}
//             {filteredData.length === 0 && (
//               <tr>
//                 <td colSpan="8" className="text-center text-muted py-4">
//                   No matching users found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RegistrationView;
