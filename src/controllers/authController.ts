import { Request, Response } from "express";
import { userService } from "../services/userService.js";
import { generateJWT, hashPassword } from "../utils/jwt.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export function register(req: Request, res: Response) {
  const { name, email, password, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Name, email, and password are required fields." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters in length." });
  }

  const existingUser = userService.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: "An account with this email address already exists." });
  }

  const newUser = userService.createUser(name, email, password, role);

  const token = generateJWT({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role
  });

  const { passwordHash, ...userProfile } = newUser;
  res.status(201).json({ token, user: userProfile });
}

export function login(req: Request, res: Response) {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please enter your email and password." });
  }

  const user = userService.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const inputHash = hashPassword(password);
  if (inputHash !== user.passwordHash) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  if (role && (role === 'student' || role === 'faculty' || role === 'admin')) {
    userService.updateRole(email, role);
  }

  const token = generateJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });

  const { passwordHash, ...userProfile } = user;
  res.json({ token, user: userProfile });
}

export function getMe(req: AuthenticatedRequest, res: Response) {
  const user = userService.findByEmail(req.user.email);
  if (!user) {
    return res.status(404).json({ error: "User account not found." });
  }

  const { passwordHash, ...userProfile } = user;
  res.json({ user: userProfile });
}

export function logout(req: Request, res: Response) {
  res.json({ message: "Successfully logged out session." });
}

export function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Please enter your registered email address." });
  }

  res.json({ message: `If an account exists for ${email}, a password reset link has been sent.` });
}
