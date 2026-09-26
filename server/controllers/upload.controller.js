/* eslint-disable @typescript-eslint/no-require-imports */
const { v2: cloudinary } = require("cloudinary");

const isCloudinaryConfigured = () => Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

const uploadOne = (file, userId) => new Promise((resolve, reject) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: `poster-maker/${userId}`,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
    (error, result) => {
      if (error) return reject(error);
      return resolve({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }
  );

  stream.end(file.buffer);
});

const uploadImages = async (req, res) => {
  if (!isCloudinaryConfigured()) {
    return res.status(503).json({
      success: false,
      message: "Image storage is not configured.",
    });
  }

  if (!req.files?.length) {
    return res.status(400).json({
      success: false,
      message: "Choose at least one image to upload.",
    });
  }

  const assets = await Promise.all(
    req.files.map((file) => uploadOne(file, req.user.id))
  );

  return res.status(201).json({ success: true, data: assets });
};

module.exports = { uploadImages };