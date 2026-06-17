const express = require("express");
const router = express.Router();
const {
  getInventory,
  getLowStock,
  getInventoryById,
  createInventory,
  updateInventory,
} = require("../controllers/inventoryController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", protect, getInventory);
router.get("/low-stock", protect, getLowStock);
router.get("/:id", protect, getInventoryById);
router.post("/", protect, authorizeRoles("admin", "warehouse_manager"), createInventory);
router.put("/:id", protect, authorizeRoles("admin", "warehouse_manager"), updateInventory);

module.exports = router;
