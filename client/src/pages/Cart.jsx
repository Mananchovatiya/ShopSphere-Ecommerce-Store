import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";
import "../styles/cart.css";

function Cart() {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [discount, setDiscount] = useState(0);

  // Very simple demo coupon logic - purely client side
  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SHOP10") {
      setDiscount(Math.round(subtotal * 0.1));
      setCouponMsg("Coupon applied: 10% off");
    } else {
      setDiscount(0);
      setCouponMsg("Invalid coupon code");
    }
  };

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 49;
  const total = Math.max(0, subtotal - discount) + shipping;

  if (items.length === 0) {
    return (
      <div className="cart container empty-state">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart container">
      <h1 className="page-title">Your Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((it) => (
            <div key={it.product} className="cart-item">
              <img src={it.image} alt={it.name} />
              <div className="cart-item-info">
                <Link to={`/product/${it.product}`} className="cart-item-name">
                  {it.name}
                </Link>
                <div className="cart-item-price">{formatPrice(it.price)}</div>
              </div>
              <div className="qty-control">
                <button onClick={() => updateQuantity(it.product, it.quantity - 1)}>−</button>
                <span>{it.quantity}</span>
                <button onClick={() => updateQuantity(it.product, it.quantity + 1)}>+</button>
              </div>
              <div className="cart-item-total">
                {formatPrice(it.price * it.quantity)}
              </div>
              <button
                className="cart-item-remove"
                onClick={() => removeFromCart(it.product)}
                aria-label="Remove item"
              >
                ✕
              </button>
            </div>
          ))}

          <button className="btn btn-outline" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          {discount > 0 && (
            <div className="summary-row">
              <span>Discount</span>
              <span>− {formatPrice(discount)}</span>
            </div>
          )}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <div className="coupon">
            <input
              type="text"
              placeholder="Coupon code (try SHOP10)"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button className="btn btn-outline btn-sm" onClick={applyCoupon}>
              Apply
            </button>
          </div>
          {couponMsg && <div className="coupon-msg">{couponMsg}</div>}

          <button
            className="btn btn-primary btn-block"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
