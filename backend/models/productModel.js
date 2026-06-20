const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Electronics", "Fashion", "Food", "Pharmaceutical", "Furniture", "Other"],
      default: "Other",
    },
    description: {
      type: String,
      default: "",
    },
    costPrice: {
      type: Number,
      required: [true, "Cost price is required"],
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
      min: 0,
    },
    unit: {
      type: String,
      default: "pcs", // pcs, kg, litre, box etc.
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate SKU before saving
productSchema.pre("save", async function (next) {
  try {
    if (!this.sku) {
      let sku;
      let exists = true;
      let count = await mongoose.model("Product").countDocuments();
      while (exists) {
        count++;
        sku = `PRD-${String(count).padStart(4, "0")}`;
        const existing = await mongoose.model("Product").findOne({ sku });
        if (!existing) exists = false;
      }
      this.sku = sku;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);