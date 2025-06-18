// src/routes/userRoutes.ts
import { Router } from 'express';
import { signUsers, loginUser } from '../controllers/user.controller';
import {checkAdmin} from "../middlewares/admin";

const router = Router();

router.post('/signup', signUsers);
router.post('/login', loginUser);

export default router;