import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import { config } from "../config";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

async function ensureUserRecord(userId: string, email?: string) {
  if (!process.env.DATABASE_URL) return;
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    await prisma.user.upsert({
      where: { id: userId },
      update: { email: email || "" },
      create: { id: userId, email: email || "", name: email?.split("@")[0] || "User" },
    });
    await prisma.$disconnect();
  } catch (e) {
    console.warn("Failed to upsert user:", e instanceof Error ? e.message : e);
  }
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  // Try server JWT first
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; email: string };
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    await ensureUserRecord(req.userId, req.userEmail);
    return next();
  } catch {
    // Not a server JWT, try Supabase token
  }

  // Try Supabase session token
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.userId = user.id;
    req.userEmail = user.email || undefined;
    await ensureUserRecord(req.userId, req.userEmail);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
