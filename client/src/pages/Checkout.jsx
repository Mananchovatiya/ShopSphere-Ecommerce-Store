import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import { formatPrice } from "../utils/format.js";
import "../styles/checkout.css";

function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const shipping = subtotal > 999 ? 0 : 49;
  const total = subtotal + shipping;

  const handleChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    for (const key of ["fullName", "phone", "address", "city", "state", "postalCode"]) {
      if (!address[key].trim()) {
        setError("Please fill in all shipping fields.");
        return;
      }
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await api.post("/orders", {
        items,
        shippingAddress: address,
        paymentMethod: "COD",
      });
      clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <h2>Your cart is empty</h2>
        <button className="btn btn-primary" onClick={() => navigate("/shop")}>
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="checkout container">
      <h1 className="page-title">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="checkout-layout">
        <div className="checkout-form">
          <h3>Shipping Address</h3>
          <div className="form-grid">
            <label>
              Full name
              <input name="fullName" value={address.fullName} onChange={handleChange} required />
            </label>
            <label>
              Phone
              <input name="phone" value={address.phone} onChange={handleChange} required />
            </label>
            <label className="full">
              Address
              <input name="address" value={address.address} onChange={handleChange} required />
            </label>
            <label>
              City
              <input name="city" value={address.city} onChange={handleChange} required />
            </label>
            <label>
              State
              <input name="state" value={address.state} onChange={handleChange} required />
            </label>
            <label>
              Postal Code
              <input name="postalCode" value={address.postalCode} onChange={handleChange} required />
            </label>
            <label>
              Country
              <input name="country" value={address.country} onChange={handleChange} required />
            </label>
          </div>

          <h3>Payment Method</h3>
          <label className="radio-row">
            <input type="radio" checked readOnly />
            Cash on Delivery
          </label>

          {error && <div className="form-error">{error}</div>}
        </div>

        <aside className="checkout-summary">
          <h3>Your Order</h3>
          <ul className="checkout-items">
            {items.map((it) => (
              <li key={it.product}>
                <span>{it.name} × {it.quantity}</span>
                <span>{formatPrice(it.price * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Placing order..." : "Place Order"}
          </button>
        </aside>
      </form>
    </div>
  );
}

export default Checkout;
