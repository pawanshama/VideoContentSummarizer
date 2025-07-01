// src/services/cloudinaryService.ts
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs'
import streamifier from "streamifier"
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
  const stats = fs.statSync(filePath);
  const fileSizeInMB = stats.size / (1024 * 1024);
  const LARGE_FILE_THRESHOLD_MB = 100;
  const eagerTransformations = [
    { width: 300, height: 300, crop: 'pad', audio_codec: 'none' },
    { width: 160, height: 100, crop: 'crop', gravity: 'north', audio_codec: 'none' }
  ];

  try {
    
     let result;

    if (fileSizeInMB > LARGE_FILE_THRESHOLD_MB) {
      console.log(`🔴 File size ${fileSizeInMB.toFixed(2)}MB > ${LARGE_FILE_THRESHOLD_MB}MB — using upload_large()`);

      result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(
          filePath,
          {
            resource_type: 'video',
            folder,
            chunk_size: 6_000_000,
            eager: eagerTransformations,
            eager_async: false,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
      });

    } else {
      console.log(`🟢 File size ${fileSizeInMB.toFixed(2)}MB <= ${LARGE_FILE_THRESHOLD_MB}MB — using upload()`);

      result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        folder,
        eager: eagerTransformations,
        eager_async: false,
      });
    }
   
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