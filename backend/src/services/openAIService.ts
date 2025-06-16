// src/services/openAIService.ts
// import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

/**
 * Transcribes audio from a file using OpenAI Whisper.
 * @param audioFilePath Path to the local audio file (e.g., .mp3, .wav).
 * @returns The transcribed text.
 */
// export const transcribeAudioWithWhisper = async (audioFilePath: string): Promise<string> => {
//   try {
//     // Ensure the file exists
//     if (!fs.existsSync(audioFilePath)) {
//       throw new Error(`Audio file not found at: ${audioFilePath}`);
//     }

//     const transcription = await openai.audio.transcriptions.create({
//       file: fs.createReadStream(audioFilePath),
//       model: "whisper-1",
//     });
//     console.log('Whisper Transcription Result:', transcription.text);
//     return transcription.text;
//   } catch (error) {
//     console.error('Error transcribing audio with Whisper:', error);
//     throw new Error(`Whisper transcription failed: ${error instanceof Error ? error.message : String(error)}`);
//   }
// };

/**
 * Summarizes text using OpenAI GPT-4.
 * @param text The text to summarize.
 * @param summaryType Desired summary style (e.g., 'concise', 'detailed', 'bullet_points').
 * @param outputLanguage Desired language for the summary (e.g., 'English', 'Hindi').
 * @returns The summarized text.
 */
// export const summarizeTextWithGPT4 = async (
//   text: string,
//   summaryType: string = 'concise',
//   outputLanguage: string = 'Hindi'
// ): Promise<string> => {
//   try {
//     const prompt = `Please summarize the following text. The summary should be ${summaryType} and in ${outputLanguage}.
    
//     Text to summarize:
//     """
//     ${text}
//     """
//     `;

//     const chatCompletion = await openai.chat.completions.create({
//       model: "gpt-4", // Use gpt-4 for high-quality summarization
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7, // Adjust for creativity vs. faithfulness
//       max_tokens: 500, // Max tokens for the summary
//     });

//     const summary = chatCompletion.choices[0].message.content;
//     console.log('GPT-4 Summary Result:', summary);
//     if (!summary) {
//         throw new Error("GPT-4 did not return a summary.");
//     }
//     return summary;
//   } catch (error) {
//     console.error('Error summarizing text with GPT-4:', error);
//     throw new Error(`GPT-4 summarization failed: ${error instanceof Error ? error.message : String(error)}`);
//   }
// };

// src/services/anthropicAIService.ts (or rename openAIService.ts)
// import Anthropic from '@anthropic-ai/sdk';

// const anthropic = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY, // You'll need a new environment variable for Anthropic API Key
// });

// export const summarizeTextWithClaude = async (text: string, summaryType: string, outputLanguage: string): Promise<string | null> => {
//   try {
//     const response = await anthropic.messages.create({
//       model: 'claude-3-sonnet-20240229', // Or 'claude-3-haiku-20240307', 'claude-3-opus-20240229'
//       max_tokens: 1000, // Adjust as needed for summary length
//       messages: [
//         {
//           role: 'user',
//           content: `Please summarize the following text. The summary should be ${summaryType} and in ${outputLanguage}.

//           Text to summarize:
//           """
//           ${text}
//           """
//           `,
//         },
//       ],
//     });

//    // Corrected logic:
//     // 1. Find the content block that is of type 'text'
//     const summaryBlock = response.content.find(block => block.type === 'text');

//     // 2. Add a type guard: Check if summaryBlock exists AND if its type is 'text'
//     // This tells TypeScript that within this 'if' block, summaryBlock is specifically a TextBlock.
//     if (summaryBlock && summaryBlock.type === 'text') {
//       return summaryBlock.text;
//     }

//     // If no text block was found, or if it wasn't a text type for some reason, return null.
//     return null;

//   } catch (error) {
//     console.error('Error summarizing text with Claude:', error);
//     throw error; // Re-throw or handle as appropriate for your application
//   }
// };

// src/services/deepseekAIService.ts

// import * as DeepSeekModule  from 'deepseek';

// dotenv.config(); // Load environment variables

// const deepseek = new DeepSeekModule.DeepSeek({
//   apiKey: process.env.DEEPSEEK_API_KEY, // Ensure you have this in your .env file
// });

// /**
//  * Summarizes text using DeepSeek AI's chat model.
//  * @param text The text content to be summarized.
//  * @param summaryType The desired type of summary (e.g., 'concise', 'detailed').
//  * @param outputLanguage The desired language for the summary (e.g., 'English').
//  * @returns The summarized text, or null if an error occurs.
//  */
// export const summarizeTextWithDeepSeek = async (
//   text: string,
//   summaryType: string,
//   outputLanguage: string
// ): Promise<string | null> => {
//   try {
//     console.log(`Summarizing text with DeepSeek AI (${summaryType}, ${outputLanguage})...`);

//     const completion = await deepseek.chat.completions.create({
//       model: 'deepseek-chat', // The recommended model for general chat and summarization
//       messages: [
//         {
//           role: 'system',
//           content: `You are a helpful assistant that summarizes text. The summary should be ${summaryType} and in ${outputLanguage}.`
//         },
//         {
//           role: 'user',
//           content: `Text to summarize:\n"""\n${text}\n"""`
//         },
//       ],
//       max_tokens: 1000, // Adjust this based on your expected summary length
//       temperature: 0.7, // Adjust this for creativity (0.0 for deterministic, 1.0 for more creative)
//     });

//     const summaryContent = completion.choices[0]?.message?.content;

//     if (!summaryContent) {
//       console.warn('DeepSeek summarization returned empty content.');
//       return null;
//     }

//     console.log('DeepSeek summarization successful.');
//     return summaryContent;

//   } catch (error) {
//     console.error('Error summarizing text with DeepSeek AI:', error);
//     // You might want to log more details about the error
//     if (error instanceof Error) {
//       console.error('DeepSeek Error message:', error.message);
//       // If it's an API error, you might check error.response for more details if available
//     }
//     throw error; // Re-throw the error so your video processing logic can catch it
//   }
// };

// src/services/deepseekAIService.ts

// Change this line to the correct package and client class name
// import { DeepseekClient } from '@deepseek-ai/api';

// dotenv.config(); // Load environment variables

// // Instantiate the correct client class
// const deepseek = new DeepseekClient({
//   apiKey: process.env.DEEPSEEK_API_KEY, // Ensure you have this in your .env file
// });

// /**
//  * Summarizes text using DeepSeek AI's chat model.
//  * @param text The text content to be summarized.
//  * @param summaryType The desired type of summary (e.g., 'concise', 'detailed').
//  * @param outputLanguage The desired language for the summary (e.g., 'English').
//  * @returns The summarized text, or null if an error occurs.
//  */
// export const summarizeTextWithDeepSeek = async (
//   text: string,
//   summaryType: string,
//   outputLanguage: string
// ): Promise<string | null> => {
//   try {
//     console.log(`Summarizing text with DeepSeek AI (${summaryType}, ${outputLanguage})...`);

//     const completion = await deepseek.chat.completions.create({
//       model: 'deepseek-chat', // This model name is correct
//       messages: [
//         {
//           role: 'system',
//           content: `You are a helpful assistant that summarizes text. The summary should be ${summaryType} and in ${outputLanguage}.`
//         },
//         {
//           role: 'user',
//           content: `Text to summarize:\n"""\n${text}\n"""`
//         },
//       ],
//       max_tokens: 1000,
//       temperature: 0.7,
//     });

//     const summaryContent = completion.choices[0]?.message?.content;

//     if (!summaryContent) {
//       console.warn('DeepSeek summarization returned empty content.');
//       return null;
//     }

//     console.log('DeepSeek summarization successful.');
//     return summaryContent;

//   } catch (error) {
//     console.error('Error summarizing text with DeepSeek AI:', error);
//     if (error instanceof Error) {
//       console.error('DeepSeek Error message:', error.message);
//     }
//     throw error;
//   }
// };

// src/services/deepseekAIService.ts

// We use the 'openai' package because DeepSeek's API is compatible with OpenAI's spec
import OpenAI from 'openai'; // Make sure this is 'openai' (uppercase O, lowercase AI)

dotenv.config(); // Load environment variables

// --- Initialize the OpenAI client, pointing it to DeepSeek's API endpoint ---
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY, // Your DeepSeek API key
  baseURL: 'https://api.deepseek.com/v1', // DeepSeek's API base URL
});

/**
 * Summarizes text using DeepSeek AI's chat model.
 * @param text The text content to be summarized.
 * @param summaryType The desired type of summary (e.g., 'concise', 'detailed').
 * @param outputLanguage The desired language for the summary (e.g., 'English').
 * @returns The summarized text, or null if an error occurs.
 */
export const summarizeTextWithDeepSeek = async (
  text: string,
  summaryType: string,
  outputLanguage: string
): Promise<string | null> => {
  try {
    console.log(`Summarizing text with DeepSeek AI (${summaryType}, ${outputLanguage})...`);

    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat', // This is the correct model name for DeepSeek's general chat model
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that summarizes text. The summary should be ${summaryType} and in ${outputLanguage}.`
        },
        {
          role: 'user',
          content: `Text to summarize:\n"""\n${text}\n"""`
        },
      ],
      max_tokens: 1000, // Adjust this based on your expected summary length
      temperature: 0.7, // Adjust for creativity (0.0 for deterministic, 1.0 for more creative)
    });

    const summaryContent = completion.choices[0]?.message?.content;

    if (!summaryContent) {
      console.warn('DeepSeek summarization returned empty content.');
      return null;
    }

    console.log('DeepSeek summarization successful.');
    return summaryContent;

  } catch (error) {
    console.error('Error summarizing text with DeepSeek AI:', error);
    if (error instanceof OpenAI.APIError) { // You can specifically catch OpenAI API errors
      console.error(`DeepSeek API Error Status: ${error.status}`);
      console.error(`DeepSeek API Error Code: ${error.code}`);
      console.error(`DeepSeek API Error Message: ${error.message}`);
      console.error(`DeepSeek API Error Type: ${error.type}`);
    } else if (error instanceof Error) {
      console.error('General Error message:', error.message);
    }
    throw error;
  }
};