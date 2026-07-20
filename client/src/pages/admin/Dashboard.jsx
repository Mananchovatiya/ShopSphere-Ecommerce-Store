// pages/admin/Dashboard.jsx - KPI cards + recent orders + 7-day revenue bars

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import { formatCurrency } from "../../utils/format.js";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((e) => setErr(e.response?.data?.message || "Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (err) return <p className="form-error">{err}</p>;
  if (!stats) return null;

  const maxRevenue = Math.max(
    1,
    ...stats.revenueByDay.map((d) => d.total)
  );

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">
        High-level view of your store performance.
      </p>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Revenue</div>
          <div className="kpi-value">{formatCurrency(stats.totalRevenue)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Orders</div>
          <div className="kpi-value">{stats.totalOrders}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Products</div>
          <div className="kpi-value">{stats.totalProducts}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Users</div>
          <div className="kpi-value">{stats.totalUsers}</div>
        </div>
      </div>

      <div className="card">
        <h3>Revenue - last 7 days</h3>
        {stats.revenueByDay.length === 0 ? (
          <p className="muted">No orders in the last 7 days.</p>
        ) : (
          <div className="chart-bars">
            {stats.revenueByDay.map((d) => (
              <div key={d._id} className="chart-bar-col">
                <div
                  className="chart-bar"
                  style={{ height: `${(d.total / maxRevenue) * 100}%` }}
                  title={formatCurrency(d.total)}
                ></div>
                <div className="chart-bar-label">{d._id.slice(5)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Recent Orders</h3>
          <Link to="/admin/orders" className="link">View all →</Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="muted">No orders yet.</p>
        ) : (
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td>#{o._id.slice(-6)}</td>
                    <td>{o.user?.name || "—"}</td>
                    <td>{formatCurrency(o.totalPrice)}</td>
                    <td>
                      <span className={`order-status status-${o.status.toLowerCase()}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;