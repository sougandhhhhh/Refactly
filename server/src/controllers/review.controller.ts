import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { runAIReview } from "../services/ai.service";
import { scanForVulnerabilities } from "../services/security.service";
import { analyzeComplexity } from "../services/complexity.service";
import { analyzeAST } from "../services/ast.service";

const prisma = new PrismaClient();

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

    // Persist session + review in the database
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
          shareToken: uuidv4(),
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

    res.json({ review: reviewData, ast, sessionId: session.id });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to run review";
    console.error("Trigger review error:", msg);
    res.status(500).json({ error: msg });
  }
}

export async function getReview(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    console.error("Get review error:", error);
    res.status(500).json({ error: "Failed to fetch review" });
  }
}
