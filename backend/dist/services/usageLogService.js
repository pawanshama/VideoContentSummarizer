"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logUsage = void 0;
// src/services/usageLogService.ts
const data_source_1 = require("../data-source");
const UsageLog_1 = require("../entity/UsageLog");
/**
 * Logs a usage event to the database.
 * @param userId The ID of the user associated with the event.
 * @param videoId The ID of the video associated with the event (optional).
 * @param eventType A string describing the type of event (e.g., 'video_uploaded', 'transcription_completed').
 * @param eventDetails An optional object containing additional details about the event.
 */
const logUsage = async (userId, videoId = null, // Make videoId nullable
eventType, eventDetails = {}) => {
    const usageLogRepository = data_source_1.AppDataSource.getRepository(UsageLog_1.UsageLog);
    try {
        const newLog = usageLogRepository.create({
            user_id: userId,
            video_id: (videoId == null) ? undefined : videoId, // This can be null
            event_type: eventType,
            event_details: eventDetails,
            created_at: new Date(),
        });
        await usageLogRepository.save(newLog);
        // console.log(`Usage logged: ${eventType} for user ${userId}${videoId ? `, video ${videoId}` : ''}`);
        return newLog;
    }
    catch (error) {
        console.error(`Error logging usage for ${eventType} by user ${userId}:`, error);
        throw new Error(`Failed to log usage: ${error instanceof Error ? error.message : String(error)}`);
    }
};
exports.logUsage = logUsage;
