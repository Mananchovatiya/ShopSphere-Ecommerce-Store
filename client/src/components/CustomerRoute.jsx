// components/CustomerRoute.jsx
// Blocks logged-in admins from customer-facing pages (Home, Shop, Cart,
// Checkout, Account shopping pages, Login/Register, etc). Admins are
// redirected to /admin instead. Regular users and guests pass through.

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "./Loader.jsx";

function CustomerRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <Loader />;
    if (user?.role === "admin") {
        return <Navigate to="/admin" replace />;
    }
    return children;
}

export default CustomerRoute;