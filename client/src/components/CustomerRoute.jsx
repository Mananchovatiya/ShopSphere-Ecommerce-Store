import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const CustomerRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <Loader />;

    if (user?.role === "admin") {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default CustomerRoute;