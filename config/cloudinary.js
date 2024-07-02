const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.cloudinaryConnect = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        })
    } catch (error) {
        console.log("Cloudinary Error: ", error)
    }
};

exports.uploadImageToCloudinary = async (file, folder, quality) => {
    const options = { folder };
    options.resource_type = "auto";
    if(quality) {
        options.quality = quality;
    }

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}