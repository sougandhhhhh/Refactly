import { Router } from "express";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  getSessionByShareToken,
} from "../controllers/session.controller";
import { saveSnapshot, getSnapshot, listSnapshots, ensureBucket } from "../services/storage.service";

const router = Router();

router.use(authenticate);

// Ensure storage bucket exists
ensureBucket().catch(console.warn);

router.post("/", createSession);
router.get("/", getSessions);
router.get("/shared/:token", getSessionByShareToken);

// Snapshot endpoints
router.post("/:id/snapshots", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { code, version } = req.body;
    const path = await saveSnapshot(id, code, version || Date.now());
    res.json({ path, version });
  } catch (error) {
    res.status(500).json({ error: "Failed to save snapshot" });
  }
});

router.get("/:id/snapshots", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const versions = await listSnapshots(id);
    res.json({ versions });
  } catch (error) {
    res.status(500).json({ error: "Failed to list snapshots" });
  }
});

router.get("/:id/snapshots/:version", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const version = parseInt(req.params.version as string);
    const code = await getSnapshot(id, version);
    if (code === null) {
      return res.status(404).json({ error: "Snapshot not found" });
    }
    res.json({ code, version });
  } catch (error) {
    res.status(500).json({ error: "Failed to load snapshot" });
  }
});

router.get("/:id", getSession);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

export default router;
