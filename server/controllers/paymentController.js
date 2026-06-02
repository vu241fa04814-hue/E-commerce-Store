/* Author: VIJAYKUMAR */
const Razorpay = require("razorpay");
const crypto = require("crypto");

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid order amount" });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        message:
          "Razorpay credentials are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
      });
    }

    // FIX: Safely initialized on order instantiation request hook
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(Number(amount) * 100), // Clean rounding filter logic to remove floating point error codes
      currency: process.env.RAZORPAY_CURRENCY || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      message: "Razorpay order created successfully",
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay createOrder error:", error);
    const errorMessage =
      error.description ||
      error.error?.description ||
      error.message ||
      "Unable to create Razorpay order";
    const errorCode = error.error?.code || error.code || "UNKNOWN_ERROR";

    res.status(500).json({
      message: errorMessage,
      code: errorCode,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        message: "Razorpay secret is not configured.",
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Incomplete payment payload" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({ verified: true });
    }

    return res.status(400).json({ verified: false });
  } catch (error) {
    console.error("Razorpay verifyPayment error:", error);
    res.status(500).json({
      message: "Unable to verify Razorpay payment",
      error: error.message,
    });
  }
};
