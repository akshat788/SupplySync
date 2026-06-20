const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    warehouseLocation: {
      type: String,
      default: "Main Warehouse",
    },
    availableStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    reservedStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    inTransitStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    minimumStockLevel: {
      type: Number,
      default: 10, // trigger low stock alert below this
    },
    maximumStockLevel: {
      type: Number,
      default: 1000,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field: total stock
inventorySchema.virtual("totalStock").get(function () {
  return this.availableStock + this.reservedStock + this.inTransitStock;
});

// Virtual field: is low stock
inventorySchema.virtual("isLowStock").get(function () {
  return this.availableStock <= this.minimumStockLevel;
});

module.exports =
  mongoose.models.Inventory ||
  mongoose.model("Inventory", inventorySchema);