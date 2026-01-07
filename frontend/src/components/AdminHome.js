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
        const res = await axios.get(
          "http://localhost:3001/api/admindashboard"
        );
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
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <section>
      <h2 className="fw-bold mb-4">Dashboard Overview</h2>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card p-3 text-center">
            <small className="text-muted">Total Sales</small>
            <h4 className="fw-bold text-success">
              ₹{stats.totalSales.toLocaleString()}
            </h4>
            <i className="bi bi-cash-coin fs-3 text-success"></i>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center">
            <small className="text-muted">Total Orders</small>
            <h4 className="fw-bold text-primary">{stats.totalOrders}</h4>
            <i className="bi bi-cart-check fs-3 text-primary"></i>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center">
            <small className="text-muted">Customers</small>
            <h4 className="fw-bold text-warning">{stats.totalCustomers}</h4>
            <i className="bi bi-people fs-3 text-warning"></i>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center">
            <small className="text-muted">Today’s Orders</small>
            <h4 className="fw-bold text-info">{stats.todayOrders}</h4>
            <i className="bi bi-calendar-check fs-3 text-info"></i>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header fw-semibold bg-white">
              Recent Orders
            </div>
            <div className="card-body p-0">
              {recentOrders.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">
                  No recent orders
                </p>
              ) : (
                <table className="table table-sm mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o, i) => (
                      <tr key={o.id}>
                        <td>{i + 1}</td>
                        <td>{o.customer_name}</td>
                        <td>{o.product_name}</td>
                        <td>
                          {new Date(o.order_date).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header fw-semibold bg-white">
              Recent Reviews
            </div>
            <div className="card-body p-0">
              {recentReviews.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">
                  No recent reviews
                </p>
              ) : (
                <table className="table table-sm mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Comment</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReviews.map((r, i) => (
                      <tr key={r.id}>
                        <td>{i + 1}</td>
                        <td>{r.user_id}</td>
                        <td className="text-truncate" style={{ maxWidth: 180 }}>
                          {r.comments}
                        </td>
                        <td>
                          {r.star_rating
                            ? [...Array(r.star_rating)].map((_, i) => (
                              <i
                                key={i}
                                className="bi bi-star-fill text-warning me-1"
                              ></i>
                            ))
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminHome;
