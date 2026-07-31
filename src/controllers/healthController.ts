import { Request, Response } from "express";
import { aiService } from "../services/aiService.js";
import { userService } from "../services/userService.js";

export function getHealth(req: Request, res: Response) {
  res.json({
    status: "ok",
    aiConfigured: aiService.isConfigured(),
    activeUsersCount: userService.count()
  });
}
