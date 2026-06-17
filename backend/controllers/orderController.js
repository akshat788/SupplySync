const Order = require("../models/orderModel");
const Inventory = require("../models/inventoryModel");

// GET all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("retailer", "name email organization")
      .populate("items.product", "name sku")
      .sort({ createdAt: -1 });
    res.status(200).json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("retailer", "name email organization phone")
      .populate("items.product", "name sku unit");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET orders by retailer (for retailer dashboard)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ retailer: req.user._id })
      .populate("items.product", "name sku")
      .sort({ createdAt: -1 });
    res.status(200).json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST create order (retailer places order)
const createOrder = async (req, res) => {
  try {
    // Check inventory availability for each item
    for (const item of req.body.items) {
      const inventory = await Inventory.findOne({ product: item.product });
      if (!inventory || inventory.availableStock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${item.product}`,
        });
      }
    }

    const order = await Order.create({
      ...req.body,
      retailer: req.user._id,
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT update order status (admin/warehouse manager)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // When approved → reserve stock in inventory
    if (status === "Approved") {
      for (const item of order.items) {
        const inventory = await Inventory.findOne({ product: item.product });
        if (inventory) {
          inventory.availableStock -= item.quantity;
          inventory.reservedStock += item.quantity;
          inventory.lastUpdated = Date.now();
          await inventory.save();
        }
      }
    }

    // When dispatched → move from reserved to in-transit
    if (status === "Dispatched") {
      for (const item of order.items) {
        const inventory = await Inventory.findOne({ product: item.product });
        if (inventory) {
          inventory.reservedStock = Math.max(0, inventory.reservedStock - item.quantity);
          inventory.inTransitStock += item.quantity;
          inventory.lastUpdated = Date.now();
          await inventory.save();
        }
      }
    }

    // When delivered → remove from in-transit
    if (status === "Delivered") {
      order.deliveredDate = Date.now();
      for (const item of order.items) {
        const inventory = await Inventory.findOne({ product: item.product });
        if (inventory) {
          inventory.inTransitStock = Math.max(0, inventory.inTransitStock - item.quantity);
          inventory.lastUpdated = Date.now();
          await inventory.save();
        }
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: `Order marked as ${status}`, order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE order (only if pending)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }
    await order.deleteOne();
    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  getMyOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
