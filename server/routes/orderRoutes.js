/* Author: VIJAYKUMAR */
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// User routes
router.post("/", authMiddleware, orderController.createOrder);
router.get("/my-orders", authMiddleware, orderController.getUserOrders);
router.get("/:id", authMiddleware, orderController.getOrderById);

// Admin routes
router.get("/", authMiddleware, adminMiddleware, orderController.getAllOrders);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  orderController.updateOrderStatus,
);

module.exports = router;
