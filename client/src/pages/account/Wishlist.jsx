// pages/account/Wishlist.jsx - Products the user has saved

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import Loader from "../../components/Loader.jsx";
import { formatPrice } from "../../utils/format.js";
import { useCart } from "../../context/CartContext.jsx";

function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    api
      .get("/users/wishlist")
      .then((res) => setItems(res.data))
      .catch((e) => setErr(e.response?.data?.message || "Failed to load wishlist"))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/users/wishlist/${productId}`);
      setItems((prev) => prev.filter((p) => p._id !== productId));
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to remove");
    }
  };

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    handleRemove(product._id);
  };

  if (loading) return <Loader label="Loading wishlist..." />;
  if (err) return <div className="form-error">{err}</div>;

  return (
    <div>
      <h1 className="page-title">Wishlist</h1>
      <p className="page-subtitle">Products you've saved for later.</p>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Your wishlist is empty.</p>
          <Link to="/shop" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map((p) => (
            <div key={p._id} className="wishlist-card">
              <Link to={`/product/${p._id}`}>
                <img src={p.image} alt={p.name} />
              </Link>
              <div className="wishlist-info">
                <Link to={`/product/${p._id}`} className="wishlist-name">
                  {p.name}
                </Link>
                <div className="wishlist-price">{formatPrice(p.price)}</div>
                <div className="wishlist-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleMoveToCart(p)}
                    disabled={p.stock === 0}
                  >
                    {p.stock === 0 ? "Out of stock" : "Add to Cart"}
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleRemove(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
