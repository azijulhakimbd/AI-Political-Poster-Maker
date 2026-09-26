/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");
const Poster = require("../models/Poster.js");
const Template = require("../models/Template.js");

const MAX_REGENERATIONS = 3;

const validFormData = (value) => (
  value &&
  typeof value === "object" &&
  typeof value.name === "string" &&
  value.name.trim().length > 0 &&
  value.name.length <= 100 &&
  typeof value.occasion === "string" &&
  value.occasion.trim().length > 0 &&
  value.occasion.length <= 100
);

const safePhotoAssets = (value, userId) => {
  if (!Array.isArray(value) || value.length > 3) return null;

  const assets = value.map((item) => ({
    url: typeof item?.url === "string" ? item.url : "",
    publicId: typeof item?.publicId === "string" ? item.publicId : "",
  }));

  const expectedFolder = `poster-maker/${userId}/`;
  if (assets.some((item) => (
    !item.url.startsWith("https://res.cloudinary.com/") ||
    !item.publicId.startsWith(expectedFolder)
  ))) return null;
  return assets;
};

const getOwnedPoster = (posterId, user) => {
  if (!mongoose.isValidObjectId(posterId)) return null;

  const filter = { _id: posterId };
  if (user.role !== "admin") filter.userId = user.id;
  return Poster.findOne(filter);
};

const createPoster = async (req, res) => {
  const { formData, aiContent, templateId, generatedImageUrl = "" } = req.body || {};
  const photoAssets = safePhotoAssets(req.body?.uploadedPhotoUrls || [], req.user.id);

  if (!validFormData(formData) || !photoAssets) {
    return res.status(400).json({
      success: false,
      message: "Poster details or uploaded images are invalid.",
    });
  }

  const poster = await Poster.create({
    userId: req.user.id,
    templateId: templateId
      ? (await Template.findOne(
        mongoose.isValidObjectId(templateId)
          ? { _id: templateId }
          : { key: templateId }
      ))?._id || null
      : null,
    title: `${formData.occasion} - ${formData.name}`.slice(0, 180),
    formData,
    uploadedPhotoUrls: photoAssets,
    aiContent: aiContent || null,
    generatedImageUrl: typeof generatedImageUrl === "string" ? generatedImageUrl : "",
    status: "completed",
    generationCount: 1,
  });

  return res.status(201).json({ success: true, data: poster });
};

const listUserPosters = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    return res.status(400).json({ success: false, message: "Invalid user ID." });
  }

  if (req.user.role !== "admin" && req.params.userId !== req.user.id) {
    return res.status(403).json({ success: false, message: "Access denied." });
  }

  const posters = await Poster.find({ userId: req.params.userId })
    .sort({ updatedAt: -1 })
    .limit(100)
    .select("title formData.occasion formData.name status uploadedPhotoUrls aiContent generationCount createdAt updatedAt")
    .lean();

  return res.json({ success: true, data: posters });
};

const getPoster = async (req, res) => {
  const poster = await getOwnedPoster(req.params.id, req.user);

  if (!poster) {
    return res.status(404).json({ success: false, message: "Poster not found." });
  }

  return res.json({ success: true, data: poster });
};

const updatePoster = async (req, res) => {
  const poster = await getOwnedPoster(req.params.id, req.user);

  if (!poster) {
    return res.status(404).json({ success: false, message: "Poster not found." });
  }

  const { formData, aiContent, uploadedPhotoUrls, templateId } = req.body || {};
  const photoAssets = safePhotoAssets(uploadedPhotoUrls || [], req.user.id);

  if (!validFormData(formData) || !photoAssets) {
    return res.status(400).json({
      success: false,
      message: "Poster details or uploaded images are invalid.",
    });
  }

  poster.formData = formData;
  poster.title = `${formData.occasion} - ${formData.name}`.slice(0, 180);
  poster.aiContent = aiContent || null;
  poster.uploadedPhotoUrls = photoAssets;
  poster.templateId = templateId
    ? (await Template.findOne(
      mongoose.isValidObjectId(templateId)
        ? { _id: templateId }
        : { key: templateId }
    ))?._id || null
    : null;

  const savedPoster = await poster.save();
  return res.json({ success: true, data: savedPoster });
};

const reserveRegeneration = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ success: false, message: "Poster not found." });
  }

  const filter = { _id: req.params.id };
  if (req.user.role !== "admin") filter.userId = req.user.id;

  const poster = await Poster.findOneAndUpdate(
    { ...filter, generationCount: { $lt: MAX_REGENERATIONS + 1 } },
    { $inc: { generationCount: 1 }, $set: { status: "generating" } },
    { returnDocument: "after" }
  );

  if (!poster) {
    const exists = await Poster.exists(filter);
    return res.status(exists ? 429 : 404).json({
      success: false,
      message: exists
        ? "This poster has reached its regeneration limit."
        : "Poster not found.",
    });
  }

  return res.json({ success: true, data: { generationCount: poster.generationCount } });
};

const deletePoster = async (req, res) => {
  const poster = await getOwnedPoster(req.params.id, req.user);

  if (!poster) {
    return res.status(404).json({ success: false, message: "Poster not found." });
  }

  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    await Promise.allSettled(
      poster.uploadedPhotoUrls.map((photo) => (
        photo.publicId ? cloudinary.uploader.destroy(photo.publicId) : Promise.resolve()
      ))
    );
  }

  await poster.deleteOne();
  return res.json({ success: true, message: "Poster deleted." });
};

const markGeneration = async (req, res) => {
  const poster = await getOwnedPoster(req.params.id, req.user);

  if (!poster) {
    return res.status(404).json({ success: false, message: "Poster not found." });
  }

  poster.status = req.body?.status === "failed" ? "failed" : "completed";
  if (req.body?.aiContent) poster.aiContent = req.body.aiContent;
  await poster.save();

  return res.json({ success: true, data: poster });
};

module.exports = {
  createPoster,
  listUserPosters,
  getPoster,
  updatePoster,
  reserveRegeneration,
  deletePoster,
  markGeneration,
};