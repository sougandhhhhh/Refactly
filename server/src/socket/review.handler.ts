import { Server, Socket } from "socket.io";
import { addReviewJob } from "../services/queue.service";

export function handleReview(io: Server, socket: Socket) {
  socket.on("review:request", async ({ sessionId, code, language }) => {
    try {
      const job = await addReviewJob({ sessionId, code, language });
      socket.emit("review:queued", { jobId: job.id });
    } catch (error) {
      socket.emit("review:error", { message: "Failed to queue review" });
    }
  });
}
