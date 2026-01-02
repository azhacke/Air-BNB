const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

// configure the v2 API on the cloudinary module
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// multer-storage-cloudinary expects the full cloudinary module (so it can access cloudinary.v2.uploader)
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowed_formats: ["png", "jpeg", "jpg"],
    },
});

module.exports = { cloudinary, storage };