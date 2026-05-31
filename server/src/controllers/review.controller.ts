import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { runAIReview } from "../services/ai.service";
import { scanForVulnerabilities } from "../services/security.service";
import { analyzeComplexity } from "../services/complexity.service";
import { analyzeAST } from "../services/ast.service";

export async function triggerReview(req: AuthRequest, res: Response) {
  try {
    const { code, language, sessionId } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const [aiReview, securityIssues, complexity, ast] = await Promise.all([
      runAIReview(code, language || "typescript"),
      Promise.resolve(scanForVulnerabilities(code)),
      Promise.resolve(analyzeComplexity(code, language || "typescript")),
      Promise.resolve(analyzeAST(code, language || "typescript")),
    ]);

    const allSecurityIssues = [...securityIssues, ...aiReview.security];

    const reviewData = {
      suggestions: aiReview.suggestions,
      securityIssues: allSecurityIssues,
      complexity: {
        time: aiReview.complexity.time || complexity.time,
        space: aiReview.complexity.space || complexity.space,
        explanation: aiReview.complexity.explanation || complexity.explanation,
        perFunction: complexity.perFunction,
      },
      codeSmells: aiReview.codeSmells,
      score: aiReview.score,
      summary: aiReview.summary,
    };

    // Persist session + review if DATABASE_URL is configured
    let resolvedSessionId = sessionId;
    if (process.env.DATABASE_URL) {
      try {
        const { PrismaClient } = await import("@prisma/client");
        const { v4 } = await import("uuid");
        const prisma = new PrismaClient();

        let session;
        if (sessionId) {
          session = await prisma.session.findUnique({ where: { id: sessionId } });
          if (session && session.ownerId === req.userId) {
            await prisma.session.update({
              where: { id: sessionId },
              data: { code, language },
            });
          }
        }

        if (!session) {
          session = await prisma.session.create({
            data: {
              title: "Untitled Session",
              language: language || "javascript",
              code,
              ownerId: req.userId!,
              shareToken: v4(),
            },
          });
        }

        await prisma.review.create({
          data: {
            sessionId: session.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            aiSuggestions: reviewData.suggestions as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            securityIssues: reviewData.securityIssues as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            complexity: reviewData.complexity as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            codeSmells: reviewData.codeSmells as any,
            score: reviewData.score,
            summary: reviewData.summary,
          },
        });

        await prisma.$disconnect();
        resolvedSessionId = session.id;
      } catch (dbErr) {
        console.warn("DB unavailable, skipping persistence:", dbErr instanceof Error ? dbErr.message : dbErr);
      }
    }

    res.json({ review: reviewData, ast, sessionId: resolvedSessionId });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to run review";
    console.error("Trigger review error:", msg);
    res.status(500).json({ error: msg });
  }
}

export async function getReview(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    if (!process.env.DATABASE_URL) {
      return res.status(503).json({ error: "Database not configured" });
    }
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const review = await prisma.review.findUnique({ where: { id } });
    await prisma.$disconnect();
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    console.error("Get review error:", error);
    res.status(500).json({ error: "Failed to fetch review" });
  }
}
