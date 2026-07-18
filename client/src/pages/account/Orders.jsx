// pages/account/Orders.jsx - List of the user's past orders

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import Loader from "../../components/Loader.jsx";
import { formatPrice } from "../../utils/format.js";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    api
      .get("/orders/mine")
      .then((res) => setOrders(res.data))
      .catch((e) => setErr(e.response?.data?.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading orders..." />;
  if (err) return <div className="form-error">{err}</div>;

  return (
    <div>
      <h1 className="page-title">My Orders</h1>
      <p className="page-subtitle">Track and review your past purchases.</p>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((o) => (
            <Link to={`/account/orders/${o._id}`} key={o._id} className="order-row">
              <div>
                <div className="order-id">Order #{o._id.slice(-6).toUpperCase()}</div>
                <div className="order-meta">
                  {new Date(o.createdAt).toLocaleDateString()} ·{" "}
                  {o.items.length} item{o.items.length > 1 ? "s" : ""}
                </div>
              </div>
              <div className="order-right">
                <span className={`order-status status-${o.status.toLowerCase()}`}>
                  {o.status}
                </span>
                <div className="order-total">{formatPrice(o.totalPrice)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
