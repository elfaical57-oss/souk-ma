import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/auth";
import { AuthRequest } from "../middleware/auth";
import { Response } from "express";

const router = Router();
const prisma = new PrismaClient();

router.post("/:productId", authenticate, async (req: AuthRequest, res: Response) => {
  const { rating, comment } = req.body;
  const review = await prisma.review.upsert({
    where: { userId_productId: { userId: req.user!.id, productId: req.params.productId } },
    update: { rating, comment },
    create: { userId: req.user!.id, productId: req.params.productId, rating, comment },
  });

  const agg = await prisma.review.aggregate({
    where: { productId: req.params.productId },
    _avg: { rating: true },
  });

  return res.json({ review, avgRating: agg._avg.rating });
});

router.get("/:productId", async (req, res: Response) => {
  const reviews = await prisma.review.findMany({
    where: { productId: req.params.productId },
    include: { user: { select: { name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
  });
  return res.json(reviews);
});

export default router;

