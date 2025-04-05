import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary using individual environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
export const uploadImage = async (file, folder = 'products') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `agro-kiran/${folder}`,
      use_filename: true,
      unique_filename: true
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicUrl) => {
  try {
    // Extract public ID from URL
    const publicId = publicUrl.split('/').slice(-1)[0].split('.')[0];
    const folder = publicUrl.split('/').slice(-2)[0];
    const fullPublicId = `agro-kiran/${folder}/${publicId}`;
    
    await cloudinary.uploader.destroy(fullPublicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
};

export default cloudinary;
