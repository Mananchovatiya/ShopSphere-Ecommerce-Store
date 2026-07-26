// pages/admin/Dashboard.jsx - KPI cards + revenue chart (7/30/90 day range) + recent orders

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import { formatCurrency } from "../../utils/format.js";

const RANGE_OPTIONS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [range, setRange] = useState(7);

  useEffect(() => {
    setLoading(true);
    setErr("");
    api
      .get(`/admin/stats?days=${range}`)
      .then((res) => setStats(res.data))
      .catch((e) => setErr(e.response?.data?.message || "Failed to load stats"))
      .finally(() => setLoading(false));
  }, [range]);

  // Only show every Nth bar label so 30/90-day views don't get crowded
  const labelStep = range <= 7 ? 1 : range <= 30 ? 5 : 10;
  const maxRevenue = stats
    ? Math.max(1, ...stats.revenueByDay.map((d) => d.total))
    : 1;

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">
        High-level view of your store performance.
      </p>

      {err && <p className="form-error">{err}</p>}
      {!stats && loading && <p className="muted">Loading dashboard...</p>}

      {stats && (
        <>
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
            <div className="card-head">
              <h3>Revenue - last {range} days</h3>
              <div className="range-toggle">
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.days}
                    className={opt.days === range ? "active" : ""}
                    onClick={() => setRange(opt.days)}
                    disabled={loading}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <p className="muted">Loading chart...</p>
            ) : stats.revenueByDay.every((d) => d.total === 0) ? (
              <p className="muted">No orders in this period.</p>
            ) : (
              <div className={`chart-wrap${range > 7 ? " chart-wrap-dense" : ""}`}>
                <div className="chart-bars-row">
                  {stats.revenueByDay.map((d) => (
                    <div
                      key={d._id}
                      className={`chart-bar${d.total === 0 ? " chart-bar-empty" : ""}`}
                      style={{
                        height: d.total === 0 ? "2px" : `${(d.total / maxRevenue) * 100}%`,
                      }}
                      title={`${d._id}: ${formatCurrency(d.total)} (${d.count} order${d.count === 1 ? "" : "s"})`}
                    ></div>
                  ))}
                </div>
                <div className="chart-ticks-row">
                  {stats.revenueByDay.map((d, i) => (
                    <div
                      key={d._id}
                      className="chart-tick-col"
                      style={{ visibility: i % labelStep === 0 ? "visible" : "hidden" }}
                    >
                      <div className="chart-bar-tick"></div>
                    </div>
                  ))}
                </div>
                <div className="chart-labels-row">
                  {stats.revenueByDay.map((d, i) => {
                    const [, mm, dd] = d._id.split("-");
                    return (
                      <div
                        key={d._id}
                        className="chart-bar-label"
                        style={{ visibility: i % labelStep === 0 ? "visible" : "hidden" }}
                      >
                        {`${dd}-${mm}`}
                      </div>
                    );
                  })}
                </div>
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
        </>
      )}
    </div>
  );
}

export default Dashboard;