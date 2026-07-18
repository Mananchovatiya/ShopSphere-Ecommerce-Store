// routes/userRoutes.js - Addresses + wishlist endpoints (all protected)

const express = require("express");
const router = express.Router();

const {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Addresses
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:id", protect, updateAddress);
router.delete("/addresses/:id", protect, deleteAddress);

// Wishlist
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:productId", protect, addToWishlist);
router.delete("/wishlist/:productId", protect, removeFromWishlist);

module.exports = router;
