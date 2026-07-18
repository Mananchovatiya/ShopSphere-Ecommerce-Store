import { Link } from "react-router-dom";
import "../styles/category-strip.css";

// A row of category tiles shown on the Home page.
// Icons are simple emoji so we don't need an icon library.
const CATEGORIES = [
  { slug: "electronics", name: "Electronics", icon: "🎧" },
  { slug: "fashion", name: "Fashion", icon: "👕" },
  { slug: "home", name: "Home", icon: "🏠" },
  { slug: "books", name: "Books", icon: "📚" },
  { slug: "sports", name: "Sports", icon: "🏃" },
];

function CategoryStrip() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
        </div>
        <div className="category-strip">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/shop?category=${c.slug}`}
              className="category-tile"
            >
              <div className="category-icon">{c.icon}</div>
              <div className="category-name">{c.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryStrip;
