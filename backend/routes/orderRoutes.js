const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrderById,
  getMyOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", protect, authorizeRoles("admin", "warehouse_manager"), getOrders);
router.get("/my-orders", protect, authorizeRoles("retailer"), getMyOrders);
router.get("/:id", protect, getOrderById);
router.post("/", protect, authorizeRoles("retailer"), createOrder);
router.put("/:id/status", protect, authorizeRoles("admin", "warehouse_manager"), updateOrderStatus);
router.delete("/:id", protect, authorizeRoles("retailer", "admin"), deleteOrder);

module.exports = router;
