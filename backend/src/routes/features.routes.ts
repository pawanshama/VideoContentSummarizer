import { Router } from "express";
import { checkAdmin } from "../middlewares/admin";
import { getPdf, getSummary } from "../controllers/features.controller";
const router = Router();

router.get('/generate-pdf/:id',checkAdmin,getPdf);
router.get('/:id', getSummary); 

export default router;