import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

export async function triggerReview(req: AuthRequest, res: Response) {
  try {
    const { sessionId, code, language } = req.body;

    // Import dynamically to avoid circular dependencies
    const { addReviewJob } = await import("../services/queue.service");
    const job = await addReviewJob({ sessionId, code, language });

    res.json({ jobId: job.id, message: "Review queued" });
  } catch (error) {
    console.error("Trigger review error:", error);
    res.status(500).json({ error: "Failed to queue review" });
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
