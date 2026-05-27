import { runAIReview } from "./ai.service";
import { scanForVulnerabilities } from "./security.service";
import { analyzeComplexity } from "./complexity.service";
import { PrismaClient } from "@prisma/client";
import { getIO } from "../socket";

// Run review directly without queue (simpler for development)
export async function addReviewJob(data: { sessionId: string; code: string; language: string }) {
  const { sessionId, code, language } = data;
  
  // Run all analyses in parallel
  const [aiReview, securityIssues, complexity] = await Promise.all([
    runAIReview(code, language),
    Promise.resolve(scanForVulnerabilities(code)),
    Promise.resolve(analyzeComplexity(code, language)),
  ]);

  // Combine AI findings with local analysis
  const allSecurityIssues = [...securityIssues, ...aiReview.security];
  const allComplexity = {
    ...complexity,
    time: aiReview.complexity.time || complexity.time,
    space: aiReview.complexity.space || complexity.space,
    explanation: aiReview.complexity.explanation || complexity.explanation,
  };

  // Save review to database
  const prisma = new PrismaClient();
  const review = await prisma.review.create({
    data: {
      sessionId,
      aiSuggestions: aiReview.suggestions,
      securityIssues: allSecurityIssues,
      complexity: allComplexity,
      codeSmells: aiReview.codeSmells,
      score: aiReview.score,
      summary: aiReview.summary,
    },
  });

  // Emit completion via Socket.io
  const io = getIO();
  io.to(sessionId).emit("review:complete", { review });

  return { id: "direct", reviewId: review.id };
}
