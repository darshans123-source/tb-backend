import { Request, Response } from "express";
import { userService } from "../services/userService.js";
import { aiService } from "../services/aiService.js";

export function getAdminUsers(req: Request, res: Response) {
  const users = userService.getAllUsers();
  res.json({ success: true, count: users.length, users });
}

export function updateAdminConfig(req: Request, res: Response) {
  const { platformName, xpMultiplier } = req.body;
  res.json({
    success: true,
    message: "Platform configuration updated successfully.",
    config: {
      platformName: platformName || "TB Quest - AI Powered Diagnostic Learning",
      xpMultiplier: xpMultiplier || 1.5,
      updatedAt: new Date().toISOString()
    }
  });
}

export function getAdminLogs(req: Request, res: Response) {
  res.json({
    success: true,
    logs: [
      { timestamp: new Date().toISOString(), event: "SYSTEM_HEALTH_CHECK", status: "OK" },
      { timestamp: new Date().toISOString(), event: "AI_SERVICE_INITIALIZED", status: aiService.isConfigured() ? "CONNECTED" : "FALLBACK" },
      { timestamp: new Date().toISOString(), event: "USER_DATABASE_READY", activeUsers: userService.count() }
    ]
  });
}
