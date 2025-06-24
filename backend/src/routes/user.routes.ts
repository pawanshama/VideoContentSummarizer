// src/routes/userRoutes.ts
import { Router } from 'express';
import { signUsers, loginUser,protectRoute } from '../controllers/user.controller';
import {checkAdmin} from "../middlewares/admin";

const router = Router();

router.post('/signup', signUsers);
router.post('/login', loginUser);
router.get('/protectedRoute/:id',checkAdmin,protectRoute);
export default router;