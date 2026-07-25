// controllers/adminController.js - Admin-only endpoints for stats, products,
// categories, orders and users. All routes here are already guarded by
// `protect + adminOnly` in routes/adminRoutes.js.

const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const User = require("../models/User");

/* ------------------------------ Dashboard ------------------------------ */

// GET /api/admin/stats?days=7|30|90 - Top-level KPIs + recent orders + revenue by day
const getStats = async (req, res) => {
  try {
    const allowedRanges = [7, 30, 90];
    const days = allowedRanges.includes(Number(req.query.days))
      ? Number(req.query.days)
      : 7;

    const [totalProducts, totalUsers, totalOrders, revenueAgg, recentOrders] =
      await Promise.all([
        Product.countDocuments(),
        User.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { status: { $ne: "Cancelled" } } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
        Order.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("user", "name email"),
      ]);

    // Revenue grouped by day for the selected range
    const since = new Date();
    since.setDate(since.getDate() - (days - 1));
    since.setHours(0, 0, 0, 0);

    const revenueAggByDay = await Order.aggregate([
      { $match: { createdAt: { $gte: since }, status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
    ]);
    const revenueMap = new Map(revenueAggByDay.map((d) => [d._id, d]));

    // Fill in every day in the range (even with no orders) so the chart
    // renders as a continuous set of bars instead of only sparse days.
    const revenueByDay = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const match = revenueMap.get(key);
      revenueByDay.push({
        _id: key,
        total: match?.total || 0,
        count: match?.count || 0,
      });
    }

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      recentOrders,
      revenueByDay,
      rangeDays: days,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------------------ Products ------------------------------- */

// POST /api/admin/products
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/admin/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/admin/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ----------------------------- Categories ------------------------------ */

// POST /api/admin/categories
const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/admin/categories/:id
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/admin/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------------------- Orders -------------------------------- */

// GET /api/admin/orders - list every order in the store
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/orders/:id/status - update the fulfillment status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Placed", "Shipped", "Delivered", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------------------- Users -------------------------------- */

// GET /api/admin/users - list all registered users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -addresses -wishlist")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/users/:id/role - promote or demote a user
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Prevent an admin from demoting themselves (avoid getting locked out)
    if (req.user._id.toString() === req.params.id && role !== "admin") {
      return res
        .status(400)
        .json({ message: "You cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole,
  deleteUser,
};