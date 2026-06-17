const express = require("express");
const router = express.Router();
const {
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
  deletePurchaseOrder,
} = require("../controllers/purchaseOrderController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", protect, getPurchaseOrders);
router.get("/:id", protect, getPurchaseOrderById);
router.post("/", protect, authorizeRoles("admin", "warehouse_manager"), createPurchaseOrder);
router.put("/:id/status", protect, authorizeRoles("admin", "warehouse_manager", "supplier"), updatePurchaseOrderStatus);
router.delete("/:id", protect, authorizeRoles("admin"), deletePurchaseOrder);

module.exports = router;
