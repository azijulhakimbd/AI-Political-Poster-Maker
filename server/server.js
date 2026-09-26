/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.routes.js");
const posterRoutes = require("./routes/poster.routes.js");
const templateRoutes = require("./routes/template.routes.js");
const uploadRoutes = require("./routes/upload.routes.js");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Political Poster Maker API is running.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/posters", posterRoutes);
app.use("/api/upload", uploadRoutes);

app.use((error, req, res, next) => {
  void next;

  if (error.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: error.code === "LIMIT_FILE_SIZE"
        ? "Each image must be 5 MB or smaller."
        : "Upload up to 3 images at a time.",
    });
  }

  if (error.message === "Upload PNG, JPG, or WEBP images only.") {
    return res.status(400).json({ success: false, message: error.message });
  }

  console.error("API error:", error);
  return res.status(500).json({
    success: false,
    message: "Something went wrong.",
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error(`API startup failed: ${error.message}`);
  process.exitCode = 1;
});