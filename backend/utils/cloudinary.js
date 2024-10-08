const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
require('dotenv').config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageOnCloudinary = async (filePath, folderName) => {
  try {
    //uploding image from server
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
    });
    //delete image from server
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      throw new Error('Failed to delete image from server', error);
    }
    console.log(result);

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const deleteImageOnCloudinary = async (public_id) => {
  try {
    const result = cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { uploadImageOnCloudinary, deleteImageOnCloudinary };
