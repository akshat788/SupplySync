const Inventory = require("../models/inventoryModel");

// GET all inventory
const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate("product", "name sku category unit")
      .sort({ createdAt: -1 });
    res.status(200).json({ count: inventory.length, inventory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET low stock items
const getLowStock = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("product", "name sku category");
    const lowStock = inventory.filter(
      (item) => item.availableStock <= item.minimumStockLevel
    );
    res.status(200).json({ count: lowStock.length, lowStock });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET single inventory item
const getInventoryById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id).populate("product", "name sku category unit");
    if (!item) return res.status(404).json({ message: "Inventory item not found" });
    res.status(200).json({ item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST create inventory entry
const createInventory = async (req, res) => {
  try {
    // Check if inventory for this product already exists
    const existing = await Inventory.findOne({ product: req.body.product });
    if (existing) {
      return res.status(400).json({
        message: "Inventory for this product already exists. Use update instead.",
      });
    }
    const item = await Inventory.create(req.body);
    res.status(201).json({ message: "Inventory created successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT update inventory (adjust stock)
const updateInventory = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: "Inventory item not found" });
    res.status(200).json({ message: "Inventory updated successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getInventory, getLowStock, getInventoryById, createInventory, updateInventory };
