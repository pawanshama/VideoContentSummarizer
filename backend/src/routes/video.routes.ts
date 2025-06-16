// src/routes/videoRoutes.ts
import { Router } from 'express';
import multer from 'multer';
import { uploadVideo, getVideoSummary } from '../controllers/video.controller';

const router = Router();

// Configure Multer for file uploads
// 'dest' is the temporary directory where files will be stored before processing
const upload = multer({ dest: 'temp_uploads/' });

// POST /api/videos/upload - for uploading a video file
// 'videoFile' should match the 'name' attribute in the form field on the client side
router.post('/upload', upload.single('videoFile'), uploadVideo);

// GET /api/videos/:videoId/summary - to get the summary for a specific video
router.get('/:videoId/summary', getVideoSummary);

export default router;