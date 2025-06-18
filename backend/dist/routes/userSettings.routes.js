"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userSettingsRoutes.ts
const express_1 = require("express");
const userSettings_controller_1 = require("../controllers/userSettings.controller");
const router = (0, express_1.Router)();
// GET /api/settings/:userId - to get a user's settings
router.get('/:userId', userSettings_controller_1.getSettings);
// PUT /api/settings/:userId - to update a user's settings
router.put('/:userId', userSettings_controller_1.updateSettings);
exports.default = router;
