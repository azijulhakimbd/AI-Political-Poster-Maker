/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const multer = require("multer");
const { requireAuth } = require("../controllers/auth.middleware.js");
const { uploadImages } = require("../controllers/upload.controller.js");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 3 },
  fileFilter(req, file, callback) {
    const supportedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!supportedTypes.includes(file.mimetype)) {
      return callback(new Error("Upload PNG, JPG, or WEBP images only."));
    }
    return callback(null, true);
  },
});

const router = express.Router();

router.post("/", requireAuth, upload.array("photos", 3), uploadImages);

module.exports = router;