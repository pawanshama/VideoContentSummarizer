// src/routes/videoRoutes.ts
import { Router } from 'express';
import multer from 'multer';
import { uploadVideo, getVideoSummary, backupFile } from '../controllers/video.controller';
import { checkAdmin } from '../middlewares/admin';

const router = Router();

// Configure Multer for file uploads
// 'dest' is the temporary directory where files will be stored before processing
const upload = multer({ dest: 'temp_uploads/' });

// POST /api/videos/upload - for uploading a video file
// 'videoFile' should match the 'name' attribute in the form field on the client side
router.post('/upload',checkAdmin, upload.single('videoFile'), uploadVideo);

// GET /api/videos/:videoId/summary - to get the summary for a specific video
router.get('/:videoId/summary',checkAdmin, getVideoSummary);
router.get('/backup/:user_id',checkAdmin,backupFile);

export default router;