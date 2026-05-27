import { Router } from "express";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get("/profile", async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, avatar: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.get("/stats", async (req: AuthRequest, res: Response) => {
  try {
    const sessionCount = await prisma.session.count({ where: { ownerId: req.userId } });
    const reviewCount = await prisma.review.count({
      where: { session: { ownerId: req.userId } },
    });
    const avgScore = await prisma.review.aggregate({
      where: { session: { ownerId: req.userId } },
      _avg: { score: true },
    });
    const recentReviews = await prisma.review.findMany({
      where: { session: { ownerId: req.userId } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { score: true, createdAt: true },
    });

    res.json({
      totalSessions: sessionCount,
      totalReviews: reviewCount,
      averageScore: Math.round(avgScore._avg.score || 0),
      scoreHistory: recentReviews.reverse(),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
