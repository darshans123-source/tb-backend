import { Router } from "express";
import { getAdminUsers, updateAdminConfig, getAdminLogs } from "../controllers/adminController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/users", authenticateToken, getAdminUsers);
router.post("/config", authenticateToken, updateAdminConfig);
router.get("/logs", authenticateToken, getAdminLogs);

export default router;
