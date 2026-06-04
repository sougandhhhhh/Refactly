import { Router } from "express";
import { Response } from "express";
import { signup, login, googleAuth, googleCallback } from "../controllers/auth.controller";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { z } from "zod";
import { config } from "../config";
import { createClient } from "@supabase/supabase-js";

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

router.post("/set-password", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const supabaseAdmin = createClient(config.supabase.url, config.supabase.serviceKey);
    const { error } = await supabaseAdmin.auth.admin.updateUserById(req.userId!, { password });
    if (error) throw error;
    res.json({ message: "Password updated" });
  } catch (error) {
    console.error("Set password error:", error);
    res.status(500).json({ error: "Failed to set password" });
  }
});

export default router;
