import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format.js";
import "../styles/product-card.css";

// Reusable product card used on Home and Shop pages
function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="product-card-img"
        />
      </div>
      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-footer">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          {product.rating > 0 && (
            <span className="product-card-rating">
              ★ {product.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
