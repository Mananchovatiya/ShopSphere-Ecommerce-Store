// context/WishlistContext.jsx - Wishlist state, synced with the backend.
// Only meaningful for logged-in users; guests get redirected to /login
// when they try to toggle a product.

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "./AuthContext.jsx";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [ids, setIds] = useState(new Set());

    // Load the wishlist whenever a user logs in; clear it on logout
    useEffect(() => {
        if (!user) {
            setIds(new Set());
            return;
        }
        api
            .get("/users/wishlist")
            .then((res) => setIds(new Set(res.data.map((p) => p._id))))
            .catch(() => { });
    }, [user]);

    const isWishlisted = (productId) => ids.has(productId);

    const toggleWishlist = async (product) => {
        if (!user) {
            navigate("/login");
            return;
        }

        const productId = product._id;
        const alreadyIn = ids.has(productId);

        // Optimistic update
        setIds((prev) => {
            const next = new Set(prev);
            alreadyIn ? next.delete(productId) : next.add(productId);
            return next;
        });

        try {
            if (alreadyIn) {
                await api.delete(`/users/wishlist/${productId}`);
            } else {
                await api.post(`/users/wishlist/${productId}`);
            }
        } catch {
            // Revert on failure
            setIds((prev) => {
                const next = new Set(prev);
                alreadyIn ? next.add(productId) : next.delete(productId);
                return next;
            });
        }
    };

    return (
        <WishlistContext.Provider value={{ isWishlisted, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);