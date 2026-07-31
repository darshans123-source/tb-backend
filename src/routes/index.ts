import { Router } from "express";
import healthRoutes from "./healthRoutes.js";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import aiRoutes from "./aiRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = Router();

// Mount root health check on router root
router.use("/", healthRoutes);

// Module API endpoints
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/user", userRoutes); // Alias for singular path
router.use("/ai", aiRoutes);
router.use("/gemini", aiRoutes); // Alias for gemini endpoint path
router.use("/admin", adminRoutes);

export default router;
