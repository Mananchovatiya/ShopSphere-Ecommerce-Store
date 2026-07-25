// pages/admin/AdminUsers.jsx - List users, toggle admin role, delete users

import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  const toggleRole = async (u) => {
    const nextRole = u.role === "admin" ? "user" : "admin";
    if (!confirm(`Change ${u.name}'s role to ${nextRole}?`)) return;
    try {
      const { data } = await api.put(`/admin/users/${u._id}/role`, {
        role: nextRole,
      });
      setUsers((prev) => prev.map((x) => (x._id === u._id ? data : x)));
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async (u) => {
    if (!confirm(`Delete user ${u.email}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${u._id}`);
      setUsers((prev) => prev.filter((x) => x._id !== u._id));
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div>
      <h1 className="page-title">Users</h1>
      <p className="page-subtitle">Manage registered customers and admins.</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card no-pad">
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isMe = me?._id === u._id;
                  return (
                    <tr key={u._id}>
                      <td className="cell-name">
                        {u.name} {isMe && <span className="badge-default">You</span>}
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          className={`order-status ${u.role === "admin" ? "status-shipped" : "status-placed"
                            }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => toggleRole(u)}
                            disabled={isMe}
                          >
                            {u.role === "admin" ? "Demote" : "Promote"}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(u)}
                            disabled={isMe}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty">No users found.</td>
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

export default AdminUsers;