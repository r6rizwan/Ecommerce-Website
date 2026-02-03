import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAuthHeader } from './superAdmin/superAdminAuth';
import axios from "axios";

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    todayOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [orderQuery, setOrderQuery] = useState("");
  const [reviewQuery, setReviewQuery] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        "http://localhost:3001/api/admindashboard",
        { headers: adminAuthHeader() }
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
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const avgOrderValue =
    stats.totalOrders > 0 ? stats.totalSales / stats.totalOrders : 0;

  const filteredOrders = useMemo(() => {
    if (!orderQuery.trim()) return recentOrders;
    const q = orderQuery.trim().toLowerCase();
    return recentOrders.filter((o) =>
      `${o.id} ${o.customer_name} ${o.product_name}`
        .toLowerCase()
        .includes(q)
    );
  }, [orderQuery, recentOrders]);

  const filteredReviews = useMemo(() => {
    if (!reviewQuery.trim()) return recentReviews;
    const q = reviewQuery.trim().toLowerCase();
    return recentReviews.filter((r) =>
      `${r.user_id} ${r.comments}`.toLowerCase().includes(q)
    );
  }, [reviewQuery, recentReviews]);

  return (
    <section>
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h2 className="fw-bold mb-1">Dashboard Overview</h2>
          <div className="text-muted">Monitor sales, orders, and feedback at a glance.</div>
        </div>
        <div className="dashboard-actions">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate("/orders")}
          >
            View Orders
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/addproduct")}
          >
            Add Product
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button className="btn btn-outline-light btn-sm" onClick={fetchDashboardData}>
            Retry
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card p-3 dashboard-stat">
            {loading ? (
              <>
                <div className="skeleton-line w-40 mb-2" />
                <div className="skeleton-line w-60 mb-2" />
                <div className="skeleton-line w-30" />
              </>
            ) : (
              <>
                <small className="text-muted">Total Sales</small>
                <h4 className="fw-bold text-success">
                  ₹{stats.totalSales.toLocaleString()}
                </h4>
                <i className="bi bi-cash-coin fs-3 text-success"></i>
                <div className="text-muted small mt-1">
                  Avg order: ₹{avgOrderValue.toFixed(2)}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 dashboard-stat">
            {loading ? (
              <>
                <div className="skeleton-line w-40 mb-2" />
                <div className="skeleton-line w-60 mb-2" />
                <div className="skeleton-line w-30" />
              </>
            ) : (
              <>
                <small className="text-muted">Total Orders</small>
                <h4 className="fw-bold text-primary">{stats.totalOrders}</h4>
                <i className="bi bi-cart-check fs-3 text-primary"></i>
                <div className="text-muted small mt-1">
                  Today: {stats.todayOrders}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 dashboard-stat">
            {loading ? (
              <>
                <div className="skeleton-line w-40 mb-2" />
                <div className="skeleton-line w-60 mb-2" />
                <div className="skeleton-line w-30" />
              </>
            ) : (
              <>
                <small className="text-muted">Customers</small>
                <h4 className="fw-bold text-warning">{stats.totalCustomers}</h4>
                <i className="bi bi-people fs-3 text-warning"></i>
                <div className="text-muted small mt-1">Active users</div>
              </>
            )}
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 dashboard-stat">
            {loading ? (
              <>
                <div className="skeleton-line w-40 mb-2" />
                <div className="skeleton-line w-60 mb-2" />
                <div className="skeleton-line w-30" />
              </>
            ) : (
              <>
                <small className="text-muted">Today's Orders</small>
                <h4 className="fw-bold text-info">{stats.todayOrders}</h4>
                <i className="bi bi-calendar-check fs-3 text-info"></i>
                <div className="text-muted small mt-1">
                  Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header fw-semibold bg-white d-flex justify-content-between align-items-center">
              <span>Recent Orders</span>
              <span className="text-muted small">{filteredOrders.length} items</span>
            </div>
            <div className="p-3 border-bottom">
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search orders..."
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
              />
            </div>
            <div className="card-body p-0">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-4 mb-0">
                  <div className="text-muted">No recent orders</div>
                  <button
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={() => navigate("/orders")}
                  >
                    View all orders
                  </button>
                </div>
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
                    {filteredOrders.map((o, i) => (
                      <tr key={o.id}>
                        <td>{i + 1}</td>
                        <td>{o.customer_name}</td>
                        <td className="text-truncate" style={{ maxWidth: 160 }}>
                          {o.product_name}
                        </td>
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
            <div className="card-header fw-semibold bg-white d-flex justify-content-between align-items-center">
              <span>Recent Reviews</span>
              <span className="text-muted small">{filteredReviews.length} items</span>
            </div>
            <div className="p-3 border-bottom">
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search reviews..."
                value={reviewQuery}
                onChange={(e) => setReviewQuery(e.target.value)}
              />
            </div>
            <div className="card-body p-0">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-4 mb-0">
                  <div className="text-muted">No recent reviews</div>
                  <button
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={() => navigate("/feedbackview")}
                  >
                    View feedback
                  </button>
                </div>
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
                    {filteredReviews.map((r, i) => (
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
