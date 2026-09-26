/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error(
      "MONGODB_URI is missing. Add a local MongoDB or MongoDB Atlas connection string to the project root .env file."
    );
  }

  try {
    const connection = await mongoose.connect(uri);

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`, {
      cause: error,
    });
  }
};

module.exports = connectDB;