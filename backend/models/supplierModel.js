const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
    },
    supplierCode: {
      type: String,
      unique: true,
      trim: true,
    },
    contactPerson: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    products: [
      {
        type: String, // product categories or names supplied
      },
    ],
    performanceScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    onTimeDelivery: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    qualityScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
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

// Auto-generate supplier code before saving
supplierSchema.pre("save", async function (next) {
  if (!this.supplierCode) {
    const count = await mongoose.model("Supplier").countDocuments();
    this.supplierCode = `SUP-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports =
  mongoose.models.Supplier ||
  mongoose.model("Supplier", supplierSchema);