/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");
const Template = require("../models/Template.js");

const listTemplates = async (req, res) => {
  const filter = { isActive: true };

  if (req.query.occasion) {
    filter.occasionType = req.query.occasion;
  }

  const templates = await Template.find(filter)
    .sort({ title: 1 })
    .lean();

  return res.json({ success: true, data: templates });
};

const getTemplate = async (req, res) => {
  const filter = mongoose.isValidObjectId(req.params.id)
    ? { _id: req.params.id, isActive: true }
    : { key: req.params.id, isActive: true };
  const template = await Template.findOne(filter).lean();

  if (!template) {
    return res.status(404).json({
      success: false,
      message: "Template not found.",
    });
  }

  return res.json({ success: true, data: template });
};

module.exports = { listTemplates, getTemplate };