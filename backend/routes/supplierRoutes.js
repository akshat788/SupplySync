const express = require("express");
const router = express.Router();
const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", protect, getSuppliers);
router.get("/:id", protect, getSupplierById);
router.post("/", protect, authorizeRoles("admin", "warehouse_manager"), createSupplier);
router.put("/:id", protect, authorizeRoles("admin", "warehouse_manager"), updateSupplier);
router.delete("/:id", protect, authorizeRoles("admin"), deleteSupplier);

module.exports = router;
