/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const { requireAuth } = require("../controllers/auth.middleware.js");
const {
  createPoster,
  listUserPosters,
  getPoster,
  updatePoster,
  reserveRegeneration,
  deletePoster,
  markGeneration,
} = require("../controllers/poster.controller.js");

const router = express.Router();

router.use(requireAuth);
router.post("/", createPoster);
router.get("/user/:userId", listUserPosters);
router.get("/:id", getPoster);
router.patch("/:id", updatePoster);
router.post("/:id/regenerate", reserveRegeneration);
router.patch("/:id/generation-result", markGeneration);
router.delete("/:id", deletePoster);

module.exports = router;