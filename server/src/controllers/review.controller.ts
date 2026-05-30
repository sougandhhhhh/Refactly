import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { runAIReview } from "../services/ai.service";
import { scanForVulnerabilities } from "../services/security.service";
import { analyzeComplexity } from "../services/complexity.service";
import { analyzeAST } from "../services/ast.service";

export async function triggerReview(req: AuthRequest, res: Response) {
  try {
    const { code, language } = req.body;

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

    const review = {
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

    res.json({ review, ast });
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
