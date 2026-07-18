// routes/adminRoutes.js - All routes here require an authenticated admin

const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Apply auth guards to every admin route
router.use(protect, adminOnly);

// Dashboard
router.get("/stats", getStats);

// Products
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Categories
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Orders
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

// Users
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

module.exports = router;
