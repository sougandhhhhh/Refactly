import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { config } from "../config";
import { handleCollab } from "./collab.handler";
import { handleReview } from "./review.handler";

let io: Server;

export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: config.clientUrl,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    handleCollab(io, socket);
    handleReview(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): Server {
  return io;
}
