import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

function dbUnavailable(res: Response) {
  return res.status(503).json({ error: "Database not configured" });
}

export async function createSession(req: AuthRequest, res: Response) {
  if (!process.env.DATABASE_URL) {
    // Return a fake session id so the UI can proceed ephemerally
    const { v4 } = await import("uuid");
    return res.status(201).json({ id: `ephemeral-${v4()}`, title: req.body.title || "Untitled Session", language: req.body.language || "javascript", code: req.body.code || "", createdAt: new Date().toISOString() });
  }
  try {
    const prisma = await getPrisma();
    const { v4 } = await import("uuid");
    const { title, language, code } = req.body;
    const session = await prisma.session.create({
      data: {
        title: title || "Untitled Session",
        language: language || "javascript",
        code: code || "",
        ownerId: req.userId!,
        shareToken: v4(),
      },
    });
    await prisma.$disconnect();
    res.status(201).json(session);
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
}

export async function getSessions(req: AuthRequest, res: Response) {
  if (!process.env.DATABASE_URL) return dbUnavailable(res);
  try {
    const prisma = await getPrisma();
    const sessions = await prisma.session.findMany({
      where: { ownerId: req.userId },
      orderBy: { updatedAt: "desc" },
      include: {
        reviews: { orderBy: { createdAt: "desc" }, take: 1 },
        _count: { select: { comments: true } },
      },
    });
    await prisma.$disconnect();
    res.json(sessions);
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
}

export async function getSession(req: AuthRequest, res: Response) {
  if (!process.env.DATABASE_URL) return dbUnavailable(res);
  try {
    const prisma = await getPrisma();
    const id = req.params.id as string;
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        reviews: { orderBy: { createdAt: "desc" } },
        comments: { include: { user: { select: { id: true, name: true, avatar: true } } } },
      },
    });
    await prisma.$disconnect();

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
  if (!process.env.DATABASE_URL) return dbUnavailable(res);
  try {
    const prisma = await getPrisma();
    const id = req.params.id as string;
    const { title, language, code } = req.body;

    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) {
      await prisma.$disconnect();
      return res.status(404).json({ error: "Session not found" });
    }
    if (session.ownerId !== req.userId) {
      await prisma.$disconnect();
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.session.update({
      where: { id },
      data: { title, language, code },
    });
    await prisma.$disconnect();
    res.json({ message: "Session updated" });
  } catch (error) {
    console.error("Update session error:", error);
    res.status(500).json({ error: "Failed to update session" });
  }
}

export async function deleteSession(req: AuthRequest, res: Response) {
  if (!process.env.DATABASE_URL) return dbUnavailable(res);
  try {
    const prisma = await getPrisma();
    const id = req.params.id as string;
    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) {
      await prisma.$disconnect();
      return res.status(404).json({ error: "Session not found" });
    }
    if (session.ownerId !== req.userId) {
      await prisma.$disconnect();
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.session.delete({ where: { id } });
    await prisma.$disconnect();
    res.json({ message: "Session deleted" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ error: "Failed to delete session" });
  }
}

export async function getSessionByShareToken(req: AuthRequest, res: Response) {
  if (!process.env.DATABASE_URL) return dbUnavailable(res);
  try {
    const prisma = await getPrisma();
    const token = req.params.token as string;
    const session = await prisma.session.findUnique({
      where: { shareToken: token },
      include: {
        reviews: { orderBy: { createdAt: "desc" } },
        owner: { select: { id: true, name: true, avatar: true } },
      },
    });
    await prisma.$disconnect();

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    console.error("Get shared session error:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
}
