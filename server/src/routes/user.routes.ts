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

    const scoreAgg = await prisma.review.aggregate({
      where: { session: { ownerId: req.userId } },
      _avg: { score: true },
      _max: { score: true },
      _min: { score: true },
    });

    const recentReviews = await prisma.review.findMany({
      where: { session: { ownerId: req.userId } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { score: true, createdAt: true },
    });

    const recentSessions = await prisma.session.findMany({
      where: { ownerId: req.userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, language: true, createdAt: true },
    });

    const recentActivity = await Promise.all(
      recentSessions.map(async (session) => {
        const latestReview = await prisma.review.findFirst({
          where: { sessionId: session.id },
          orderBy: { createdAt: "desc" },
          select: { score: true },
        });
        return { ...session, score: latestReview?.score ?? null };
      })
    );

    const languageGroups = await prisma.session.groupBy({
      by: ["language"],
      where: { ownerId: req.userId },
      _count: { language: true },
    });

    const issueReviews = await prisma.review.findMany({
      where: { session: { ownerId: req.userId } },
      select: { securityIssues: true, codeSmells: true },
    });
    const totalIssues = issueReviews.reduce((sum, r) => {
      const sec = Array.isArray(r.securityIssues) ? (r.securityIssues as any[]).length : 0;
      const smell = Array.isArray(r.codeSmells) ? (r.codeSmells as any[]).length : 0;
      return sum + sec + smell;
    }, 0);

    res.json({
      totalSessions: sessionCount,
      totalReviews: reviewCount,
      averageScore: Math.round(scoreAgg._avg.score || 0),
      bestScore: scoreAgg._max.score || 0,
      worstScore: scoreAgg._min.score || 0,
      totalIssues,
      scoreHistory: recentReviews.reverse(),
      recentActivity,
      languageBreakdown: languageGroups.map((g) => ({ language: g.language, count: g._count.language })),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
