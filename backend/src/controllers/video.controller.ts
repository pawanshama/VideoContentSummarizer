import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Video } from '../entity/Video';
import { In } from 'typeorm';
import { User } from '../entity/User';
import { uploadFileToCloudinary } from '../services/cloudinaryService';
import { processVideoForAI, getFullVideoDetailsWithCommands } from '../services/videoProcessingService'; // MODIFIED: Import getFullVideoDetailsWithCommands
import { logUsage } from '../services/usageLogService';
import { Transcript } from '../entity/Transcript'; // Import for fetching related data
import { Summary } from '../entity/Summary';     // Import for fetching related data
import { GeospatialCommand } from '../entity/GeospatialCommand'; // NEW: Import GeospatialCommand for typing
import path from 'path';
import fs from 'fs';
import { unlink } from 'fs/promises';
import { UploadApiResponse } from 'cloudinary';

// Utility function to get file extension
const getFileExtension = (filename: string): string => {
  return path.extname(filename).toLowerCase();
};

export const uploadVideo = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No video file uploaded." });
  }

  const userId = req.body.user_id; // Assuming user_id is sent in the form data
  if (!userId) {
    return res.status(400).json({ message: "User ID is required for video upload." });
  }

  const userRepository = AppDataSource.getRepository(User);
  const videoRepository = AppDataSource.getRepository(Video);

  try {
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      await unlink(req.file.path);
      return res.status(404).json({ message: "User not found." });
    }

    console.log(`Uploading ${req.file.originalname} to Cloudinary...`);
    const cloudinaryResult: UploadApiResponse | any = await uploadFileToCloudinary(req.file.path, 'video-summarizer/videos');
    console.log(cloudinaryResult);
    unlink(req.file.path);
    console.log(`Local temp file ${req.file.path} deleted.`);

    const newVideo = videoRepository.create({
      user_id: user.id,
      user: user,
      video_id: cloudinaryResult?.public_id,
      title: req.body.title || req.file.originalname,
      description: req.body.description,
      original_filename: req.file.originalname,
      storage_url: cloudinaryResult?.secure_url,
      duration_seconds: cloudinaryResult?.duration, // Cloudinary often provides video duration
      processing_status: 'uploaded',
    });
    await videoRepository.save(newVideo);

    await logUsage(user.id, newVideo.id, 'video_uploaded', {
      originalFilename: req.file.originalname,
      cloudinaryUrl: newVideo.storage_url,
      size: req.file.size
    });

    // Trigger background processing (ideally, this would be a queue)
    processVideoForAI(newVideo.id, cloudinaryResult)
      .then(() => console.log(`Background processing initiated for video: ${newVideo.id}`))
      .catch((err) => console.error(`Error initiating background processing for video ${newVideo.id}:`, err));

    res.status(202).json({ // 202 Accepted: request accepted, processing will happen later
      message: "Video uploaded and processing initiated.",
      video: {
        id: newVideo.id,
        title: newVideo.title,
        storage_url: newVideo.storage_url,
        processing_status: newVideo.processing_status
      }
    });

  } catch (error) {
    console.error("Error during video upload or processing initiation:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      await unlink(req.file.path).catch(e => console.warn("Failed to delete local temp file on error:", e));
    }
    if (userId) {
      await logUsage(userId, null, 'video_upload_failed', {
        message: `Upload failed: ${error instanceof Error ? error.message : String(error)}`,
        filename: req.file?.originalname,
      }).catch(e => console.error("Failed to log upload failure:", e));
    }
    res.status(500).json({ message: `Video upload failed: ${error instanceof Error ? error.message : String(error)}` });
  }
};

// MODIFIED: This function now leverages getFullVideoDetailsWithCommands
export const getVideoSummary = async (req: Request, res: Response) => {
  const { videoId } = req.params;
  if (!videoId) return res.status(400).json({ message: "Bad Request: Video ID is required." });

  try {
    // Use the new comprehensive fetch function
    const videoDetails = await getFullVideoDetailsWithCommands(videoId);

    if (!videoDetails) {
      return res.status(404).json({ message: "Video not found." });
    }

    // Format the response for the frontend, including geospatial commands
    const formattedCommands = videoDetails.geospatialCommands ? videoDetails.geospatialCommands.map(cmd => ({
      command_id: cmd.id,
      video_id: cmd.videoId,
      command_type: cmd.commandType,
      start_time_offset_seconds: cmd.startTimeOffsetSeconds,
      end_time_offset_seconds: cmd.endTimeOffsetSeconds,
      command_data_json: cmd.commandData,
      generated_at: cmd.generatedAt.toISOString(),
    })) : [];

    res.json({
      video: {
        id: videoDetails.id,
        title: videoDetails.title,
        processing_status: videoDetails.processing_status,
        storage_url: videoDetails.storage_url,
        duration_seconds: videoDetails.duration_seconds,
      },
      transcript: videoDetails.transcript ? {
        id: videoDetails.transcript.id,
        content: videoDetails.transcript.transcript_content,
        model_used: videoDetails.transcript.model_used,
        tone_version: videoDetails.transcript.tone_version,
      } : null,
      // summary: videoDetails.summary ? {
      //   id: videoDetails.summary.id,
      //   text: videoDetails.summary.summary_text,
      //   type: videoDetails.summary.summary_type,
      //   model_used: videoDetails.summary.model_used,
      // } : null,
      geospatialCommands: formattedCommands, // NEW: Include geospatial commands here
    });

  } catch (error) {
    console.error("Error fetching video details (summary/geospatial):", error);
    res.status(500).json({ message: `Failed to fetch video details: ${error instanceof Error ? error.message : String(error)}` });
  }
};

// Your existing backupFile function (no changes needed for geospatial integration)
export const backupFile = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const videoRepository = AppDataSource.getRepository(Video);
    const video = await videoRepository.find({
      where: { user_id: user_id },
      relations: ["user"]
    });

    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    const transcriptRepository = AppDataSource.getRepository(Transcript);
    const videoIds = video.map(videos => videos.id);

    const transcript = await transcriptRepository.find({
      where: {
        video_id: In(videoIds)
      }
    });
    const transcriptIds = transcript.map(t => t.id);  

    const summaryRepository = AppDataSource.getRepository(Summary);
    const summ = await summaryRepository.find({
      where: { transcript_id: In(transcriptIds) }
    });
    const summary = summ.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; // Invert the comparison for descending order
    });
    return res.status(202).json({ summary, message: `data sent successfully` });
  }
  catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}


// // src/controllers/videoController.ts
// import { Request, Response } from 'express';
// import { AppDataSource } from '../data-source';
// import { Video } from '../entity/Video';
// import { In } from 'typeorm';
// import { User } from '../entity/User';
// import { uploadFileToCloudinary } from '../services/cloudinaryService';
// import { processVideoForAI } from '../services/videoProcessingService';
// import { logUsage } from '../services/usageLogService';
// import { Transcript } from '../entity/Transcript'; // Import for fetching related data
// import { Summary } from '../entity/Summary';     // Import for fetching related data
// import path from 'path';
// import fs from 'fs';
// import { unlink } from 'fs/promises';
// import { UploadApiResponse, UploadStream } from 'cloudinary';

// // Utility function to get file extension
// const getFileExtension = (filename: string): string => {
//   return path.extname(filename).toLowerCase();
// };

// export const uploadVideo = async (req: Request, res: Response) => {
//   // Assuming multer has processed the file and it's available at req.file
//   if (!req.file) {
//     return res.status(400).json({ message: "No video file uploaded." });
//   }

//   const userId = req.body.user_id; // Assuming user_id is sent in the form data
//   if (!userId) {
//     return res.status(400).json({ message: "User ID is required for video upload." });
//   }

//   const userRepository = AppDataSource.getRepository(User);
//   const videoRepository = AppDataSource.getRepository(Video);

//   try {
//     const user = await userRepository.findOneBy({ id: userId });
//     if (!user) {
//       // Clean up uploaded file if user not found
//       await unlink(req.file.path);
//       return res.status(404).json({ message: "User not found." });
//     }

//     // 1. Upload to Cloudinary
//     console.log(`Uploading ${req.file.originalname} to Cloudinary...`);
//     const cloudinaryResult:UploadApiResponse|any = await uploadFileToCloudinary(req.file.path, 'video-summarizer/videos');
//     console.log(cloudinaryResult);
//     // Clean up local temporary file after upload
//     unlink(req.file.path);
//     console.log(`Local temp file ${req.file.path} deleted.`);
//     // 2. Create Video entry in DB
//     const newVideo = videoRepository.create({
//       user_id: user.id,
//       user: user, // Link the User object
//       video_id: cloudinaryResult?.public_id, // Use Cloudinary's public ID as our video_id
//       title: req.body.title || req.file.originalname, // Use provided title or original filename
//       description: req.body.description,
//       original_filename: req.file.originalname,
//       storage_url: cloudinaryResult?.secure_url,
//       duration_seconds: cloudinaryResult?.duration, // Cloudinary often provides video duration
//       processing_status: 'uploaded',
//     });
//     await videoRepository.save(newVideo);

//     // 3. Log usage
//     await logUsage(user.id, newVideo.id, 'video_uploaded', {
//       originalFilename: req.file.originalname,
//       cloudinaryUrl: newVideo.storage_url,
//       size: req.file.size
//     });

//     // 4. Trigger background processing (ideally, this would be a queue)
//     // For now, we call it directly, but in production, enqueue this.
//     await processVideoForAI(newVideo.id,cloudinaryResult)
//       .then(() => console.log(`Background processing initiated for video: ${newVideo.id}`))
//       .catch((err) => console.error(`Error initiating background processing for video ${newVideo.id}:`, err));

//     res.status(200).json({ // 202 Accepted: request accepted, processing will happen later
//       message: "Video uploaded and processing initiated.",
//       video: {
//         id: newVideo.id,
//         title: newVideo.title,
//         storage_url: newVideo.storage_url,
//         processing_status: newVideo.processing_status
//       }
//     });

//   } catch (error) {
//     console.error("Error during video upload or processing initiation:", error);
//     // Attempt to delete local file if an error occurred before Cloudinary upload
//     if (req.file && fs.existsSync(req.file.path)) {
//       await unlink(req.file.path).catch(e => console.warn("Failed to delete local temp file on error:", e));
//     }
//     // Log usage for failed upload
//     if (userId) { // Only if userId was provided
//       await logUsage(userId, null, 'video_upload_failed', {
//         message: `Upload failed: ${error instanceof Error ? error.message : String(error)}`,
//         filename: req.file?.originalname,
//       }).catch(e => console.error("Failed to log upload failure:", e));
//     }
//     res.status(500).json({ message: `Video upload failed: ${error instanceof Error ? error.message : String(error)}` });
//   }
// };

// export const getVideoSummary = async (req: Request, res: Response) => {
//   const { videoId } = req.params; // Get video ID from URL parameter
//   console.log(req.params);
//   if(!videoId)return res.status(400).json({message:"Boad Request"});
//   const videoRepository = AppDataSource.getRepository(Video);
//   const transcriptRepository = AppDataSource.getRepository(Transcript);
//   const summaryRepository = AppDataSource.getRepository(Summary);

//   try {
//     const video = await videoRepository.findOne({
//       where: { id: videoId },
//       relations: ["user"] // Eager load user if needed for display
//     });

//     if (!video) {
//       return res.status(404).json({ message: "Video not found." });
//     }

//     // Fetch transcript (assuming one-to-one with video)
//     const transcript = await transcriptRepository.findOne({
//       where: { video_id: video.id }
//     });

//     // Fetch summary (assuming one-to-one with transcript)
//     const summary = await summaryRepository.findOne({
//       where: { transcript_id: transcript?.id } // Only try to find summary if transcript exists
//     });

//     res.json({
//       video: {
//         id: video.id,
//         title: video.title,
//         processing_status: video.processing_status,
//         storage_url: video.storage_url,
//       },
//       transcript: transcript ? {
//         id: transcript.id,
//         content: transcript.transcript_content,
//         model_used: transcript.model_used,
//         tone_version: transcript.tone_version,
//       } : null,
//       summary: summary ? {
//         id: summary.id,
//         text: summary.summary_text,
//         type: summary.summary_type,
//         model_used: summary.model_used,
//       } : null,
//     });

//   } catch (error) {
//     console.error("Error fetching video summary:", error);
//     res.status(500).json({ message: `Failed to fetch summary: ${error instanceof Error ? error.message : String(error)}` });
//   }
// };

// // Add more video-related controller functions (e.g., list all videos for a user, delete video)

// export const backupFile = async (req:Request,res:Response) => {
//     try{
//         const {user_id} = req.params;
//         const videoRepository = AppDataSource.getRepository(Video);
//         const video = await videoRepository.find({
//           where: { user_id: user_id },
//           relations: ["user"] // Eager load user if needed for display
//         });

//         if (!video) {
//           return res.status(404).json({ message: "Video not found." });
//         }
//         // Fetch transcript (assuming one-to-one with video)
//         const transcriptRepository = AppDataSource.getRepository(Transcript);
//         const videoIds = video.map(videos => videos.id);
        
//         const transcript = await transcriptRepository.find({where: {
//              video_id: In(videoIds) // `In` is from 'typeorm'
//         }});
//          const transcriptIds = transcript.map(t => t.id);
//         // Fetch summary (assuming one-to-one with transcript)
//         const summaryRepository = AppDataSource.getRepository(Summary);
//         const summ = await summaryRepository.find({
//           where: { transcript_id: In(transcriptIds) } // Only try to find summary if transcript exists
//         });
//         const summary = summ.sort((a, b) => {
//           const dateA = new Date(a.created_at).getTime();
//           const dateB = new Date(b.created_at).getTime();
//           return dateB - dateA; // Invert the comparison for descending order
//         });
//         return res.status(202).json({summary,message:`data sent successfully`});
//     } 
//     catch(error){
//        return res.status(500).json({message:"Internal Server Error",error});
//     }
// }