import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { AuthRequest } from "../middleware/auth";

const productSchema = z.object({
  title: z.string().min(3),
  titleAr: z.string().optional(),
  titleFr: z.string().optional(),
  description: z.string().min(10),
  descriptionAr: z.string().optional(),
  descriptionFr: z.string().optional(),
  price: z.number().positive(),
  minOrderQty: z.number().int().positive().default(1),
  bulkPrices: z.array(z.object({ qty: z.number(), price: z.number() })).optional(),
  variations: z.array(z.object({ name: z.string(), options: z.array(z.string()) })).optional(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string()).min(1),
  categoryId: z.string(),
  city: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const getProducts = async (req: Request, res: Response) => {
  const { search, category, city, minPrice, maxPrice, page = "1", limit = "20" } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const where: Record<string, unknown> = { isActive: true };
  if (search) where.OR = [
    { title: { contains: search as string, mode: "insensitive" } },
    { titleAr: { contains: search as string, mode: "insensitive" } },
    { titleFr: { contains: search as string, mode: "insensitive" } },
    { tags: { has: search as string } },
  ];
  if (category) where.category = { slug: category };
  if (city) where.city = city;
  if (minPrice || maxPrice) where.price = {
    ...(minPrice ? { gte: parseFloat(minPrice as string) } : {}),
    ...(maxPrice ? { lte: parseFloat(maxPrice as string) } : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: parseInt(limit as string),
      include: { category: true, seller: { select: { id: true, name: true, sellerProfile: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return res.json({ products, total, page: parseInt(page as string), pages: Math.ceil(total / parseInt(limit as string)) });
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: {
      category: true,
      seller: { select: { id: true, name: true, sellerProfile: true } },
      reviews: { include: { user: { select: { name: true, avatar: true } } }, take: 10 },
    },
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  await prisma.product.update({ where: { id: req.params.id }, data: { views: { increment: 1 } } });
  return res.json(product);
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  try {
    const product = await prisma.product.create({
      data: { ...parsed.data, sellerId: req.user!.id },
    });
    return res.status(201).json(product);
  } catch (err: any) {
    console.error("[createProduct]", err?.message ?? err);
    return res.status(500).json({ message: err?.message || "Erreur serveur lors de la création du produit." });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.sellerId !== req.user!.id && req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const updated = await prisma.product.update({ where: { id: req.params.id }, data: req.body });
    return res.json(updated);
  } catch (err: any) {
    console.error("[updateProduct]", err?.message ?? err);
    return res.status(500).json({ message: err?.message || "Erreur serveur." });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.sellerId !== req.user!.id && req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    await prisma.product.delete({ where: { id: req.params.id } });
    return res.json({ message: "Product deleted" });
  } catch (err: any) {
    console.error("[deleteProduct]", err?.message ?? err);
    return res.status(500).json({ message: err?.message || "Erreur serveur." });
  }
};

