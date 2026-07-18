import { Link, useParams } from "react-router-dom";
import "../styles/order-success.css";

function OrderSuccess() {
  const { id } = useParams();
  return (
    <div className="order-success container">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1>Thank you for your order!</h1>
        <p>Your order has been placed successfully.</p>
        <p className="order-id">Order ID: <strong>{id}</strong></p>
        <p className="success-note">
          You'll pay in cash when your order is delivered. We'll contact you
          soon to confirm the delivery details.
        </p>
        <div className="success-actions">
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
          <Link to="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
