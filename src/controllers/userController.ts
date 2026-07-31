import { Response } from "express";
import { userService } from "../services/userService.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export function getProfile(req: AuthenticatedRequest, res: Response) {
  const user = userService.findByEmail(req.user.email);
  if (!user) {
    return res.status(404).json({ error: "User profile not found." });
  }
  const { passwordHash, ...profile } = user;
  res.json(profile);
}

export function getAchievements(req: AuthenticatedRequest, res: Response) {
  res.json([
    { id: '1', title: 'Pulmonary Master', description: 'Completed 10 pulmonary cases' },
    { id: '2', title: 'CBNAAT Master', description: 'Diagnosed 5 MDR cases correctly' },
    { id: '3', title: 'Pediatric Specialist', description: 'Completed 5 pediatric cases' },
    { id: '4', title: 'TB Diagnostic Expert', description: 'Mastered all diagnostic algorithm flowcharts' }
  ]);
}
