// controllers/userController.js - Addresses and wishlist management

const User = require("../models/User");

/* ---------------- Addresses ---------------- */

// GET /api/users/addresses
const getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("addresses");
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/users/addresses
const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const data = req.body;

        // If this is the first address or marked default, ensure only one default
        if (data.isDefault || user.addresses.length === 0) {
            user.addresses.forEach((a) => (a.isDefault = false));
            data.isDefault = true;
        }

        user.addresses.push(data);
        await user.save();
        res.status(201).json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/users/addresses/:id
const updateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const addr = user.addresses.id(req.params.id);
        if (!addr) return res.status(404).json({ message: "Address not found" });

        Object.assign(addr, req.body);

        if (req.body.isDefault) {
            user.addresses.forEach((a) => {
                if (a._id.toString() !== addr._id.toString()) a.isDefault = false;
            });
        }

        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/users/addresses/:id
const deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const addr = user.addresses.id(req.params.id);
        if (!addr) return res.status(404).json({ message: "Address not found" });

        const wasDefault = addr.isDefault;
        addr.deleteOne();

        // Promote first remaining address to default if we removed the default one
        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ---------------- Wishlist ---------------- */

// GET /api/users/wishlist - returns full product docs
const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishlist");
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/users/wishlist/:productId
const addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { productId } = req.params;

        if (!user.wishlist.some((id) => id.toString() === productId)) {
            user.wishlist.push(productId);
            await user.save();
        }

        res.json({ wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/users/wishlist/:productId
const removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { productId } = req.params;

        user.wishlist = user.wishlist.filter(
            (id) => id.toString() !== productId
        );
        await user.save();

        res.json({ wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
};
