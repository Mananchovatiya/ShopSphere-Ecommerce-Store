// controllers/orderController.js

const Order = require("../models/Order");
const Product = require("../models/Product");

// POST /api/orders  (protected)
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // Look up the real products in the DB - never trust price/name/image
    // sent from the client, since cart state can be edited in devtools.
    const productIds = items.map((it) => it.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const orderItems = items.map((it) => {
      const product = productMap.get(it.product);
      if (!product) {
        throw new Error(`Product ${it.product} no longer exists`);
      }

      const quantity = Number(it.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error(`Invalid quantity for ${product.name}`);
      }
      if (product.stock < quantity) {
        throw new Error(`Not enough stock for ${product.name}`);
      }

      return {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price, // DB price, ignoring whatever the client sent
        quantity,
      };
    });

    const itemsPrice = orderItems.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    );
    const shippingPrice = itemsPrice > 999 ? 0 : 49;
    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    // Decrement stock now that the order is placed
    await Promise.all(
      orderItems.map((it) =>
        Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.quantity } })
      )
    );

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/orders/mine  (protected)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/:id  (protected, owner only)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById };