"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const userSettingsService_1 = require("../services/userSettingsService");
const usageLogService_1 = require("../services/usageLogService");
const getSettings = async (req, res) => {
    const userId = req.params.userId; // Assuming user ID comes from URL parameter
    try {
        const settings = await (0, userSettingsService_1.getUserSettings)(userId);
        await (0, usageLogService_1.logUsage)(userId, null, 'user_settings_retrieved', {});
        res.json(settings);
    }
    catch (error) {
        console.error(`Error getting settings for user ${userId}:`, error);
        await (0, usageLogService_1.logUsage)(userId, null, 'user_settings_retrieve_failed', { message: error instanceof Error ? error.message : String(error) });
        res.status(500).json({ message: `Failed to retrieve user settings: ${error instanceof Error ? error.message : String(error)}` });
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
    const userId = req.params.userId; // Assuming user ID comes from URL parameter
    const updates = req.body; // Updates to apply to settings
    try {
        const updatedSettings = await (0, userSettingsService_1.updateUserSettings)(userId, updates);
        await (0, usageLogService_1.logUsage)(userId, null, 'user_settings_updated', updates);
        res.json(updatedSettings);
    }
    catch (error) {
        console.error(`Error updating settings for user ${userId}:`, error);
        await (0, usageLogService_1.logUsage)(userId, null, 'user_settings_update_failed', { message: error instanceof Error ? error.message : String(error), updates });
        res.status(500).json({ message: `Failed to update user settings: ${error instanceof Error ? error.message : String(error)}` });
    }
};
exports.updateSettings = updateSettings;
