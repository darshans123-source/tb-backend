import crypto from "crypto";
import { config } from "../config/env.js";

export function hashPassword(password: string): string {
  const salt = "tb_quest_salt_2026";
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha256").toString("hex");
}

export function generateJWT(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  const signature = crypto.createHmac("sha256", config.jwtSecret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyJWT(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac("sha256", config.jwtSecret).update(`${header}.${body}`).digest("base64url");
    if (signature !== expectedSig) return null;
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
    if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}
