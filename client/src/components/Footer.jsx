import { Link } from "react-router-dom";
import "../styles/footer.css";

// Simple, clean footer with company info and quick links
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">ShopSphere</div>
          <p className="footer-about">
            A modern MERN stack online store built as a final-year project.
            Simple, fast, and mobile-friendly.
          </p>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/shop?category=electronics">Electronics</Link></li>
            <li><Link to="/shop?category=fashion">Fashion</Link></li>
            <li><Link to="/shop?category=home">Home</Link></li>
          </ul>
        </div>
        <div>
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>support@shopsphere.dev</li>
            <li>+91 90000 00000</li>
            <li>Mumbai, India</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          &copy; {year} ShopSphere. Built with the MERN stack.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
