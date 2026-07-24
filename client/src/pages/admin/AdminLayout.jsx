// pages/admin/AdminLayout.jsx - Sidebar layout for the admin dashboard

import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "../../styles/admin.css";

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-page-shell">
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

          <Link to="/admin/profile" className="admin-user" title="Edit your profile">
            <div className="admin-avatar">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <div className="admin-user-name">{user?.name}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </Link>

          <button className="admin-logout" onClick={handleLogout}>
            Logout
          </button>
        </aside>

        <section className="admin-content">
          <div className="admin-page">
            <Outlet />
          </div>
        </section>
      </div>

      <footer className="admin-footer">
        © {year} ShopSphere Admin Console
      </footer>
    </div>
  );
}

export default AdminLayout;