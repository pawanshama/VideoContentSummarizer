import { Router } from "express";
import { checkAdmin } from "../middlewares/admin";
import { getPdf } from "../controllers/features.controller";
const router = Router();
router.get('/generate-pdf/:id',checkAdmin,getPdf);
export default router;