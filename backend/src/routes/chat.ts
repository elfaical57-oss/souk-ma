import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";
import { Response } from "express";

const router = Router();
const prisma = new PrismaClient();

router.post("/conversations", authenticate, async (req: AuthRequest, res: Response) => {
  const { participantId } = req.body;
  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { id: req.user!.id } } },
        { participants: { some: { id: participantId } } },
      ],
    },
    include: { participants: { select: { id: true, name: true, avatar: true } } },
  });
  if (existing) return res.json(existing);

  const conversation = await prisma.conversation.create({
    data: { participants: { connect: [{ id: req.user!.id }, { id: participantId }] } },
    include: { participants: { select: { id: true, name: true, avatar: true } } },
  });
  return res.status(201).json(conversation);
});

router.get("/conversations", authenticate, async (req: AuthRequest, res: Response) => {
  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { id: req.user!.id } } },
    include: {
      participants: { select: { id: true, name: true, avatar: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });
  return res.json(conversations);
});

router.get("/conversations/:id/messages", authenticate, async (req: AuthRequest, res: Response) => {
  const messages = await prisma.message.findMany({
    where: { conversationId: req.params.id },
    include: { sender: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: "asc" },
  });
  await prisma.message.updateMany({
    where: { conversationId: req.params.id, senderId: { not: req.user!.id }, read: false },
    data: { read: true },
  });
  return res.json(messages);
});

export default router;

