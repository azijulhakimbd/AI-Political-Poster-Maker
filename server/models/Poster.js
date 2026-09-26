/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");

const posterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      default: null,
    },
    title: { type: String, required: true, maxlength: 180 },
    formData: { type: mongoose.Schema.Types.Mixed, required: true },
    uploadedPhotoUrls: {
      type: [{ url: String, publicId: String }],
      default: [],
    },
    aiContent: { type: mongoose.Schema.Types.Mixed, default: null },
    generatedImageUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "generating", "completed", "failed"],
      default: "completed",
      index: true,
    },
    generationCount: { type: Number, default: 1, min: 1, max: 4 },
  },
  { timestamps: true }
);

posterSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model("Poster", posterSchema);