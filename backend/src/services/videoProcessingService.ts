import { AppDataSource } from '../data-source';
import { Video } from '../entity/Video';
import { Transcript } from '../entity/Transcript';
import { Summary } from '../entity/Summary';
import { UserSettings } from '../entity/UserSettings';
import { UsageLog } from '../entity/UsageLog';
import { GeospatialCommand } from '../entity/GeospatialCommand'; // NEW: Import GeospatialCommand
import { summarizeTextWithDeepSeek } from './openAIService'; // Keep summarizeTextWithGPT4 for GPT-4
import { logUsage } from './usageLogService';
import path from 'path';
import fs from 'fs/promises';
import axios from 'axios'; // Import axios

// Environment variables for service URLs
const WHISPER_SERVICE_URL = process.env.WHISPER_SERVICE_URL || 'http://127.0.0.1:5001';
const GEOSPATIAL_SERVICE_URL = process.env.GEOSPATIAL_SERVICE_URL || 'http://127.0.0.1:5002'; // Updated port

// Type definitions for Python service responses
interface TranscriptionPythonResponse {
  transcript: string; // Matches your Flask app's response key
}

interface GeospatialCommandPythonResponse {
  command_id: string;
  video_id: string;
  command_type: string;
  start_time_offset_seconds: number;
  end_time_offset_seconds?: number;
  command_data_json: any; // This will be the JSON object
  generated_at: string;
}

interface PythonGeospatialResponse {
  video_id: string;
  geospatial_commands: GeospatialCommandPythonResponse[];
  message: string;
}

// Repositories
export const videoRepository = AppDataSource.getRepository(Video);
export const transcriptRepository = AppDataSource.getRepository(Transcript); // Exported for direct use
export const summaryRepository = AppDataSource.getRepository(Summary); // Exported for direct use
export const userSettingsRepository = AppDataSource.getRepository(UserSettings); // Exported for direct use
export const usageLogRepository = AppDataSource.getRepository(UsageLog); // Exported for direct use
export const geospatialCommandRepository = AppDataSource.getRepository(GeospatialCommand); // NEW: Export GeospatialCommand repository

/**
 * Calls the local Python Whisper server to transcribe a video.
 * @param videoUrl The direct URL to the video file (e.g., Cloudinary URL).
 * @param videoId The ID of the video for logging/context in Whisper service.
 * @returns The transcribed text.
 */
const callLocalWhisperService = async (videoUrl: string, videoId: string): Promise<string> => {
  try {
    console.log(`[Node.js] Calling local Whisper server for transcription of video ID: ${videoId}`);
    const response = await axios.post<TranscriptionPythonResponse>(`${WHISPER_SERVICE_URL}/transcribe_video`, {
      video_url: videoUrl,
      video_id: videoId, // Pass video_id for better logging in Whisper service
    });

    if (response.data && response.data.transcript) {
      console.log(`[Node.js] Local Whisper transcription successful for video ID: ${videoId}.`);
      return response.data.transcript;
    } else {
      throw new Error(`Local Whisper server returned unexpected response: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error(`[Node.js] Error calling local Whisper server for video ID ${videoId}:`, error instanceof Error ? error.message : String(error));
    if (axios.isAxiosError(error) && error.response) {
      console.error('[Node.js] Local Whisper server error response:', error.response.data);
      throw new Error(`Local Whisper server error: ${error.response.data.error || 'Unknown error'}`);
    }
    throw new Error(`Failed to get transcription from local Whisper: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Calls the new Python Geospatial service to generate map commands.
 * @param videoId The ID of the video.
 * @param transcribedText The full transcript of the video.
 * @param durationSeconds The total duration of the video in seconds.
 * @returns A list of GeospatialCommand objects.
 */
const callGeospatialService = async (
  videoId: string,
  transcribedText: string,
  durationSeconds: number
): Promise<GeospatialCommandPythonResponse[]> => {
  try {
    console.log(`[Node.js] Calling Geospatial service for video ID: ${videoId}`);
    const response = await axios.post<PythonGeospatialResponse>(`${GEOSPATIAL_SERVICE_URL}/process-geospatial/`, {
      video_id: videoId,
      transcribed_text: transcribedText,
      duration_seconds: durationSeconds,
    });

    if (response.data && response.data.geospatial_commands) {
      console.log(`[Node.js] Geospatial commands received for video ID: ${videoId}. Count: ${response.data.geospatial_commands.length}`);
      return response.data.geospatial_commands;
    } else {
      throw new Error(`Geospatial service returned unexpected response: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error(`[Node.js] Error calling Geospatial service for video ID ${videoId}:`, error instanceof Error ? error.message : String(error));
    if (axios.isAxiosError(error) && error.response) {
      console.error('[Node.js] Geospatial service error response:', error.response.data);
      throw new Error(`Geospatial service error: ${error.response.data.detail || error.response.data.error || 'Unknown error'}`);
    }
    throw new Error(`Failed to get geospatial commands: ${error instanceof Error ? error.message : String(error)}`);
  }
};


export const processVideoForAI = async (videoId: string, cloudinaryResult: any): Promise<void> => {
  let video: Video | null = null;
  let transcriptText: string | undefined;

  try {
    video = await videoRepository.findOneBy({ id: videoId });
    if (!video) {
      console.error(`Video with ID ${videoId} not found for processing.`);
      return;
    }

    console.log(`[Node.js] Starting processing pipeline for video: ${video.title} (ID: ${video.id})`);
    await videoRepository.update(video.id, { processing_status: 'transcribing' });
    await logUsage(video.user_id, video.id, 'processing_started', { status: 'transcribing_via_local_whisper' });

    // --- 1. Transcribe Audio with Local Whisper ---
    transcriptText = await callLocalWhisperService(video.storage_url, video.id);
    if (!transcriptText) {
      throw new Error('Transcription returned empty text.');
    }

    // Save Transcript to DB
    const newTranscript = transcriptRepository.create({
      video_id: video.id,
      transcript_content: transcriptText,
      model_used: 'whisper-base-local',
      tone_version: '',
      created_at: new Date(),
    });
    await transcriptRepository.save(newTranscript);

    await videoRepository.update(video.id, { processing_status: 'summarizing' });
    await logUsage(video.user_id, video.id, 'transcription_completed', { transcriptId: newTranscript.id, source: 'local_whisper' });


    // --- 2. Summarize Text with LLM (via Colab service) ---
    console.log('[Node.js] Starting LLM summarization via Colab...');

    const userSettings = await userSettingsRepository.findOneBy({ user_id: video.user_id });
    const summaryType = userSettings?.default_summary_type || 'concise';

    const colabUrl = process.env.COLAB_LARGE_MODEL_URL;
    if (!colabUrl) {
      throw new Error('COLAB_LARGE_MODEL_URL is not set in .env');
    }

    let largeModelOutput: string | null = null;
    try {
      const colabResponse = await axios.post(colabUrl + '/process_large_model', {
        text: transcriptText
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      largeModelOutput = colabResponse.data.result;

      if (!largeModelOutput) {
        throw new Error('Large model processing in Colab returned empty output.');
      }
      console.log('[Node.js] Large model processing in Colab successful.');
      
      // Use the output directly if it's the final summary
      const summaryText = largeModelOutput;

      // Save Summary to DB
      const newSummary = summaryRepository.create({
        transcript_id: newTranscript.id,
        public_id: cloudinaryResult.public_id, // Use public_id directly from cloudinaryResult
        summary_text: summaryText,
        summary_type: summaryType,
        model_used: 'colab-llm', // Reflect the model used
        created_at: new Date(),
      });
      await summaryRepository.save(newSummary);

      await videoRepository.update(video.id, { processing_status: 'geoprocessing' }); // New status
      await logUsage(video.user_id, video.id, 'summarization_completed', { summaryId: newSummary.id, status: 'summarized' });


      // --- 3. Generate Geospatial Commands ---
      console.log(`[Node.js] Starting geospatial command generation for video ID: ${video.id}...`);

      if (video.duration_seconds === undefined || video.duration_seconds === null) {
          throw new Error('Video duration is required for geospatial processing but is missing.');
      }

      const geospatialCommands = await callGeospatialService(
        video.id,
        transcriptText,
        video.duration_seconds // Ensure this is a number
      );

      // Save Geospatial Commands to DB
      const commandsToCreate = geospatialCommands.map(cmd => {
        const newCommand = geospatialCommandRepository.create({
          id: cmd.command_id, // Use the ID generated by Python service
          videoId: cmd.video_id,
          commandType: cmd.command_type,
          startTimeOffsetSeconds: cmd.start_time_offset_seconds,
          endTimeOffsetSeconds: cmd.end_time_offset_seconds || null,
          commandData: cmd.command_data_json, // JSONB column directly accepts object
          generatedAt: new Date(cmd.generated_at), // Convert ISO string to Date object
        });
        return newCommand;
      });

      console.log('commands to create 👍 your data is ready:',commandsToCreate);
      await geospatialCommandRepository.save(commandsToCreate);
      console.log(`[Node.js] Saved ${commandsToCreate.length} geospatial commands for video ID: ${video.id}.`);

      await videoRepository.update(video.id, { processing_status: 'completed' });
      await logUsage(video.user_id, video.id, 'geospatial_processing_completed', { status: 'completed' });

      console.log(`[Node.js] Video processing pipeline completed successfully for video ID: ${video.id}`);

    } catch (llmError) {
      console.error(`[Node.js] Error during LLM summarization or subsequent steps for video ID ${videoId}:`, llmError);
      throw new Error(`LLM summarization/geospatial failed: ${llmError instanceof Error ? llmError.message : String(llmError)}`);
    }

  } catch (error) {
    console.error(`[Node.js] Error during video processing pipeline for video ID ${videoId}:`, error);
    if (video) {
      await videoRepository.update(video.id, { processing_status: 'failed' });
      await logUsage(video.user_id, video.id, 'processing_failed', {
        message: `Video processing failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    } else {
      console.error(`[Node.js] Critical: Video object was null during processing failure for video ID ${videoId}`);
    }
  }
};

/**
 * Fetches all details for a video, including transcript, summary, and geospatial commands.
 * @param videoId The ID of the video to fetch.
 * @returns Video object with relations, or null if not found.
 */
export const getFullVideoDetailsWithCommands = async (videoId: string): Promise<Video | null> => {
  return videoRepository.findOne({
    where: { id: videoId },
    relations: ['transcript', 'summary', 'geospatialCommands'], // Eager load all related data
    order: { 
      geospatialCommands: { 
        startTimeOffsetSeconds: 'ASC' // Order commands chronologically
      } 
    } 
  });
};



// // src/services/videoProcessingService.ts
// import { AppDataSource } from '../data-source';
// import { Video } from '../entity/Video';
// import { Transcript } from '../entity/Transcript';
// import { Summary } from '../entity/Summary';
// import { UserSettings } from '../entity/UserSettings';
// import { UsageLog } from '../entity/UsageLog';
// import { summarizeTextWithDeepSeek } from './openAIService'; // Keep summarizeTextWithGPT4 for GPT-4
// import { logUsage } from './usageLogService';
// import path from 'path';
// import fs from 'fs/promises';
// import axios from 'axios'; // New: Import axios



// /**
//  * Calls the local Python Whisper server to transcribe a video.
//  * @param videoUrl The direct URL to the video file (e.g., Cloudinary URL).
//  * @returns The transcribed text.
//  */
// const callLocalWhisperService = async (videoUrl: string): Promise<string> => {
//   try {
//     console.log(`Calling local Whisper server for transcription of: ${videoUrl}`);
//     const response = await axios.post('http://127.0.0.1:5001/transcribe_video', {
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
//         console.error('Local Whisper server error response:', error.response.data);
//         throw new Error(`Local Whisper server error: ${error.response.data.error || 'Unknown error'}`);
//     }
//     throw new Error(`Failed to get transcription from local Whisper: ${error instanceof Error ? error.message : String(error)}`);
//   }
// };


// export const processVideoForAI = async (videoId: string,cloudinaryResult:any): Promise<void> => {
//   const videoRepository = AppDataSource.getRepository(Video);
//   const transcriptRepository = AppDataSource.getRepository(Transcript);
//   const summaryRepository = AppDataSource.getRepository(Summary);
//   const userSettingsRepository = AppDataSource.getRepository(UserSettings);

//   let video: Video | null = null;
//   let transcriptText: string | undefined;

//   try {
//     video = await videoRepository.findOneBy({ id: videoId });
//     if (!video) {
//       console.error(`Video with ID ${videoId} not found for processing.`);
//       return;
//     }

//     console.log(`Starting processing for video: ${video.title} (ID: ${video.id})`);
//     await videoRepository.update(video.id, { processing_status: 'transcribing' }); // Changed status
//     await logUsage(video.user_id, video.id, 'processing_started', { status: 'transcribing_via_local_whisper' }); // Updated log

//     // --- 1. Transcribe Audio with Local Whisper ---
//     // Pass the Cloudinary storage_url directly to the Python server
//     transcriptText = await callLocalWhisperService(video.storage_url);
//     if (!transcriptText) {
//       throw new Error('Transcription returned empty text.');
//     }

//     // Save Transcript to DB
//     const newTranscript = transcriptRepository.create({
//       video_id: video.id,
//       transcript_content: transcriptText,
//       model_used: 'whisper-base-local', // Indicate local model
//       tone_version: '', // Or infer/get from local Whisper if it supports language detection
//       created_at: new Date(),
//     });
//     await transcriptRepository.save(newTranscript);

//     await videoRepository.update(video.id, { processing_status: 'summarizing' });
//     await logUsage(video.user_id, video.id, 'transcription_completed', { transcriptId: newTranscript.id, source: 'local_whisper' });


//     // --- 2. Summarize Text with GPT-4 (still using OpenAI API for this) ---
//     console.log('Starting GPT-4 summarization...');

//     const userSettings = await userSettingsRepository.findOneBy({ user_id: video.user_id });
//     const summaryType = userSettings?.default_summary_type || 'concise';
//     // const outputLanguage = userSettings?.default_output_language || 'Hinglish';


//     const colabUrl = process.env.COLAB_LARGE_MODEL_URL;
//     if (!colabUrl) {
//         throw new Error('COLAB_LARGE_MODEL_URL is not set in .env');
//     }

//     let largeModelOutput: string | null = null;
//     // try {
//         const colabResponse = await axios.post(colabUrl + '/process_large_model', {
//             text: transcriptText // Send the transcript to Colab
//         }, {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });
//         largeModelOutput = colabResponse.data.result; // Assuming Colab returns { "result": "..." }

//         if (!largeModelOutput) {
//             throw new Error('Large model processing in Colab returned empty output.');
//         }
//         console.log('Large model processing in Colab successful.');
//         // Now you have the output from the large model.
//         // You can save this as the summary or pass it to DeepSeek if further summarization is needed.

//         // If the Colab model *is* your summarizer, then this is your summaryText
//         const summaryText = largeModelOutput; // Use the output directly if it's the final summary



//     // const summaryText = await summarizeTextWithDeepSeek(transcriptText, summaryType, outputLanguage);
//     // if (!summaryText) {
//     //   throw new Error('Summarization returned empty text.');
//     // }

//     // Save Summary to DB
//     const newSummary = summaryRepository.create({
//       transcript_id: newTranscript.id,
//       public_id: cloudinaryResult.resource_type === 'video' ? cloudinaryResult?.is_audio ? cloudinaryResult?.is_audio?.x : cloudinaryResult?.x : video.video_id,
//       summary_text: summaryText,
//       summary_type: summaryType,
//       model_used: 'gpt-4',
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
//     // No temporary audio file cleanup needed here anymore, as Python handles it
//   }
// };