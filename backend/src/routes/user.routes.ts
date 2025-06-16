// src/routes/userRoutes.ts
import { Router } from 'express';
import { signUsers, loginUser } from '../controllers/user.controller';
import {checkAdmin} from "../middlewares/admin";

const router = Router();

router.get('/signup', signUsers);
router.post('/login',checkAdmin, loginUser);

export default router;