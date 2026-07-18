import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Loader from "../components/Loader.jsx";
import api from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";
import "../styles/product-details.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedMsg("Added to cart!");
    setTimeout(() => setAddedMsg(""), 1800);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate("/cart");
  };

  if (loading) return <Loader />;
  if (!product) {
    return (
      <div className="container empty-state">
        <h3>Product not found</h3>
        <button className="btn btn-primary" onClick={() => navigate("/shop")}>
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="product-details container">
      <div className="pd-grid">
        <div className="pd-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="pd-info">
          <div className="pd-category">{product.category}</div>
          <h1 className="pd-name">{product.name}</h1>

          <div className="pd-rating">
            ★ {product.rating.toFixed(1)} ({product.numReviews} reviews)
          </div>

          <div className="pd-price">{formatPrice(product.price)}</div>

          <p className="pd-description">{product.description}</p>

          <div className="pd-specs">
            <div><span>Brand:</span> {product.brand || "—"}</div>
            <div>
              <span>Availability:</span>{" "}
              {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
            </div>
          </div>

          <div className="pd-quantity">
            <label>Quantity:</label>
            <div className="qty-control">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
          </div>

          <div className="pd-actions">
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
            <button
              className="btn btn-outline"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>

          {addedMsg && <div className="pd-toast">{addedMsg}</div>}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
