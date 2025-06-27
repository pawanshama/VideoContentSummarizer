// src/routes/userRoutes.ts
import { Router } from 'express';
import { signUsers, loginUser,protectRoute,clearCookies,getUserById} from '../controllers/user.controller';
import {checkAdmin} from "../middlewares/admin";

const router = Router();

router.post('/signup', signUsers);
router.post('/login', loginUser);
router.get('/protectedRoute',checkAdmin,protectRoute);
router.get('/clear/token/logout',checkAdmin,clearCookies);
router.get('/getuser/:id',checkAdmin,getUserById);
export default router;