export type UserRole = "student" | "faculty" | "admin";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  level: number;
  xp: number;
  accuracy: number;
  streak: number;
  completedCases: number;
  createdAt: string;
}

export interface AuthJWTPayload {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  exp?: number;
}
