const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", protect, getProducts);
router.get("/:id", protect, getProductById);
router.post("/", protect, authorizeRoles("admin", "supplier"), createProduct);
router.put("/:id", protect, authorizeRoles("admin", "supplier"), updateProduct);
router.delete("/:id", protect, authorizeRoles("admin"), deleteProduct);

module.exports = router;
