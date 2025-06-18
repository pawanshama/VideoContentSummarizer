"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFromCloudinary = exports.uploadFileToCloudinary = void 0;
// src/services/cloudinaryService.ts
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
cloudinary_1.v2.config({
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
const uploadFileToCloudinary = async (filePath, folder) => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(filePath, {
            resource_type: "auto", // Automatically detect resource type (video, image, raw)
            folder: folder,
            chunk_size: 6000000, // For large files, upload in chunks (6MB)
            eager: [
                { width: 300, height: 300, crop: "pad", audio_codec: "none" },
                { width: 160, height: 100, crop: "crop", gravity: "north", audio_codec: "none" }
            ]
        });
        console.log('Cloudinary Upload Result:', result);
        return result; // Contains public_id, secure_url, etc.
    }
    catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error(`Cloudinary upload failed: ${error instanceof Error ? error.message : String(error)}`);
    }
};
exports.uploadFileToCloudinary = uploadFileToCloudinary;
/**
 * Deletes a file from Cloudinary.
 * @param publicId The public ID of the file to delete.
 * @param resourceType The type of resource ('video', 'image', 'raw').
 */
const deleteFileFromCloudinary = async (publicId, resourceType) => {
    try {
        const result = await cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        console.log('Cloudinary Delete Result:', result);
        return result;
    }
    catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw new Error(`Cloudinary deletion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
};
exports.deleteFileFromCloudinary = deleteFileFromCloudinary;
