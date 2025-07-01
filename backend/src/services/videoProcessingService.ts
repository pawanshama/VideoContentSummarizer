// src/services/videoProcessingService.ts
import { AppDataSource } from '../data-source';
import { Video } from '../entity/Video';
import { Transcript } from '../entity/Transcript';
import { Summary } from '../entity/Summary';
import { UserSettings } from '../entity/UserSettings';
import { UsageLog } from '../entity/UsageLog';
import { summarizeTextWithDeepSeek } from './openAIService'; // Keep summarizeTextWithGPT4 for GPT-4
import { logUsage } from './usageLogService';
import path from 'path';
import fs from 'fs/promises';
import axios from 'axios'; // New: Import axios



/**
 * Calls the local Python Whisper server to transcribe a video.
 * @param videoUrl The direct URL to the video file (e.g., Cloudinary URL).
 * @returns The transcribed text.
 */
const callLocalWhisperService = async (videoUrl: string): Promise<string> => {
  try {
    console.log(`Calling local Whisper server for transcription of: ${videoUrl}`);
    const response = await axios.post('http://127.0.0.1:5001/transcribe_video', {
      video_url: videoUrl
    });

    if (response.data && response.data.transcript) {
      console.log('Local Whisper transcription successful.');
      return response.data.transcript;
    } else {
      throw new Error(`Local Whisper server returned unexpected response: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error('Error calling local Whisper server:', error instanceof Error ? error.message : String(error));
    if (axios.isAxiosError(error) && error.response) {
        console.error('Local Whisper server error response:', error.response.data);
        throw new Error(`Local Whisper server error: ${error.response.data.error || 'Unknown error'}`);
    }
    throw new Error(`Failed to get transcription from local Whisper: ${error instanceof Error ? error.message : String(error)}`);
  }
};


export const processVideoForAI = async (videoId: string,cloudinaryResult:any): Promise<void> => {
  const videoRepository = AppDataSource.getRepository(Video);
  const transcriptRepository = AppDataSource.getRepository(Transcript);
  const summaryRepository = AppDataSource.getRepository(Summary);
  const userSettingsRepository = AppDataSource.getRepository(UserSettings);

  let video: Video | null = null;
  let transcriptText: string | undefined;

  try {
    video = await videoRepository.findOneBy({ id: videoId });
    if (!video) {
      console.error(`Video with ID ${videoId} not found for processing.`);
      return;
    }

    console.log(`Starting processing for video: ${video.title} (ID: ${video.id})`);
    await videoRepository.update(video.id, { processing_status: 'transcribing' }); // Changed status
    await logUsage(video.user_id, video.id, 'processing_started', { status: 'transcribing_via_local_whisper' }); // Updated log

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
    await logUsage(video.user_id, video.id, 'transcription_completed', { transcriptId: newTranscript.id, source: 'local_whisper' });


    // --- 2. Summarize Text with GPT-4 (still using OpenAI API for this) ---
    console.log('Starting GPT-4 summarization...');

    const userSettings = await userSettingsRepository.findOneBy({ user_id: video.user_id });
    const summaryType = userSettings?.default_summary_type || 'concise';
    // const outputLanguage = userSettings?.default_output_language || 'Hinglish';


    const colabUrl = process.env.COLAB_LARGE_MODEL_URL;
    if (!colabUrl) {
        throw new Error('COLAB_LARGE_MODEL_URL is not set in .env');
    }

    let largeModelOutput: string | null = null;
    // try {
        const colabResponse = await axios.post(colabUrl + '/process_large_model', {
            text: transcriptText // Send the transcript to Colab
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        largeModelOutput = colabResponse.data.result; // Assuming Colab returns { "result": "..." }

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
      public_id: cloudinaryResult.resource_type === 'video' ? cloudinaryResult?.is_audio ? cloudinaryResult?.is_audio?.x : cloudinaryResult?.x : video.video_id,
      summary_text: summaryText,
      summary_type: summaryType,
      model_used: 'gpt-4',
      created_at: new Date(),
    });
    await summaryRepository.save(newSummary);

    await videoRepository.update(video.id, { processing_status: 'completed' });
    await logUsage(video.user_id, video.id, 'summarization_completed', { summaryId: newSummary.id, status: 'completed' });

    console.log(`Video processing completed successfully for video ID: ${video.id}`);

  } catch (error) {
    console.error(`Error during video processing for video ID ${videoId}:`, error);
    if (video) {
      await videoRepository.update(video.id, { processing_status: 'failed' });
      await logUsage(video.user_id, video.id, 'processing_failed', {
        message: `Video processing failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    } else {
       console.error(`Critical: Video object was null during processing failure for video ID ${videoId}`);
    }
  } finally {
    // No temporary audio file cleanup needed here anymore, as Python handles it
  }
};