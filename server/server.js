// Author: VIJAYKUMAR
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files from the client folder
app.use(express.static(path.join(__dirname, "../client")));

// Connect to Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    message: "E-commerce API Running",
    version: "1.0.0",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// 404 handler
app.use((req, res) => {
  // If request is not for API, serve the client index (single-page or static pages)
  if (!req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, '../client/index.html'));
  }

  res.status(404).json({
    message: "Endpoint not found",
  });
});

const PORT = process.env.PORT || 5000;

// HTTPS Setup
const USE_HTTPS = process.env.USE_HTTPS === "true";

if (USE_HTTPS) {
  const options = {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem"),
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server running on https://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`HTTP Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
}
