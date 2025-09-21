const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const adminRoutes = require("./routes/authRoutes");
const slideRoutes = require("./routes/slideRoutes");
const faqRoutes = require("./routes/faqRoutes");
const projectRoutes = require("./routes/projectRoutes");
const formRoutes = require("./routes/formRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ---------------- Middleware ----------------
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ---------------- Serve Uploads ----------------
// Uploaded files (PDFs, images) accessible publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------- Routes ----------------
app.use("/api/admin", adminRoutes);
app.use("/api/slides", slideRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/forms", formRoutes);

// ---------------- Default Route ----------------
app.get("/", (req, res) => {
  res.send("API is running...");
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
  });

// ---------------- Global Error Handler ----------------
app.use(errorHandler);

// ---------------- Fallback Error Handler ----------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});
