import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import "../styles/navbar.css";

// Top navigation bar with logo, links, cart, and auth menu
function Navbar() {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner" ref={navRef}>
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">S</span>
          <span className="brand-text">ShopSphere</span>
        </Link>

        <button
          className={`menu-btn ${menuOpen ? "open" : ""}`}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/shop" onClick={() => setMenuOpen(false)}>Shop</NavLink>
          <NavLink to="/cart" onClick={() => setMenuOpen(false)}>
            Cart {itemsCount > 0 && <span className="cart-badge">{itemsCount}</span>}
          </NavLink>

          {user ? (
            <>
              <NavLink to="/account" onClick={() => setMenuOpen(false)}>
                Hi, {user.name.split(" ")[0]}
              </NavLink>
              {user.role === "admin" && (
                <NavLink to="/admin" onClick={() => setMenuOpen(false)}>
                  <span className="btn btn-outline btn-sm">Admin</span>
                </NavLink>
              )}
              <button className="btn btn-outline btn-sm"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" onClick={() => setMenuOpen(false)}>
                <span className="btn btn-primary btn-sm">Sign Up</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
