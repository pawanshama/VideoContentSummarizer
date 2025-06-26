"use strict";
// // src/services/videoProcessingService.ts
// import { AppDataSource } from '../data-source';
// import { Video } from '../entity/Video';
// import { Transcript } from '../entity/Transcript';
// import { Summary } from '../entity/Summary';
// import { UserSettings } from '../entity/UserSettings';
// import { UsageLog } from '../entity/UsageLog';
// import { transcribeAudioWithWhisper, summarizeTextWithGPT4 } from './openAIService';
// import { logUsage } from './usageLogService';
// import ffmpeg from 'fluent-ffmpeg';
// import ffmpegStatic from 'ffmpeg-static';
// import path from 'path';
// import fs from 'fs/promises'; // Use promises version of fs
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processVideoForAI = void 0;
// import axios from 'axios';
// // ... (callLocalWhisperService function definition)
// const callLocalWhisperService = async (videoUrl: string): Promise<string> => {
//   try {
//     console.log(`Calling local Whisper server for transcription of: ${videoUrl}`);
//     const response = await axios.post('http://127.0.0.1:5000/transcribe_video', {
//       video_url: videoUrl
//     });
//     if (response.data && response.data.transcript) {
//       console.log('Local Whisper transcription successful.');
//       return response.data.transcript;
//     } else {
//       throw new Error(`Local Whisper server returned unexpected response: ${JSON.stringify(response.data)}`);
//     }
//   } catch (error) {
//     console.error('Error calling local Whisper server:', error instanceof Error ? error.message : String(error));
//     if (axios.isAxiosError(error) && error.response) {
//         // FIX IS HERE: Changed JSON.response to error.response
//         console.error('Local Whisper server error response:', error.response.data);
//         throw new Error(`Local Whisper server error: ${error.response.data.error || 'Unknown error'}`);
//     }
//     throw new Error(`Failed to get transcription from local Whisper: ${error instanceof Error ? error.message : String(error)}`);
//   }
// };
// // Tell fluent-ffmpeg where to find the ffmpeg binary
// if (ffmpegStatic) {
//   ffmpeg.setFfmpegPath(ffmpegStatic);
// } else {
//   console.error('FFmpeg static path not found. Ensure ffmpeg-static is correctly installed.');
// }
// /**
//  * Orchestrates the full video processing pipeline: audio extraction, transcription, and summarization.
//  * This function should ideally be called as a background job.
//  * @param videoId The ID of the Video entity to process.
//  */
// export const processVideoForAI = async (videoId: string): Promise<void> => {
//   const videoRepository = AppDataSource.getRepository(Video);
//   const transcriptRepository = AppDataSource.getRepository(Transcript);
//   const summaryRepository = AppDataSource.getRepository(Summary);
//   const userSettingsRepository = AppDataSource.getRepository(UserSettings);
//   let video: Video | null = null;
//   let audioFilePath: string | undefined;
//   let transcriptText: string | undefined;
//   try {
//     video = await videoRepository.findOneBy({ id: videoId });
//     if (!video) {
//       console.error(`Video with ID ${videoId} not found for processing.`);
//       await logUsage(video!.user_id, video!.id, 'processing_failed', { message: `Video not found.` });
//       return;
//     }
//     console.log(`Starting processing for video: ${video.title} (ID: ${video.id})`);
//     await videoRepository.update(video.id, { processing_status: 'extracting_audio' });
//     await logUsage(video.user_id, video.id, 'processing_started', { status: 'extracting_audio' });
//     // --- 1. Extract Audio ---
//     const outputDir = path.join(__dirname, '../../temp_audio'); // Temporary directory for audio files
//     await fs.mkdir(outputDir, { recursive: true }); // Ensure directory exists
//     audioFilePath = path.join(outputDir, `${video.id}.mp3`);
//     console.log(`Extracting audio to: ${audioFilePath}`);
//     await new Promise<void>((resolve, reject) => {
//       ffmpeg(video!.storage_url) // Use the Cloudinary URL as input
//         .noVideo() // Only extract audio
//         .audioCodec('libmp3lame')
//         .save(audioFilePath!)
//         .on('end', () => {
//           console.log('Audio extraction finished.');
//           resolve();
//         })
//         .on('error', (err) => {
//           console.error('FFmpeg error:', err);
//           reject(new Error(`Audio extraction failed: ${err.message}`));
//         });
//     });
//     await videoRepository.update(video.id, { processing_status: 'transcribing' });
//     await logUsage(video.user_id, video.id, 'audio_extracted', { audioFile: audioFilePath });
//     // --- 2. Transcribe Audio with Whisper ---
//     console.log('Starting Whisper transcription...');
//     transcriptText = await transcribeAudioWithWhisper(audioFilePath);
//     if (!transcriptText) {
//       throw new Error('Transcription returned empty text.');
//     }
//     // Save Transcript to DB
//     const newTranscript = transcriptRepository.create({
//       video_id: video.id,
//       transcript_content: transcriptText,
//       model_used: 'whisper-1', // Assuming whisper-1 model was used
//       tone_version: 'en', // Or detect language if Whisper provides it
//       created_at: new Date(),
//     });
//     await transcriptRepository.save(newTranscript);
//     await videoRepository.update(video.id, { processing_status: 'summarizing' });
//     await logUsage(video.user_id, video.id, 'transcription_completed', { transcriptId: newTranscript.id });
//     // --- 3. Summarize Text with GPT-4 ---
//     console.log('Starting GPT-4 summarization...');
//     // Fetch user settings to apply preferences to summary
//     const userSettings = await userSettingsRepository.findOneBy({ user_id: video.user_id });
//     const summaryType = userSettings?.default_summary_type || 'concise';
//     const outputLanguage = userSettings?.default_output_language || 'English';
//     const summaryText = await summarizeTextWithGPT4(transcriptText, summaryType, outputLanguage);
//     if (!summaryText) {
//       throw new Error('Summarization returned empty text.');
//     }
//     // Save Summary to DB
//     const newSummary = summaryRepository.create({
//       transcript_id: newTranscript.id,
//       summary_text: summaryText,
//       summary_type: summaryType,
//       model_used: 'gpt-4', // Assuming gpt-4 model was used
//       created_at: new Date(),
//     });
//     await summaryRepository.save(newSummary);
//     await videoRepository.update(video.id, { processing_status: 'completed' });
//     await logUsage(video.user_id, video.id, 'summarization_completed', { summaryId: newSummary.id, status: 'completed' });
//     console.log(`Video processing completed successfully for video ID: ${video.id}`);
//   } catch (error) {
//     console.error(`Error during video processing for video ID ${videoId}:`, error);
//     if (video) {
//       await videoRepository.update(video.id, { processing_status: 'failed' });
//       await logUsage(video.user_id, video.id, 'processing_failed', {
//         message: `Video processing failed: ${error instanceof Error ? error.message : String(error)}`,
//       });
//     } else {
//        console.error(`Critical: Video object was null during processing failure for video ID ${videoId}`);
//     }
//   } finally {
//     // Clean up temporary audio file
//     if (audioFilePath) {
//       try {
//         await fs.unlink(audioFilePath);
//         console.log(`Cleaned up temporary audio file: ${audioFilePath}`);
//       } catch (cleanupError) {
//         console.warn(`Failed to clean up temporary audio file ${audioFilePath}:`, cleanupError);
//       }
//     }
//   }
// };
// src/services/videoProcessingService.ts
const data_source_1 = require("../data-source");
const Video_1 = require("../entity/Video");
const Transcript_1 = require("../entity/Transcript");
const Summary_1 = require("../entity/Summary");
const UserSettings_1 = require("../entity/UserSettings");
const usageLogService_1 = require("./usageLogService");
const axios_1 = __importDefault(require("axios")); // New: Import axios
// No need for ffmpeg setup here, as Python server handles it
// if (ffmpegStatic) {
//   ffmpeg.setFfmpegPath(ffmpegStatic);
// } else {
//   console.error('FFmpeg static path not found. Ensure ffmpeg-static is correctly installed.');
// }
/**
 * Calls the local Python Whisper server to transcribe a video.
 * @param videoUrl The direct URL to the video file (e.g., Cloudinary URL).
 * @returns The transcribed text.
 */
const callLocalWhisperService = async (videoUrl) => {
    try {
        console.log(`Calling local Whisper server for transcription of: ${videoUrl}`);
        const response = await axios_1.default.post('http://127.0.0.1:5001/transcribe_video', {
            video_url: videoUrl
        });
        if (response.data && response.data.transcript) {
            console.log('Local Whisper transcription successful.');
            return response.data.transcript;
        }
        else {
            throw new Error(`Local Whisper server returned unexpected response: ${JSON.stringify(response.data)}`);
        }
    }
    catch (error) {
        console.error('Error calling local Whisper server:', error instanceof Error ? error.message : String(error));
        if (axios_1.default.isAxiosError(error) && error.response) {
            console.error('Local Whisper server error response:', error.response.data);
            throw new Error(`Local Whisper server error: ${error.response.data.error || 'Unknown error'}`);
        }
        throw new Error(`Failed to get transcription from local Whisper: ${error instanceof Error ? error.message : String(error)}`);
    }
};
const processVideoForAI = async (videoId) => {
    const videoRepository = data_source_1.AppDataSource.getRepository(Video_1.Video);
    const transcriptRepository = data_source_1.AppDataSource.getRepository(Transcript_1.Transcript);
    const summaryRepository = data_source_1.AppDataSource.getRepository(Summary_1.Summary);
    const userSettingsRepository = data_source_1.AppDataSource.getRepository(UserSettings_1.UserSettings);
    let video = null;
    let transcriptText;
    try {
        video = await videoRepository.findOneBy({ id: videoId });
        if (!video) {
            console.error(`Video with ID ${videoId} not found for processing.`);
            return;
        }
        console.log(`Starting processing for video: ${video.title} (ID: ${video.id})`);
        await videoRepository.update(video.id, { processing_status: 'transcribing' }); // Changed status
        await (0, usageLogService_1.logUsage)(video.user_id, video.id, 'processing_started', { status: 'transcribing_via_local_whisper' }); // Updated log
        // --- 1. Transcribe Audio with Local Whisper ---
        // Pass the Cloudinary storage_url directly to the Python server
        transcriptText = await callLocalWhisperService(video.storage_url);
        if (!transcriptText) {
            throw new Error('Transcription returned empty text.');
        }
        // Save Transcript to DB
        const newTranscript = transcriptRepository.create({
            video_id: video.id,
            transcript_content: transcriptText,
            model_used: 'whisper-base-local', // Indicate local model
            tone_version: '', // Or infer/get from local Whisper if it supports language detection
            created_at: new Date(),
        });
        await transcriptRepository.save(newTranscript);
        await videoRepository.update(video.id, { processing_status: 'summarizing' });
        await (0, usageLogService_1.logUsage)(video.user_id, video.id, 'transcription_completed', { transcriptId: newTranscript.id, source: 'local_whisper' });
        // --- 2. Summarize Text with GPT-4 (still using OpenAI API for this) ---
        console.log('Starting GPT-4 summarization...');
        const userSettings = await userSettingsRepository.findOneBy({ user_id: video.user_id });
        const summaryType = userSettings?.default_summary_type || 'concise';
        // const outputLanguage = userSettings?.default_output_language || 'Hinglish';
        const colabUrl = process.env.COLAB_LARGE_MODEL_URL;
        if (!colabUrl) {
            throw new Error('COLAB_LARGE_MODEL_URL is not set in .env');
        }
        let largeModelOutput = null;
        // try {
        const colabResponse = await axios_1.default.post(colabUrl + '/process_large_model', {
            text: transcriptText // Send the transcript to Colab
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        largeModelOutput = colabResponse.data.result;
        
        console.log(largeModelOutput,'largeModelOutput')// Assuming Colab returns { "result": "..." }
        if (!largeModelOutput) {
            throw new Error('Large model processing in Colab returned empty output.');
        }
        console.log('Large model processing in Colab successful.');
        // Now you have the output from the large model.
        // You can save this as the summary or pass it to DeepSeek if further summarization is needed.
        // If the Colab model *is* your summarizer, then this is your summaryText
        const summaryText = largeModelOutput; // Use the output directly if it's the final summary
        // const summaryText = await summarizeTextWithDeepSeek(transcriptText, summaryType, outputLanguage);
        // if (!summaryText) {
        //   throw new Error('Summarization returned empty text.');
        // }
        // Save Summary to DB
        const newSummary = summaryRepository.create({
            transcript_id: newTranscript.id,
            summary_text: summaryText,
            summary_type: summaryType,
            model_used: 'gpt-4',
            created_at: new Date(),
        });
        await summaryRepository.save(newSummary);
        await videoRepository.update(video.id, { processing_status: 'completed' });
        await (0, usageLogService_1.logUsage)(video.user_id, video.id, 'summarization_completed', { summaryId: newSummary.id, status: 'completed' });
        console.log(`Video processing completed successfully for video ID: ${video.id}`);
    }
    catch (error) {
        console.error(`Error during video processing for video ID ${videoId}:`, error);
        if (video) {
            await videoRepository.update(video.id, { processing_status: 'failed' });
            await (0, usageLogService_1.logUsage)(video.user_id, video.id, 'processing_failed', {
                message: `Video processing failed: ${error instanceof Error ? error.message : String(error)}`,
            });
        }
        else {
            console.error(`Critical: Video object was null during processing failure for video ID ${videoId}`);
        }
    }
    finally {
        // No temporary audio file cleanup needed here anymore, as Python handles it
    }
};
exports.processVideoForAI = processVideoForAI;
