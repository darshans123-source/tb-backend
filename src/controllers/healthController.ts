import { Request, Response } from "express";
import { aiService } from "../services/aiService.js";
import { userService } from "../services/userService.js";

export function getRoot(req: Request, res: Response) {
  res.json({
    status: "OK",
    message: "TB Quest Backend Running"
  });
}

export function getHealth(req: Request, res: Response) {
  res.json({
    success: true,
    status: "OK",
    aiConfigured: aiService.isConfigured(),
    activeUsersCount: userService.count()
  });
}
