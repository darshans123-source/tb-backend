import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt.js";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. Authentication token missing." });
  }

  const decoded = verifyJWT(token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired authentication session." });
  }

  req.user = decoded;
  next();
}
