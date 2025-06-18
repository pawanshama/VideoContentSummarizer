"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSettings = exports.getUserSettings = void 0;
// src/services/userSettingsService.ts
const data_source_1 = require("../data-source");
const UserSettings_1 = require("../entity/UserSettings");
const User_1 = require("../entity/User");
/**
 * Retrieves a user's settings. If settings don't exist, it creates default ones.
 * @param userId The ID of the user.
 * @returns The user's settings.
 */
const getUserSettings = async (userId) => {
    const userSettingsRepository = data_source_1.AppDataSource.getRepository(UserSettings_1.UserSettings);
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    let userSettings = await userSettingsRepository.findOneBy({ user_id: userId });
    if (!userSettings) {
        // If settings don't exist, create default ones
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error(`User with ID ${userId} not found when trying to create default settings.`);
        }
        userSettings = userSettingsRepository.create({
            user_id: userId,
            user: user, // Link the User object
            default_summary_type: 'concise',
            default_output_language: 'Hinglish',
            auto_delete_original_video: false,
            created_at: new Date(),
            updated_at: new Date(),
        });
        await userSettingsRepository.save(userSettings);
        console.log(`Created default settings for user: ${userId}`);
    }
    return userSettings;
};
exports.getUserSettings = getUserSettings;
/**
 * Updates a user's settings.
 * @param userId The ID of the user whose settings are being updated.
 * @param updates An object containing the settings to update.
 * @returns The updated user settings.
 */
const updateUserSettings = async (userId, updates) => {
    const userSettingsRepository = data_source_1.AppDataSource.getRepository(UserSettings_1.UserSettings);
    const userSettings = await userSettingsRepository.findOneBy({ user_id: userId });
    if (!userSettings) {
        throw new Error(`Settings for user ${userId} not found.`);
    }
    // Apply updates, excluding ID and relationships
    const fieldsToUpdate = {};
    if (updates.default_summary_type !== undefined)
        fieldsToUpdate.default_summary_type = updates.default_summary_type;
    if (updates.default_output_language !== undefined)
        fieldsToUpdate.default_output_language = updates.default_output_language;
    if (updates.auto_delete_original_video !== undefined)
        fieldsToUpdate.auto_delete_original_video = updates.auto_delete_original_video;
    if (updates.notification_preferences !== undefined)
        fieldsToUpdate.notification_preferences = updates.notification_preferences;
    await userSettingsRepository.update(userSettings.id, {
        ...fieldsToUpdate,
        updated_at: new Date(), // Always update timestamp on update
    });
    // Fetch and return the updated entity to get latest values
    const updatedSettings = await userSettingsRepository.findOneBy({ user_id: userId });
    if (!updatedSettings) {
        throw new Error("Failed to retrieve updated settings.");
    }
    return updatedSettings;
};
exports.updateUserSettings = updateUserSettings;
