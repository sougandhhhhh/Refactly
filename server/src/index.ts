import express from "express";
import cors from "cors";
import { createServer } from "http";
import { config } from "./config";
import { initSocket } from "./socket";
import authRoutes from "./routes/auth.routes";
import sessionRoutes from "./routes/session.routes";
import reviewRoutes from "./routes/review.routes";
import userRoutes from "./routes/user.routes";
import { authConfig } from "./auth/auth.config";
import { createAuthHandler } from "./auth/auth.handler";

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: "10mb" }));

app.use("/auth", authRoutes);

const authHandler = createAuthHandler(authConfig);
app.all("/api/auth/*splat", authHandler);
app.use("/sessions", sessionRoutes);
app.use("/review", reviewRoutes);
app.use("/user", userRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

initSocket(httpServer);

httpServer.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
