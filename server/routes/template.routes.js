/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const { listTemplates, getTemplate } = require("../controllers/template.controller.js");

const router = express.Router();

router.get("/", listTemplates);
router.get("/:id", getTemplate);

module.exports = router;