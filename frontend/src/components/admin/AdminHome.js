import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAuthHeader } from '../superAdmin/superAdminAuth';
import axios from "axios";
import MessageDialog from "../shared/MessageDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
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
        `${API_BASE_URL}/api/admindashboard`,
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

  const orderMomentum = Math.min(
    100,
    stats.totalOrders > 0
      ? Math.round((stats.todayOrders / stats.totalOrders) * 100)
      : 0
  );
  const customerCoverage = Math.min(
    100,
    stats.totalOrders > 0
      ? Math.round((stats.totalCustomers / stats.totalOrders) * 100)
      : 0
  );
  const reviewCoverage = Math.min(
    100,
    recentOrders.length > 0
      ? Math.round((recentReviews.length / recentOrders.length) * 100)
      : 0
  );

  return (
    <section className="section">
      <div className="admin-hero-v2 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
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
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card p-3 dashboard-stat admin-stat-v2">
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
          <div className="card p-3 dashboard-stat admin-stat-v2">
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
          <div className="card p-3 dashboard-stat admin-stat-v2">
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
          <div className="card p-3 dashboard-stat admin-stat-v2">
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

      <div className="row g-4 mb-4 admin-analytics-v3">
        <div className="col-lg-8">
          <div className="card p-4 admin-panel-v2 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Performance Snapshot</h6>
              <span className="chip">Today</span>
            </div>

            <div className="admin-metric-v3">
              <div className="admin-metric-top">
                <span>Order Momentum</span>
                <strong>{orderMomentum}%</strong>
              </div>
              <div className="admin-meter-track">
                <div className="admin-meter-fill" style={{ width: `${orderMomentum}%` }} />
              </div>
            </div>

            <div className="admin-metric-v3">
              <div className="admin-metric-top">
                <span>Customer Coverage</span>
                <strong>{customerCoverage}%</strong>
              </div>
              <div className="admin-meter-track">
                <div className="admin-meter-fill alt" style={{ width: `${customerCoverage}%` }} />
              </div>
            </div>

            <div className="admin-metric-v3 mb-0">
              <div className="admin-metric-top">
                <span>Review Coverage</span>
                <strong>{reviewCoverage}%</strong>
              </div>
              <div className="admin-meter-track">
                <div className="admin-meter-fill warn" style={{ width: `${reviewCoverage}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card p-4 admin-panel-v2 h-100">
            <h6 className="fw-bold mb-3">Quick Actions</h6>
            <div className="d-grid gap-2">
              <button className="btn btn-primary" onClick={() => navigate("/addproduct")}>
                Add New Product
              </button>
              <button className="btn btn-outline-primary" onClick={() => navigate("/orders")}>
                Manage Orders
              </button>
              <button className="btn btn-outline-primary" onClick={() => navigate("/feedbackview")}>
                Review Feedback
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100 admin-panel-v2">
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
                <div className="admin-feed-v3 p-3">
                  {filteredOrders.map((o, i) => (
                    <div className="admin-feed-item-v3" key={o.id}>
                      <div className="admin-feed-head-v3">
                        <span className="chip">#{i + 1}</span>
                        <small className="text-muted">
                          {new Date(o.order_date).toLocaleDateString("en-IN")}
                        </small>
                      </div>
                      <div className="fw-semibold">{o.customer_name}</div>
                      <div className="text-muted small text-truncate">{o.product_name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 admin-panel-v2">
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
                <div className="admin-feed-v3 p-3">
                  {filteredReviews.map((r, i) => (
                    <div className="admin-feed-item-v3" key={r.id}>
                      <div className="admin-feed-head-v3">
                        <span className="chip">#{i + 1}</span>
                        <span className="small text-muted">User {r.user_id}</span>
                      </div>
                      <div className="text-muted small mb-1">{r.comments || "No comment"}</div>
                      <div>
                        {r.star_rating
                          ? [...Array(r.star_rating)].map((_, idx) => (
                              <i key={idx} className="bi bi-star-fill text-warning me-1"></i>
                            ))
                          : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <MessageDialog
        show={!!error}
        title="Dashboard Error"
        message={error}
        onClose={() => setError("")}
      />
    </section>
  );
};

export default AdminHome;
