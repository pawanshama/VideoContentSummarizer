// src/services/usageLogService.ts
import { AppDataSource } from '../data-source';
import { UsageLog } from '../entity/UsageLog';

/**
 * Logs a usage event to the database.
 * @param userId The ID of the user associated with the event.
 * @param videoId The ID of the video associated with the event (optional).
 * @param eventType A string describing the type of event (e.g., 'video_uploaded', 'transcription_completed').
 * @param eventDetails An optional object containing additional details about the event.
 */
export const logUsage = async (
  userId: string,
  videoId: string | null = null, // Make videoId nullable
  eventType: string,
  eventDetails: object = {}
): Promise<UsageLog> => {
  const usageLogRepository = AppDataSource.getRepository(UsageLog);
  try {
    const newLog = usageLogRepository.create({
      user_id: userId,
      video_id: (videoId==null)?undefined:videoId, // This can be null
      event_type: eventType,
      event_details: eventDetails,
      created_at: new Date(),
    });
    await usageLogRepository.save(newLog);
    // console.log(`Usage logged: ${eventType} for user ${userId}${videoId ? `, video ${videoId}` : ''}`);
    return newLog;
  } catch (error) {
    console.error(`Error logging usage for ${eventType} by user ${userId}:`, error);
    throw new Error(`Failed to log usage: ${error instanceof Error ? error.message : String(error)}`);
  }
};