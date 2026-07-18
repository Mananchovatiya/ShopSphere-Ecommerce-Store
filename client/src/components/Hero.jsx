import { Link } from "react-router-dom";
import "../styles/hero.css";

// Hero section shown on the Home page
function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <span className="hero-badge">New season, new arrivals</span>
          <h1 className="hero-title">
            Discover products <br /> you'll actually love.
          </h1>
          <p className="hero-subtitle">
            Curated electronics, fashion, and everyday essentials — all in one
            simple online store.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary">Shop Now</Link>
            <Link to="/shop?sort=rating" className="btn btn-outline">
              Best Sellers
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900"
            alt="Featured products"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
