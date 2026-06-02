/* Author: VIJAYKUMAR */
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/:id/review", authMiddleware, productController.addReview);

// Admin routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  productController.createProduct,
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.updateProduct,
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct,
);

module.exports = router;
