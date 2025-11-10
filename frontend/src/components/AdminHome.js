// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AdminHome = () => {
//   const [stats, setStats] = useState({
//     totalSales: 0,
//     totalOrders: 0,
//     totalCustomers: 0,
//     todayOrders: 0,
//   });
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [recentReviews, setRecentReviews] = useState([]);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const res = await axios.get("http://localhost:3001/api/admindashboard");
//         const data = res.data;

//         setStats({
//           totalSales: data.totalSales,
//           totalOrders: data.totalOrders,
//           totalCustomers: data.totalCustomers,
//           todayOrders: data.todayOrders,
//         });

//         setRecentOrders(data.recentOrders);
//         setRecentReviews(data.recentReviews);
//       } catch (error) {
//         console.error("Error fetching admin dashboard:", error);
//       }
//     };

//     fetchDashboardData();
//   }, []);


//   return (
//     <div className="container-fluid">
//       <div className="row">
//         {/* Sidebar */}
//         <div className="col-md-3 col-lg-2 bg-primary text-white vh-100 p-4 d-flex flex-column sticky-top">
//           <h4 className="fw-bold mb-4 text-center">Dashboard</h4>
//           <ul className="nav flex-column">
//             <li className="nav-item mb-2">
//               <a href="/orders" className="nav-link text-white">
//                 <i className="bi bi-box-seam me-2"></i> Orders
//               </a>
//             </li>
//             <li className="nav-item mb-2">
//               <a href="/feedbackview" className="nav-link text-white">
//                 <i className="bi bi-chat-dots me-2"></i> Reviews
//               </a>
//             </li>
//             <li className="nav-item mb-2">
//               <a href="/productview" className="nav-link text-white">
//                 <i className="bi bi-bag me-2"></i> Products
//               </a>
//             </li>
//             <li className="nav-item mb-2 dropdown">
//               <a
//                 href="\"
//                 className="nav-link dropdown-toggle text-white"
//                 data-bs-toggle="dropdown"
//               >
//                 <i className="bi bi-bar-chart-line me-2"></i> Reports
//               </a>
//               <ul className="dropdown-menu">
//                 <li>
//                   <a className="dropdown-item" href="/reports/yearly">
//                     Yearly Sales
//                   </a>
//                 </li>
//                 <li>
//                   <a className="dropdown-item" href="/reports/monthly">
//                     Monthly Sales
//                   </a>
//                 </li>
//               </ul>
//             </li>
//             <li className="nav-item mt-auto">
//               <button
//                 className="btn btn-outline-light w-100 mt-3"
//                 onClick={() => {
//                   localStorage.clear();
//                   window.location.href = "/";
//                 }}
//               >
//                 <i className="bi bi-box-arrow-right me-2"></i> Logout
//               </button>
//             </li>
//           </ul>
//         </div>

//         {/* Main Content */}
//         <div className="col-md-9 col-lg-10 p-4">
//           <h2 className="fw-bold text-primary mb-4">Welcome, Admin 👋</h2>

//           {/* Stats Cards */}
//           <div className="row g-4 mb-5">
//             {/* Total Sales */}
//             <div className="col-md-3">
//               <div className="card shadow-sm border-0 rounded-4 text-center p-3">
//                 <div className="text-muted small mb-1">Total Sales</div>
//                 <h4 className="fw-bold text-success">
//                   ₹{stats.totalSales.toLocaleString()}
//                 </h4>
//                 <i className="bi bi-cash-coin text-success fs-3 mt-2"></i>
//               </div>
//             </div>

//             {/* Total Orders */}
//             <div className="col-md-3">
//               <div className="card shadow-sm border-0 rounded-4 text-center p-3">
//                 <div className="text-muted small mb-1">Total Orders</div>
//                 <h4 className="fw-bold text-primary">{stats.totalOrders}</h4>
//                 <i className="bi bi-cart-check text-primary fs-3 mt-2"></i>
//               </div>
//             </div>

//             {/* Total Customers */}
//             <div className="col-md-3">
//               <div className="card shadow-sm border-0 rounded-4 text-center p-3">
//                 <div className="text-muted small mb-1">Total Customers</div>
//                 <h4 className="fw-bold text-warning">{stats.totalCustomers}</h4>
//                 <i className="bi bi-people text-warning fs-3 mt-2"></i>
//               </div>
//             </div>

//             {/* Today's Orders */}
//             <div className="col-md-3">
//               <div className="card shadow-sm border-0 rounded-4 text-center p-3">
//                 <div className="text-muted small mb-1">Today's Orders</div>
//                 <h4 className="fw-bold text-info">{stats.todayOrders}</h4>
//                 <i className="bi bi-calendar-check text-info fs-3 mt-2"></i>
//               </div>
//             </div>
//           </div>

//           {/* Two-Column Section */}
//           <div className="row g-4">
//             {/* Recent Orders */}
//             <div className="col-md-6">
//               <div className="card shadow-sm border-0 rounded-4 h-100">
//                 <div className="card-header bg-light fw-semibold">
//                   <i className="bi bi-basket2 me-2"></i>Recent Orders (Top 5)
//                 </div>
//                 <div className="card-body">
//                   {recentOrders.length === 0 ? (
//                     <p className="text-center text-muted mb-0">
//                       No recent orders.
//                     </p>
//                   ) : (
//                     <table className="table table-sm align-middle">
//                       <thead className="table-light">
//                         <tr>
//                           <th>#</th>
//                           <th>Customer</th>
//                           <th>Product</th>
//                           <th>Date</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {recentOrders.map((order, i) => (
//                           <tr key={order.id}>
//                             <td>{i + 1}</td>
//                             <td>{order.customer_name}</td>
//                             <td>{order.product_name}</td>
//                             <td>
//                               {new Date(order.order_date).toLocaleDateString("en-IN", {
//                                 day: "2-digit",
//                                 month: "short",
//                                 year: "numeric",
//                               })}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Recent Reviews */}
//             <div className="col-md-6">
//               <div className="card shadow-sm border-0 rounded-4 h-100">
//                 <div className="card-header bg-light fw-semibold">
//                   <i className="bi bi-chat-square-text me-2"></i>Recent Reviews (Top 5)
//                 </div>
//                 <div className="card-body">
//                   {recentReviews.length === 0 ? (
//                     <p className="text-center text-muted mb-0">
//                       No recent reviews.
//                     </p>
//                   ) : (
//                     <table className="table table-sm align-middle">
//                       <thead className="table-light">
//                         <tr>
//                           <th>#</th>
//                           <th>User ID</th>
//                           <th>Comment</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {recentReviews.map((review, i) => (
//                           <tr key={review.id}>
//                             <td>{i + 1}</td>
//                             <td>{review.user_id}</td>
//                             <td>{review.comments}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminHome;


import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    todayOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/admindashboard");
        const data = res.data;

        setStats({
          totalSales: data.totalSales,
          totalOrders: data.totalOrders,
          totalCustomers: data.totalCustomers,
          todayOrders: data.todayOrders,
        });

        setRecentOrders(data.recentOrders || []);
        setRecentReviews(data.recentReviews || []);
      } catch (error) {
        console.error("Error fetching admin dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="fw-bold text-primary mb-4">Welcome, Admin 👋</h2>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        {/* Total Sales */}
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 text-center p-3">
            <div className="text-muted small mb-1">Total Sales</div>
            <h4 className="fw-bold text-success">
              ₹{stats.totalSales.toLocaleString()}
            </h4>
            <i className="bi bi-cash-coin text-success fs-3 mt-2"></i>
          </div>
        </div>

        {/* Total Orders */}
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 text-center p-3">
            <div className="text-muted small mb-1">Total Orders</div>
            <h4 className="fw-bold text-primary">{stats.totalOrders}</h4>
            <i className="bi bi-cart-check text-primary fs-3 mt-2"></i>
          </div>
        </div>

        {/* Total Customers */}
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 text-center p-3">
            <div className="text-muted small mb-1">Total Customers</div>
            <h4 className="fw-bold text-warning">{stats.totalCustomers}</h4>
            <i className="bi bi-people text-warning fs-3 mt-2"></i>
          </div>
        </div>

        {/* Today's Orders */}
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 text-center p-3">
            <div className="text-muted small mb-1">Today's Orders</div>
            <h4 className="fw-bold text-info">{stats.todayOrders}</h4>
            <i className="bi bi-calendar-check text-info fs-3 mt-2"></i>
          </div>
        </div>
      </div>

      {/* Two-Column Section */}
      <div className="row g-4">
        {/* Recent Orders */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-header bg-light fw-semibold">
              <i className="bi bi-basket2 me-2"></i>Recent Orders (Top 5)
            </div>
            <div className="card-body">
              {recentOrders.length === 0 ? (
                <p className="text-center text-muted mb-0">
                  No recent orders.
                </p>
              ) : (
                <table className="table table-sm align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <tr key={order.id}>
                        <td>{i + 1}</td>
                        <td>{order.customer_name}</td>
                        <td>{order.product_name}</td>
                        <td>
                          {new Date(order.order_date).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-header bg-light fw-semibold">
              <i className="bi bi-chat-square-text me-2"></i>Recent Reviews (Top 5)
            </div>
            <div className="card-body">
              {recentReviews.length === 0 ? (
                <p className="text-center text-muted mb-0">
                  No recent reviews.
                </p>
              ) : (
                <table className="table table-sm align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>User ID</th>
                      <th>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReviews.map((review, i) => (
                      <tr key={review.id}>
                        <td>{i + 1}</td>
                        <td>{review.user_id}</td>
                        <td>{review.comments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
