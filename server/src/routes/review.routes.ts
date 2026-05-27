import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { triggerReview, getReview } from "../controllers/review.controller";
import { rateLimit } from "../middleware/rateLimit.middleware";

const router = Router();

router.use(authenticate);

router.post("/analyze", rateLimit(5, 60), triggerReview);
router.get("/:id", getReview);

export default router;
