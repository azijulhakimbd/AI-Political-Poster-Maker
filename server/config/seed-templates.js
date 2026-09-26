/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config();

const mongoose = require("mongoose");
const Template = require("../models/Template.js");
const templates = require("./templates.js");

const seedTemplates = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all(
    templates.map(({ key, ...template }) => (
      Template.findOneAndUpdate(
        { key },
        { $set: { key, ...template, isActive: true } },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      )
    ))
  );
  console.log(`Seeded ${templates.length} poster templates.`);
};

seedTemplates()
  .catch((error) => {
    console.error("Template seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());