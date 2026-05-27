import { Server, Socket } from "socket.io";

interface UserCursor {
  userId: string;
  userName: string;
  line: number;
  column: number;
  color: string;
}

const userColors = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
];

const sessionUsers = new Map<string, Map<string, UserCursor>>();
const socketUserMap = new Map<string, { sessionId: string; userId: string }>();

function getColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
  }
  return userColors[Math.abs(hash) % userColors.length];
}

export function handleCollab(io: Server, socket: Socket) {
  socket.on("join:session", ({ sessionId, userId, userName }) => {
    socket.join(sessionId);
    socketUserMap.set(socket.id, { sessionId, userId });

    if (!sessionUsers.has(sessionId)) {
      sessionUsers.set(sessionId, new Map());
    }

    const users = sessionUsers.get(sessionId)!;
    if (!users.has(userId)) {
      users.set(userId, {
        userId,
        userName: userName || "Anonymous",
        line: 1,
        column: 1,
        color: getColor(userId),
      });
    }

    socket.emit("session:joined", {
      users: Array.from(users.values()),
      currentCode: "",
    });

    socket.to(sessionId).emit("user:joined", {
      user: users.get(userId),
    });
  });

  socket.on("code:change", ({ sessionId, code, cursorPosition }) => {
    socket.to(sessionId).emit("code:update", {
      code,
      userId: socketUserMap.get(socket.id)?.userId,
      cursorPosition,
    });
  });

  socket.on("cursor:move", ({ sessionId, userId, line, column }) => {
    const users = sessionUsers.get(sessionId);
    if (users?.has(userId)) {
      const user = users.get(userId)!;
      user.line = line;
      user.column = column;

      socket.to(sessionId).emit("cursor:update", {
        userId,
        line,
        column,
        color: user.color,
        userName: user.userName,
      });
    }
  });

  socket.on("comment:add", ({ sessionId, line, content, userId, userName }) => {
    io.to(sessionId).emit("comment:new", {
      comment: {
        id: crypto.randomUUID(),
        sessionId,
        userId,
        userName,
        line,
        content,
        resolved: false,
        createdAt: new Date().toISOString(),
      },
    });
  });

  socket.on("comment:resolve", ({ commentId }) => {
    io.emit("comment:resolved", { commentId });
  });

  socket.on("disconnect", () => {
    const info = socketUserMap.get(socket.id);
    if (info) {
      const { sessionId, userId } = info;
      const users = sessionUsers.get(sessionId);
      if (users) {
        users.delete(userId);
        if (users.size === 0) {
          sessionUsers.delete(sessionId);
        }
      }
      io.to(sessionId).emit("user:left", { userId });
      socketUserMap.delete(socket.id);
    }
  });
}
