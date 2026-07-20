// pages/admin/AdminOrders.jsx - View every order and change its status

import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { formatCurrency } from "../../utils/format.js";

const STATUSES = ["Placed", "Shipped", "Delivered", "Cancelled"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api
      .get("/admin/orders")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/admin/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update status");
    }
  };

  const visible =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <h1 className="page-title">Orders</h1>
      <p className="page-subtitle">Manage and fulfill customer orders.</p>

      <div className="admin-toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className="muted">{visible.length} order(s)</div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card no-pad">
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((o) => (
                  <tr key={o._id}>
                    <td>#{o._id.slice(-6)}</td>
                    <td>
                      <div className="cell-name">{o.user?.name || "—"}</div>
                      <div className="cell-sub">{o.user?.email}</div>
                    </td>
                    <td>{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
                    <td>{formatCurrency(o.totalPrice)}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatus(o._id, e.target.value)}
                        className={`status-select status-${o.status.toLowerCase()}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;