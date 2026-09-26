/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    occasionType: { type: String, required: true, index: true },
    description: { type: String, default: "" },
    theme: { type: String, default: "green" },
    layoutConfig: { type: mongoose.Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Template", templateSchema);