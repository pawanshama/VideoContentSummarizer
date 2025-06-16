// src/routes/userSettingsRoutes.ts
import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/userSettings.controller';

const router = Router();

// GET /api/settings/:userId - to get a user's settings
router.get('/:userId', getSettings);

// PUT /api/settings/:userId - to update a user's settings
router.put('/:userId', updateSettings);

export default router;