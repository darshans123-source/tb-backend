import { Request, Response } from "express";
import { aiService } from "../services/aiService.js";

export async function chat(req: Request, res: Response) {
  const { prompt, context } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: "Prompt is required." });
  }

  const result = await aiService.generateContent(prompt, context);
  res.json(result);
}
