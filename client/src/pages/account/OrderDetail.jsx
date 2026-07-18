// pages/account/OrderDetail.jsx - Detailed view of a single order

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api.js";
import Loader from "../../components/Loader.jsx";
import { formatPrice } from "../../utils/format.js";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch((e) => setErr(e.response?.data?.message || "Failed to load order"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Loading order..." />;
  if (err) return <div className="form-error">{err}</div>;
  if (!order) return null;

  const a = order.shippingAddress;

  return (
    <div>
      <Link to="/account/orders" className="section-link">← Back to orders</Link>

      <h1 className="page-title" style={{ marginTop: "0.75rem" }}>
        Order #{order._id.slice(-6).toUpperCase()}
      </h1>
      <p className="page-subtitle">
        Placed on {new Date(order.createdAt).toLocaleString()} ·{" "}
        <span className={`order-status status-${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </p>

      <div className="card">
        <h3>Items</h3>
        <ul className="detail-items">
          {order.items.map((it) => (
            <li key={it.product}>
              {it.image && <img src={it.image} alt={it.name} />}
              <div className="detail-info">
                <div className="detail-name">{it.name}</div>
                <div className="detail-meta">Qty: {it.quantity}</div>
              </div>
              <div className="detail-price">
                {formatPrice(it.price * it.quantity)}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="detail-grid">
        <div className="card">
          <h3>Shipping Address</h3>
          <p>
            {a.fullName}<br />
            {a.address}<br />
            {a.city}, {a.state} {a.postalCode}<br />
            {a.country}<br />
            Phone: {a.phone}
          </p>
        </div>

        <div className="card">
          <h3>Payment Summary</h3>
          <div className="summary-row">
            <span>Payment</span><span>{order.paymentMethod}</span>
          </div>
          <div className="summary-row">
            <span>Items</span><span>{formatPrice(order.itemsPrice)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{order.shippingPrice === 0 ? "Free" : formatPrice(order.shippingPrice)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span><span>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
