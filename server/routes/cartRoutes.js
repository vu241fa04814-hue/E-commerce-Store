/* Author: VIJAYKUMAR */
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authMiddleware } = require("../middleware/auth");

router.use(authMiddleware);

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.post("/remove", cartController.removeFromCart);
router.put("/update", cartController.updateCartItem);
router.delete("/clear", cartController.clearCart);

module.exports = router;
