import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/auth";
import { AuthRequest } from "../middleware/auth";
import { Response } from "express";

const router = Router();
const prisma = new PrismaClient();

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  const { items, shippingAddress, paymentMethod, notes } = req.body;
  const totalAmount = items.reduce((sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity, 0);

  const order = await prisma.order.create({
    data: {
      buyerId: req.user!.id,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
      shippingAddress,
      notes,
      items: {
        create: items.map((i: { productId: string; quantity: number; price: number }) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  return res.status(201).json(order);
});

router.get("/my", authenticate, async (req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { buyerId: req.user!.id },
    include: { items: { include: { product: { select: { title: true, images: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return res.json(orders);
});

router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: { include: { product: true } }, buyer: { select: { name: true, email: true } } },
  });
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.buyerId !== req.user!.id && req.user!.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }
  return res.json(order);
});

router.patch("/:id/status", authenticate, async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { status } });
  return res.json(order);
});

export default router;

