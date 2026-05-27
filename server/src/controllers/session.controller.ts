import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export async function createSession(req: AuthRequest, res: Response) {
  try {
    const { title, language, code } = req.body;
    const session = await prisma.session.create({
      data: {
        title: title || "Untitled Session",
        language: language || "javascript",
        code: code || "",
        ownerId: req.userId!,
        shareToken: uuidv4(),
      },
    });
    res.status(201).json(session);
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
}

export async function getSessions(req: AuthRequest, res: Response) {
  try {
    const sessions = await prisma.session.findMany({
      where: { ownerId: req.userId },
      orderBy: { updatedAt: "desc" },
      include: {
        reviews: { orderBy: { createdAt: "desc" }, take: 1 },
        _count: { select: { comments: true } },
      },
    });
    res.json(sessions);
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
}

export async function getSession(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        reviews: { orderBy: { createdAt: "desc" } },
        comments: { include: { user: { select: { id: true, name: true, avatar: true } } } },
      },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.ownerId !== req.userId && !session.isPublic) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json(session);
  } catch (error) {
    console.error("Get session error:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
}

export async function updateSession(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const { title, language, code } = req.body;

    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    if (session.ownerId !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updated = await prisma.session.update({
      where: { id },
      data: { title, language, code },
    });
    res.json(updated);
  } catch (error) {
    console.error("Update session error:", error);
    res.status(500).json({ error: "Failed to update session" });
  }
}

export async function deleteSession(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    if (session.ownerId !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.session.delete({ where: { id } });
    res.json({ message: "Session deleted" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ error: "Failed to delete session" });
  }
}

export async function getSessionByShareToken(req: AuthRequest, res: Response) {
  try {
    const token = req.params.token as string;
    const session = await prisma.session.findUnique({
      where: { shareToken: token },
      include: {
        reviews: { orderBy: { createdAt: "desc" } },
        owner: { select: { id: true, name: true, avatar: true } },
      },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    console.error("Get shared session error:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
}
