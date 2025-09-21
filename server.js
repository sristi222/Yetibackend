const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// ---------------- Import Routes ----------------
const adminRoutes = require("./routes/authRoutes");
const slideRoutes = require("./routes/slideRoutes");
const faqRoutes = require("./routes/faqRoutes");
const projectRoutes = require("./routes/projectRoutes");
const formRoutes = require("./routes/formRoutes");
const popupRoutes = require("./routes/popupRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const marqueeRoutes = require("./routes/marqueeRoutes"); // New Marquee CRUD

// ---------------- Middleware ----------------
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ---------------- Middleware ----------------
// Enable CORS for frontend
app.use(cors());

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

// ---------------- Routes ----------------
app.use("/api/admin", adminRoutes);
app.use("/api/slides", slideRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/popup", popupRoutes);
app.use("/api/gallery", galleryRoutes);

// Marquee CRUD Routes
app.use("/api/marquee", marqueeRoutes);

// ---------------- Default Route ----------------
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// ---------------- MongoDB Connection ----------------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ---------------- Error Handlers ----------------
// Global error handler middleware
app.use(errorHandler);

// Fallback error handler for uncaught errors
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});
