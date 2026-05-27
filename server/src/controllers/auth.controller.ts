import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { config } from "../config";

const prisma = new PrismaClient();
const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName } = req.body;
    const name = req.body.name || `${firstName || ""} ${lastName || ""}`.trim() || email.split("@")[0];

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${config.clientUrl}/auth/callback` },
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    try {
      await supabase.auth.admin.updateUserById(authData.user!.id, { email_confirm: true });
    } catch { /* non-critical: auto-confirm may fail silently */ }

    if (!authData.user) {
      return res.status(400).json({ error: "Failed to create user" });
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: { id: authData.user.id, email, name },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(401).json({ error: authError.message });
    }

    if (!authData.user) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = await prisma.user.findUnique({
      where: { id: authData.user.id },
    });

    const token = jwt.sign({ userId: user!.id, email: user!.email }, config.jwtSecret, {
      expiresIn: "7d",
    });

    res.json({ token, user: { id: user!.id, email: user!.email, name: user!.name, avatar: user!.avatar } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function googleAuth(req: Request, res: Response) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${config.clientUrl}/auth/callback`,
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ url: data.url });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: "Failed to initiate Google auth" });
  }
}

export async function googleCallback(req: Request, res: Response) {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "No authorization code provided" });
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid or expired code" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: data.user.id },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.full_name || data.user.email!.split("@")[0],
          avatar: data.user.user_metadata?.avatar_url,
        },
      });
    }

    const user = await prisma.user.findUnique({ where: { id: data.user.id } });

    const token = jwt.sign({ userId: user!.id, email: user!.email }, config.jwtSecret, {
      expiresIn: "7d",
    });

    res.json({ token, user: { id: user!.id, email: user!.email, name: user!.name, avatar: user!.avatar } });
  } catch (error) {
    console.error("Google callback error:", error);
    res.status(500).json({ error: "Failed to complete Google auth" });
  }
}
