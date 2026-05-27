import { Router } from "express";
import { signup, login, googleAuth, googleCallback } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { z } from "zod";

const router = Router();

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

router.post("/signup", validate(authSchema), signup);
router.post("/login", validate(authSchema), login);
router.post("/google", googleAuth);
router.post("/google/callback", googleCallback);

export default router;
