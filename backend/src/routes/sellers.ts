import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth";
import { uniqueSellerSlug } from "../lib/slug";
import { Response, Request } from "express";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const sellers = await prisma.sellerProfile.findMany({
    where: { user: { isBlocked: false } },
    include: { user: { select: { id: true, name: true, email: true, city: true } } },
    orderBy: { totalSales: "desc" },
  });
  return res.json(sellers);
});

// Must be above /:id to avoid being swallowed
router.get("/my-products", authenticate, requireRole("SELLER"), async (req: AuthRequest, res: Response) => {
  const products = await prisma.product.findMany({
    where: { sellerId: req.user!.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(products);
});

router.get("/dashboard/stats", authenticate, requireRole("SELLER"), async (req: AuthRequest, res: Response) => {
  const [productCount, orderItems] = await Promise.all([
    prisma.product.count({ where: { sellerId: req.user!.id } }),
    prisma.orderItem.findMany({
      where: { product: { sellerId: req.user!.id } },
      include: { order: true },
    }),
  ]);
  const totalRevenue = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalOrders = new Set(orderItems.map((i) => i.orderId)).size;
  return res.json({ productCount, totalRevenue, totalOrders });
});

router.put("/profile", authenticate, requireRole("SELLER"), async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const data: any = { ...req.body };
  if (req.body.businessName) {
    data.slug = await uniqueSellerSlug(req.body.businessName, userId);
  }
  const profile = await prisma.sellerProfile.update({ where: { userId }, data });
  return res.json(profile);
});

router.get("/:id", async (req: Request, res: Response) => {
  const param = req.params.id;
  const seller = await prisma.sellerProfile.findFirst({
    where: { OR: [{ userId: param }, { slug: param }] },
    include: {
      user: {
        select: {
          id: true, name: true, email: true, city: true, createdAt: true,
          products: { where: { isActive: true }, take: 20, include: { category: true } },
        },
      },
    },
  });
  if (!seller) return res.status(404).json({ message: "Seller not found" });
  return res.json(seller);
});

export default router;
