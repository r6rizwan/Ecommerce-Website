import React, { useState, useEffect } from 'react'

const FeedbackView = () => {
    const [FeedbackData, setFeedbackData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/getfeedback')
            .then(response => response.json())
            .then(data => setFeedbackData(data))
            .catch(error => console.error('Error fetching feedback data:', error));
    }, []);

    const DeleteReg = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/deletefeedback/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setFeedbackData(FeedbackData.filter(feedback => feedback.id !== id));
            } else {
                console.error('Failed to delete the feedback.');
            }
        } catch (error) {
            console.error('Error deleting the feedback:', error);
        }
    }

    return (
        <div className="container my-5">
            <div className="text-center">
                <h1 className="mb-4">Feedbacks</h1>
                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Email</th>
                            <th>About Service</th>
                            <th>About Product</th>
                            <th>Comments</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {FeedbackData.map((feedback, index) => (
                            <tr key={index}>
                                <td>{feedback.user_id}</td>
                                <td>{feedback.about_service}</td>
                                <td>{feedback.about_product}</td>
                                <td>{feedback.comments}</td>
                                <td> <i className='fa fa-trash text-danger' onClick={() => { if (window.confirm('Are you sure you want to delete this feedback?')) DeleteReg(feedback.id); }}></i></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default FeedbackView

// import React, { useState, useEffect } from 'react';

// const FeedbackView = () => {
//   const [FeedbackData, setFeedbackData] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:3001/api/getfeedback')
//       .then((response) => response.json())
//       .then((data) => setFeedbackData(data))
//       .catch((error) => console.error('Error fetching feedback data:', error));
//   }, []);

//   const DeleteReg = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this feedback?')) return;

//     try {
//       const response = await fetch(`http://localhost:3001/api/deletefeedback/${id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         setFeedbackData(FeedbackData.filter((feedback) => feedback.id !== id));
//       } else {
//         console.error('Failed to delete the feedback.');
//       }
//     } catch (error) {
//       console.error('Error deleting the feedback:', error);
//     }
//   };

//   return (
//     <div className="container my-5">
//       <h1 className="text-center mb-5 fw-bold">💬 Customer Feedback</h1>

//       {FeedbackData.length === 0 ? (
//         <div className="text-center text-muted mt-5">
//           <p>No feedback available.</p>
//         </div>
//       ) : (
//         <div className="row g-4">
//           {FeedbackData.map((feedback) => (
//             <div className="col-md-6 col-lg-4" key={feedback.id}>
//               <div className="card h-100 shadow-sm border-0 feedback-card">
//                 <div className="card-body d-flex flex-column">
//                   <div className="d-flex justify-content-between align-items-center mb-2">
//                     <h5 className="card-title text-primary">
//                       {feedback.user_id || 'Anonymous User'}
//                     </h5>
//                     <i
//                       className="fa fa-trash text-danger"
//                       role="button"
//                       onClick={() => DeleteReg(feedback.id)}
//                       title="Delete Feedback"
//                     ></i>
//                   </div>

//                   <p className="mb-1 text-muted small">
//                     <strong>About Service:</strong> {feedback.about_service}
//                   </p>
//                   <p className="mb-1 text-muted small">
//                     <strong>About Product:</strong> {feedback.about_product}
//                   </p>

//                   <p className="mt-3 text-secondary flex-grow-1">
//                     <i className="fa fa-quote-left text-warning me-2"></i>
//                     {feedback.comments}
//                   </p>

//                   <div className="mt-3 d-flex justify-content-end">
//                     <span className="badge bg-light text-dark">
//                       🗓 {new Date().toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FeedbackView;
