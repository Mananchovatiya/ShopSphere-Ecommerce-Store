import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Hero from "../components/Hero.jsx";
import CategoryStrip from "../components/CategoryStrip.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";
import api from "../services/api.js";
import "../styles/home.css";

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products on mount
  useEffect(() => {
    api
      .get("/products/featured")
      .then((res) => setFeatured(res.data))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <Hero />
      <CategoryStrip />

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/shop" className="section-link">View all →</Link>
          </div>

          {loading ? (
            <Loader />
          ) : featured.length === 0 ? (
            <p className="empty-text">No products yet. Run the seed script.</p>
          ) : (
            <div className="product-grid">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section banner-section">
        <div className="container">
          <div className="offer-banner">
            <div>
              <h3>Free shipping on orders above ₹999</h3>
              <p>Cash on delivery available across India.</p>
            </div>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
