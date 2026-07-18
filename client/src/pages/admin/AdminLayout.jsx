// pages/admin/AdminLayout.jsx - Sidebar layout for the admin dashboard

import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "../../styles/admin.css";

function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">S</span>
          <div>
            <div className="admin-brand-title">ShopSphere</div>
            <div className="admin-brand-sub">Admin Console</div>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
        </nav>

        <div className="admin-user">
          <div className="admin-avatar">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <div className="admin-user-name">{user?.name}</div>
            <div className="admin-user-role">Administrator</div>
          </div>
        </div>

        <Link to="/" className="admin-back">← Back to store</Link>
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}

export default AdminLayout;
