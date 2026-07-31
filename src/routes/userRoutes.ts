import { Router } from "express";
import { getProfile, getAchievements } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/profile", authenticateToken, getProfile);
router.get("/achievements", getAchievements);

export default router;
