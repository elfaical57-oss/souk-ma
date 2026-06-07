import { Server, Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const setupSocketHandlers = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication required"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      (socket as Socket & { userId?: string }).userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = (socket as Socket & { userId?: string }).userId!;
    socket.join(`user:${userId}`);

    socket.on("join-conversation", (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("send-message", async ({ conversationId, content }: { conversationId: string; content: string }) => {
      const message = await prisma.message.create({
        data: { conversationId, senderId: userId, content },
        include: { sender: { select: { id: true, name: true, avatar: true } } },
      });
      io.to(`conversation:${conversationId}`).emit("new-message", message);
      await prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
    });

    socket.on("disconnect", () => {
      socket.leave(`user:${userId}`);
    });
  });
};

