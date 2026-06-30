import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth";
import { uniqueSellerSlug } from "../lib/slug";
import { Response } from "express";

const router = Router();

// GET version so admin can be created by visiting a URL directly
router.get("/setup", async (req: any, res: Response) => {
  const { phone, password, secret } = req.query as Record<string, string>;
  req.body = { phone, password, secret };
  return setupHandler(req, res);
});

router.post("/setup", async (req: any, res: Response) => {
  return setupHandler(req, res);
});

async function setupHandler(req: any, res: Response) {
  const { phone, password, secret } = req.body;
  if (secret !== "jemlamaroc-setup-2026") return res.status(403).json({ message: "Invalid secret" });
  const normalized = phone.startsWith("0") ? "+212" + phone.slice(1) : phone;

  const hashed = await bcrypt.hash(password || "Admin@2026", 12);

  const existing = await prisma.user.findUnique({ where: { phone: normalized } });
  if (existing) {
    const user = await prisma.user.update({
      where: { phone: normalized },
      data: { role: "ADMIN", password: hashed },
    });
    return res.json({ message: "Admin promoted", id: user.id, phone: user.phone });
  }

  // Create new admin user
  const user = await prisma.user.create({
    data: {
      name: "Admin",
      phone: normalized,
      email: `${normalized.replace("+", "")}@jemlamaroc.ma`,
      password: hashed,
      role: "ADMIN",
    },
  });
  return res.status(201).json({ message: "Admin created", id: user.id, phone: user.phone });
}

// One-time slug backfill — no auth needed, protected by secret
router.get("/backfill-slugs", async (req: any, res: Response) => {
  if (req.query.secret !== "jemlamaroc-setup-2026") return res.status(403).json({ message: "Invalid secret" });
  const profiles = await prisma.sellerProfile.findMany({ where: { slug: null }, select: { id: true, businessName: true, userId: true } });
  const updated: string[] = [];
  for (const p of profiles) {
    const slug = await uniqueSellerSlug(p.businessName, p.userId);
    await prisma.sellerProfile.update({ where: { id: p.id }, data: { slug } });
    updated.push(`${p.businessName} → ${slug}`);
  }
  return res.json({ backfilled: updated.length, slugs: updated });
});

router.use(authenticate, requireRole("ADMIN"));

// ── Stats ──────────────────────────────────────────────────────────────
router.get("/stats", async (_req, res: Response) => {
  const [userCount, productCount, orderCount, sellerCount, recentUsers, recentProducts] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.sellerProfile.count(),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, phone: true, role: true, city: true, createdAt: true } }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { seller: { select: { name: true } }, category: true } }),
  ]);
  return res.json({ userCount, productCount, orderCount, sellerCount, recentUsers, recentProducts });
});

// ── Users ──────────────────────────────────────────────────────────────
router.get("/users", async (_req, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, phone: true, role: true, city: true, createdAt: true, sellerProfile: { select: { businessName: true, verified: true } } },
    orderBy: { createdAt: "desc" },
  });
  return res.json(users);
});

router.patch("/users/:id/role", async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { role: req.body.role } });
  return res.json({ id: user.id, role: user.role });
});

router.delete("/users/:id", async (req: AuthRequest, res: Response) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  return res.json({ message: "User deleted" });
});

// ── Sellers ────────────────────────────────────────────────────────────
router.get("/sellers", async (_req, res: Response) => {
  const sellers = await prisma.sellerProfile.findMany({
    include: {
      user: { select: { id: true, name: true, phone: true, city: true, createdAt: true, isBlocked: true, _count: { select: { products: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return res.json(sellers);
});

router.patch("/sellers/:id/profile", async (req: AuthRequest, res: Response) => {
  const { businessName, description, logo, banner, city, whatsapp } = req.body;
  const data: any = { businessName, description, logo, banner, city, whatsapp };
  if (businessName) {
    data.slug = await uniqueSellerSlug(businessName, req.params.id);
  }
  const profile = await prisma.sellerProfile.update({
    where: { userId: req.params.id },
    data,
  });
  return res.json(profile);
});

router.patch("/sellers/:id/verify", async (req: AuthRequest, res: Response) => {
  const profile = await prisma.sellerProfile.update({
    where: { userId: req.params.id },
    data: { verified: req.body.verified },
  });
  return res.json(profile);
});

router.patch("/sellers/:id/block", async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { isBlocked: req.body.blocked },
  });
  // Also toggle all products visibility
  await prisma.product.updateMany({
    where: { sellerId: req.params.id },
    data: { isActive: !req.body.blocked },
  });
  return res.json({ id: user.id, isBlocked: user.isBlocked });
});

router.delete("/sellers/:id", async (req: AuthRequest, res: Response) => {
  // Delete products first, then seller profile, then user
  await prisma.product.deleteMany({ where: { sellerId: req.params.id } });
  await prisma.sellerProfile.delete({ where: { userId: req.params.id } });
  await prisma.user.update({ where: { id: req.params.id }, data: { role: "BUYER" } });
  return res.json({ message: "Seller deleted" });
});

// ── Products ───────────────────────────────────────────────────────────
router.get("/products", async (_req, res: Response) => {
  const products = await prisma.product.findMany({
    include: {
      seller: { select: { id: true, name: true } },
      category: { select: { nameFr: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return res.json(products);
});

router.patch("/products/:id/toggle", async (req: AuthRequest, res: Response) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ message: "Not found" });
  const updated = await prisma.product.update({ where: { id: req.params.id }, data: { isActive: !product.isActive } });
  return res.json({ id: updated.id, isActive: updated.isActive });
});

router.delete("/products/:id", async (req: AuthRequest, res: Response) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  return res.json({ message: "Product deleted" });
});

// ── Categories ─────────────────────────────────────────────────────────
router.get("/categories", async (_req, res: Response) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return res.json(categories);
});

router.post("/categories", async (req: AuthRequest, res: Response) => {
  const { name, nameAr, nameFr, slug, icon, image } = req.body;
  if (!name || !nameAr || !nameFr || !slug) return res.status(400).json({ message: "Champs requis manquants" });
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return res.status(400).json({ message: "Ce slug existe déjà" });
  const category = await prisma.category.create({ data: { name, nameAr, nameFr, slug, icon, image } });
  return res.status(201).json(category);
});

router.patch("/categories/:id", async (req: AuthRequest, res: Response) => {
  const { name, nameAr, nameFr, slug, icon, image } = req.body;
  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: { name, nameAr, nameFr, slug, icon, image },
  });
  return res.json(category);
});

router.delete("/categories/:id", async (req: AuthRequest, res: Response) => {
  const count = await prisma.product.count({ where: { categoryId: req.params.id } });
  if (count > 0) return res.status(400).json({ message: `Impossible : ${count} produit(s) utilisent cette catégorie` });
  await prisma.category.delete({ where: { id: req.params.id } });
  return res.json({ message: "Catégorie supprimée" });
});

// ── Orders ─────────────────────────────────────────────────────────────
router.get("/orders", async (_req, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      buyer: { select: { name: true, phone: true } },
      items: { include: { product: { select: { title: true, price: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return res.json(orders);
});

export default router;
