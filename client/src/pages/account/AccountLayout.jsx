// pages/account/AccountLayout.jsx - Sidebar layout shared by all dashboard pages

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "../../styles/account.css";

function AccountLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="account container">
      <aside className="account-sidebar">
        <div className="account-user">
          <div className="account-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="account-user-info">
            <div className="account-name">{user?.name}</div>
            <div className="account-email">{user?.email}</div>
          </div>
        </div>

        <nav className="account-nav">
          <NavLink to="/account/profile">Profile</NavLink>
          <NavLink to="/account/orders">My Orders</NavLink>
          <NavLink to="/account/wishlist">Wishlist</NavLink>
          <NavLink to="/account/addresses">Addresses</NavLink>
          <button className="account-logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>

      <section className="account-content">
        <Outlet />
      </section>
    </div>
  );
}

export default AccountLayout;
