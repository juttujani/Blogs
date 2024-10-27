const cloudinary = require("cloudinary").v2;
console.log(cloudinary);
require("dotenv").config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET, // Fix the typo here
});

module.exports = cloudinary;