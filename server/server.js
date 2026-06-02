// Author: VIJAYKUMAR
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const Product = require("./models/Product");

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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/login.html"));
});

// Serve frontend static files from the client folder
app.use(express.static(path.join(__dirname, "../client")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// Health Check
app.get("/api/health", (req, res) => {
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

const seedProducts = async () => {
  const existingProducts = await Product.countDocuments();
  if (existingProducts > 0) return;

  await Product.insertMany([
    {
      name: "Dell Inspiron Laptop",
      description:
        "A reliable everyday laptop with a fast processor, crisp display, and long battery life.",
      price: 55000,
      category: "Electronics",
      image:
        "https://dellstatic.luroconnect.com/media/catalog/product/cache/74ae05ef3745aec30d7f5a287debd7f5/c/d/cda16250cto04rino-1.jpg",
      stock: 12,
      discount: 8,
    },
    {
      name: "iPhone 17",
      description:
        "A premium smartphone with an advanced camera system, OLED display, and powerful AI chip.",
      price: 75000,
      category: "Electronics",
      image:
        "https://m-cdn.phonearena.com/images/hub/372-wide-two_1200/Apple-iPhone-16-release-date-price-and-features.jpg",
      stock: 9,
      discount: 5,
    },
    {
      name: "Apple Watch",
      description:
        "A smart fitness watch with activity tracking, notifications, and a durable water-resistant design.",
      price: 5000,
      category: "Electronics",
      image: "https://www.apple.com/assets-www/en_IN/watch1/og/watch_og_c64ec6c67.png",
      stock: 20,
      discount: 0,
    },
    {
      name: "Studio Headphones",
      description:
        "Comfortable headphones with high-fidelity audio, padded ear cups, and noise isolation.",
      price: 3000,
      category: "Electronics",
      image:
        "https://dfnqgzctqh74q.cloudfront.net/files/68f605fc50b0fb0002dd0278/beyerdynamic-DJKopfhoerer-Startseite-XS-50_50-Produktlaunch-DJ300ProXClub-EN.jpg",
      stock: 18,
      discount: 12,
    },
  ]);

  console.log("Seeded starter products");
};

// HTTPS Setup
const USE_HTTPS = process.env.USE_HTTPS === "true";

const startServer = async () => {
  await connectDB();
  await seedProducts();

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
};

startServer().catch((error) => {
  console.error("Unable to start server:", error);
  process.exit(1);
});
