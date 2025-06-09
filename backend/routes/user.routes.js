import { Router } from "express";
import {
    createUser,
    deleteUser,
    loginUser,
    logoutUser,
    updateUser
} from "../controllers/user.contollers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/adduser", createUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.put("/update", verifyJWT, updateUser);
router.delete("/delete", verifyJWT,  deleteUser);

export default router;