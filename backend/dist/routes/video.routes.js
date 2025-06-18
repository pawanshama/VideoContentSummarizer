"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/videoRoutes.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const video_controller_1 = require("../controllers/video.controller");
const router = (0, express_1.Router)();
// Configure Multer for file uploads
// 'dest' is the temporary directory where files will be stored before processing
const upload = (0, multer_1.default)({ dest: 'temp_uploads/' });
// POST /api/videos/upload - for uploading a video file
// 'videoFile' should match the 'name' attribute in the form field on the client side
router.post('/upload', upload.single('videoFile'), video_controller_1.uploadVideo);
// GET /api/videos/:videoId/summary - to get the summary for a specific video
router.get('/:videoId/summary', video_controller_1.getVideoSummary);
exports.default = router;
