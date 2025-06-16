// src/controllers/userSettingsController.ts
import { Request, Response } from 'express';
import { getUserSettings, updateUserSettings } from '../services/userSettingsService';
import { logUsage } from '../services/usageLogService';

export const getSettings = async (req: Request, res: Response) => {
  const userId = req.params.userId; // Assuming user ID comes from URL parameter

  try {
    const settings = await getUserSettings(userId);
    await logUsage(userId, null, 'user_settings_retrieved', {});
    res.json(settings);
  } catch (error) {
    console.error(`Error getting settings for user ${userId}:`, error);
    await logUsage(userId, null, 'user_settings_retrieve_failed', { message: error instanceof Error ? error.message : String(error) });
    res.status(500).json({ message: `Failed to retrieve user settings: ${error instanceof Error ? error.message : String(error)}` });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  const userId = req.params.userId; // Assuming user ID comes from URL parameter
  const updates = req.body; // Updates to apply to settings

  try {
    const updatedSettings = await updateUserSettings(userId, updates);
    await logUsage(userId, null, 'user_settings_updated', updates);
    res.json(updatedSettings);
  } catch (error) {
    console.error(`Error updating settings for user ${userId}:`, error);
    await logUsage(userId, null, 'user_settings_update_failed', { message: error instanceof Error ? error.message : String(error), updates });
    res.status(500).json({ message: `Failed to update user settings: ${error instanceof Error ? error.message : String(error)}` });
  }
};