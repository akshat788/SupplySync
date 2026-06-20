const PurchaseOrder = require("../models/purchaseOrderModel");
const Inventory = require("../models/inventoryModel");

// GET all purchase orders
const getPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find()
      .populate("supplier", "name supplierCode")
      .populate("items.product", "name sku")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET single purchase order
const getPurchaseOrderById = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id)
      .populate("supplier", "name supplierCode email phone")
      .populate("items.product", "name sku unit")
      .populate("createdBy", "name email");
    if (!order) return res.status(404).json({ message: "Purchase order not found" });
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST create purchase order
const createPurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.create({
      ...req.body,
      createdBy: req.user ? req.user._id : null,
    });
    res.status(201).json({ message: "Purchase order created successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT update purchase order status
const updatePurchaseOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Purchase order not found" });

    const previousStatus = order.status;

    if (previousStatus !== status) {
      switch (status) {
        case "Shipped":
          for (const item of order.items) {
            try {
              let inventoryItem = await Inventory.findOne({ product: item.product });
              if (inventoryItem) {
                inventoryItem.inTransitStock += item.quantity;
                inventoryItem.lastUpdated = Date.now();
                await inventoryItem.save();
              } else {
                await Inventory.create({
                  product: item.product,
                  availableStock: 0,
                  reservedStock: 0,
                  inTransitStock: item.quantity,
                  warehouseLocation: "Main Warehouse",
                  minimumStockLevel: 10,
                  maximumStockLevel: 1000,
                });
              }
            } catch (invError) {
              console.error("Inventory update error (Shipped):", invError.message);
            }
          }
          break;

        case "Delivered":
          order.deliveredDate = Date.now();
          for (const item of order.items) {
            try {
              let inventoryItem = await Inventory.findOne({ product: item.product });
              if (inventoryItem) {
                inventoryItem.availableStock += item.quantity;
                inventoryItem.inTransitStock = Math.max(
                  0,
                  inventoryItem.inTransitStock - item.quantity
                );
                inventoryItem.lastUpdated = Date.now();
                await inventoryItem.save();
              } else {
                await Inventory.create({
                  product: item.product,
                  availableStock: item.quantity,
                  reservedStock: 0,
                  inTransitStock: 0,
                  warehouseLocation: "Main Warehouse",
                  minimumStockLevel: 10,
                  maximumStockLevel: 1000,
                });
              }
            } catch (invError) {
              console.error("Inventory update error (Delivered):", invError.message);
            }
          }
          break;
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: `Purchase order marked as ${status}`, order });
  } catch (error) {
    console.error("updatePurchaseOrderStatus error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE purchase order
const deletePurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Purchase order not found" });
    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Only pending orders can be deleted" });
    }
    await order.deleteOne();
    res.status(200).json({ message: "Purchase order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
  deletePurchaseOrder,
};
