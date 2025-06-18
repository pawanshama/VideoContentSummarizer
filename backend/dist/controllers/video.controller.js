"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoSummary = exports.uploadVideo = void 0;
const data_source_1 = require("../data-source");
const Video_1 = require("../entity/Video");
const User_1 = require("../entity/User");
const cloudinaryService_1 = require("../services/cloudinaryService");
const videoProcessingService_1 = require("../services/videoProcessingService");
const usageLogService_1 = require("../services/usageLogService");
const Transcript_1 = require("../entity/Transcript"); // Import for fetching related data
const Summary_1 = require("../entity/Summary"); // Import for fetching related data
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const promises_1 = require("fs/promises");
// Utility function to get file extension
const getFileExtension = (filename) => {
    return path_1.default.extname(filename).toLowerCase();
};
const uploadVideo = async (req, res) => {
    // Assuming multer has processed the file and it's available at req.file
    if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded." });
    }
    const userId = req.body.user_id; // Assuming user_id is sent in the form data
    if (!userId) {
        return res.status(400).json({ message: "User ID is required for video upload." });
    }
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    const videoRepository = data_source_1.AppDataSource.getRepository(Video_1.Video);
    try {
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            // Clean up uploaded file if user not found
            await (0, promises_1.unlink)(req.file.path);
            return res.status(404).json({ message: "User not found." });
        }
        // 1. Upload to Cloudinary
        console.log(`Uploading ${req.file.originalname} to Cloudinary...`);
        const cloudinaryResult = await (0, cloudinaryService_1.uploadFileToCloudinary)(req.file.path, 'video-summarizer/videos');
        // Clean up local temporary file after upload
        await (0, promises_1.unlink)(req.file.path);
        console.log(`Local temp file ${req.file.path} deleted.`);
        // 2. Create Video entry in DB
        const newVideo = videoRepository.create({
            user_id: user.id,
            user: user, // Link the User object
            video_id: cloudinaryResult.public_id, // Use Cloudinary's public ID as our video_id
            title: req.body.title || req.file.originalname, // Use provided title or original filename
            description: req.body.description,
            original_filename: req.file.originalname,
            storage_url: cloudinaryResult.secure_url,
            duration_seconds: cloudinaryResult.duration, // Cloudinary often provides video duration
            processing_status: 'uploaded',
        });
        await videoRepository.save(newVideo);
        // 3. Log usage
        await (0, usageLogService_1.logUsage)(user.id, newVideo.id, 'video_uploaded', {
            originalFilename: req.file.originalname,
            cloudinaryUrl: newVideo.storage_url,
            size: req.file.size
        });
        // 4. Trigger background processing (ideally, this would be a queue)
        // For now, we call it directly, but in production, enqueue this.
        (0, videoProcessingService_1.processVideoForAI)(newVideo.id)
            .then(() => console.log(`Background processing initiated for video: ${newVideo.id}`))
            .catch((err) => console.error(`Error initiating background processing for video ${newVideo.id}:`, err));
        res.status(202).json({
            message: "Video uploaded and processing initiated.",
            video: {
                id: newVideo.id,
                title: newVideo.title,
                storage_url: newVideo.storage_url,
                processing_status: newVideo.processing_status
            }
        });
    }
    catch (error) {
        console.error("Error during video upload or processing initiation:", error);
        // Attempt to delete local file if an error occurred before Cloudinary upload
        if (req.file && fs_1.default.existsSync(req.file.path)) {
            await (0, promises_1.unlink)(req.file.path).catch(e => console.warn("Failed to delete local temp file on error:", e));
        }
        // Log usage for failed upload
        if (userId) { // Only if userId was provided
            await (0, usageLogService_1.logUsage)(userId, null, 'video_upload_failed', {
                message: `Upload failed: ${error instanceof Error ? error.message : String(error)}`,
                filename: req.file?.originalname,
            }).catch(e => console.error("Failed to log upload failure:", e));
        }
        res.status(500).json({ message: `Video upload failed: ${error instanceof Error ? error.message : String(error)}` });
    }
};
exports.uploadVideo = uploadVideo;
const getVideoSummary = async (req, res) => {
    const { videoId } = req.params; // Get video ID from URL parameter
    const videoRepository = data_source_1.AppDataSource.getRepository(Video_1.Video);
    const transcriptRepository = data_source_1.AppDataSource.getRepository(Transcript_1.Transcript);
    const summaryRepository = data_source_1.AppDataSource.getRepository(Summary_1.Summary);
    try {
        const video = await videoRepository.findOne({
            where: { id: videoId },
            relations: ["user"] // Eager load user if needed for display
        });
        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }
        // Fetch transcript (assuming one-to-one with video)
        const transcript = await transcriptRepository.findOne({
            where: { video_id: video.id }
        });
        // Fetch summary (assuming one-to-one with transcript)
        const summary = await summaryRepository.findOne({
            where: { transcript_id: transcript?.id } // Only try to find summary if transcript exists
        });
        res.json({
            video: {
                id: video.id,
                title: video.title,
                status: video.processing_status,
                storage_url: video.storage_url,
            },
            transcript: transcript ? {
                id: transcript.id,
                content: transcript.transcript_content,
                model_used: transcript.model_used,
                tone_version: transcript.tone_version,
            } : null,
            summary: summary ? {
                id: summary.id,
                text: summary.summary_text,
                type: summary.summary_type,
                model_used: summary.model_used,
            } : null,
        });
    }
    catch (error) {
        console.error("Error fetching video summary:", error);
        res.status(500).json({ message: `Failed to fetch summary: ${error instanceof Error ? error.message : String(error)}` });
    }
};
exports.getVideoSummary = getVideoSummary;
// Add more video-related controller functions (e.g., list all videos for a user, delete video)
