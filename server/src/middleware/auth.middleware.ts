import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import { config } from "../config";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

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
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
