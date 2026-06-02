/* Author: VIJAYKUMAR */
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.get("/", (req, res) => {
  res.json({
    message: "Razorpay payment routes are available",
    endpoints: ["POST /create-order", "POST /verify"],
  });
});

router.post("/create-order", paymentController.createOrder);

// FIX: Perfectly paired route mapping matching the target frontend signature fetch hook
router.post("/verify", paymentController.verifyPayment);

module.exports = router;
