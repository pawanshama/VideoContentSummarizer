// src/services/cloudinaryService.ts
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Use HTTPS
});

/**
 * Uploads a file to Cloudinary.
 * @param filePath The local path to the file to upload.
 * @param folder The folder in Cloudinary to upload to (e.g., 'video-summarizer/videos').
 * @returns Cloudinary upload result.
 */
export const uploadFileToCloudinary = async (filePath: string, folder: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto", // Automatically detect resource type (video, image, raw)
      folder: folder,
      chunk_size: 6000000, // For large files, upload in chunks (6MB)
      eager: [ // Optional: Pre-process video on upload (e.g., generate thumbnail)
        { width: 300, height: 300, crop: "pad", audio_codec: "none" },
        { width: 160, height: 100, crop: "crop", gravity: "north", audio_codec: "none" }
      ]
    });
    console.log('Cloudinary Upload Result:', result);
    return result; // Contains public_id, secure_url, etc.
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(`Cloudinary upload failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Deletes a file from Cloudinary.
 * @param publicId The public ID of the file to delete.
 * @param resourceType The type of resource ('video', 'image', 'raw').
 */
export const deleteFileFromCloudinary = async (publicId: string, resourceType: "video" | "image" | "raw") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    console.log('Cloudinary Delete Result:', result);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error(`Cloudinary deletion failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};