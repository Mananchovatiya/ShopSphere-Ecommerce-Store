// components/CustomerRoute.jsx
// Blocks logged-in admins from customer-facing pages (Home, Shop, Cart,
// Checkout, Account shopping pages, Login/Register, etc). Admins see a
// "page not found" instead of being redirected, since these routes
// genuinely don't exist for an admin account. Regular users and guests
// pass through normally.

import { useAuth } from "../context/AuthContext.jsx";
import Loader from "./Loader.jsx";
import NotFound from "../pages/NotFound.jsx";

function CustomerRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <Loader />;
    if (user?.role === "admin") {
        return <NotFound />;
    }
    return children;
}

export default CustomerRoute;