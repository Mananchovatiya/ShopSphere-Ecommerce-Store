import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format.js";
import { useWishlist } from "../context/WishlistContext.jsx";
import "../styles/product-card.css";

// Reusable product card used on Home and Shop pages
function ProductCard({ product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="product-card-img"
        />
        <button
          type="button"
          className={`wishlist-btn${wishlisted ? " active" : ""}`}
          onClick={handleWishlistClick}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
          </svg>
        </button>
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