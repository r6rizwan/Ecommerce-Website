import React, { useState } from 'react'
import axios from "axios";

const FeedbackPage = () => {
    const [formData, setFormData] = useState({ 'aboutProduct': '', 'aboutService': '', 'comments': '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Feedback Submitted:", formData);

            const response = await axios.post('http://localhost:3001/api/feedback', formData);
            if (response.status === 200) {
                alert("Feedback submitted successfully!");
            } else {
                alert("Failed to submit feedback. Please try again.");
            }
        } catch (error) {
            console.error("There was an error submitting the feedback!", error);
            alert("An error occurred during the process. Please try again later.");
        }
    }

    return (
        <div className="d-flex justify-content-center py-5 bg-light">
            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h3 className="text-center mb-4 text-primary fw-bold">Feedback Form</h3>

                <form onSubmit={handleSubmit}>
                    {/* About Product Field */}
                    <div className="mb-3">
                        <label htmlFor="aboutProduct" className="form-label">
                            About Product
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="aboutProduct"
                            name="aboutProduct"
                            placeholder="What do you think about our product?"
                            required
                            value={formData.name} onChange={handleChange}
                        />
                    </div>

                    {/* About Service Field */}
                    <div className="mb-3">
                        <label htmlFor="aboutService" className="form-label">
                            About Service
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="aboutService"
                            name="aboutService"
                            placeholder="Share your thoughts on our service"
                            required
                            value={formData.aboutService} onChange={handleChange}
                        />
                    </div>

                    {/* Comments Field */}
                    <div className="mb-3">
                        <label htmlFor="comments" className="form-label">
                            Additional Comments
                        </label>
                        <textarea
                            className="form-control"
                            id="comments"
                            name="comments"
                            rows="3"
                            placeholder="Any suggestions or feedback?"
                            required
                            value={formData.comments} onChange={handleChange}
                        ></textarea>
                    </div>

                    {/* Submit Feedback Button */}
                    <button type="submit" className="btn btn-primary w-100">
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );
}

export default FeedbackPage;


// import React, { useState } from 'react';
// import axios from "axios";

// const FeedbackPage = () => {
//     const [formData, setFormData] = useState({
//         aboutProduct: '',
//         aboutService: '',
//         comments: ''
//     });

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             console.log("Feedback Submitted:", formData);

//             const response = await axios.post('http://localhost:3001/api/feedback', formData);
//             if (response.status === 200) {
//                 alert("Feedback submitted successfully!");
//                 setFormData({ aboutProduct: '', aboutService: '', comments: '' }); // reset form
//             } else {
//                 alert("Failed to submit feedback. Please try again.");
//             }
//         } catch (error) {
//             console.error("There was an error submitting the feedback!", error);
//             alert("An error occurred during the process. Please try again later.");
//         }
//     };

//     return (
//         <div className="d-flex justify-content-center py-5 bg-light">
//             <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
//                 <h3 className="text-center mb-4 text-primary fw-bold">Feedback Form</h3>

//                 <form onSubmit={handleSubmit}>
//                     {/* About Product Field */}
//                     <div className="mb-3">
//                         <label htmlFor="aboutProduct" className="form-label">
//                             About Product
//                         </label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             id="aboutProduct"
//                             name="aboutProduct"
//                             placeholder="What do you think about our product?"
//                             required
//                             value={formData.aboutProduct}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     {/* About Service Field */}
//                     <div className="mb-3">
//                         <label htmlFor="aboutService" className="form-label">
//                             About Service
//                         </label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             id="aboutService"
//                             name="aboutService"
//                             placeholder="Share your thoughts on our service"
//                             required
//                             value={formData.aboutService}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     {/* Comments Field */}
//                     <div className="mb-3">
//                         <label htmlFor="comments" className="form-label">
//                             Additional Comments
//                         </label>
//                         <textarea
//                             className="form-control"
//                             id="comments"
//                             name="comments"
//                             rows="3"
//                             placeholder="Any suggestions or feedback?"
//                             required
//                             value={formData.comments}
//                             onChange={handleChange}
//                         ></textarea>
//                     </div>

//                     {/* Submit Feedback Button */}
//                     <button type="submit" className="btn btn-primary w-100">
//                         Submit Feedback
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default FeedbackPage;
