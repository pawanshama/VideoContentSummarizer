// src/routes/userSettingsRoutes.ts
import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/userSettings.controller';
import { checkAdmin } from '../middlewares/admin';

const router = Router();

// GET /api/settings/:userId - to get a user's settings
router.get('/:userId',checkAdmin, getSettings);

// PUT /api/settings/:userId - to update a user's settings
router.put('/:userId',checkAdmin, updateSettings);

export default router;