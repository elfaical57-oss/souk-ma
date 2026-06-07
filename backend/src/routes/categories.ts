import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

const SEED_CATEGORIES = [
  { name: "Électronique", nameAr: "إلكترونيات", nameFr: "Électronique", slug: "electronics", icon: "💻" },
  { name: "Mode & Vêtements", nameAr: "الموضة والملابس", nameFr: "Mode & Vêtements", slug: "fashion", icon: "👗" },
  { name: "Maison & Déco", nameAr: "المنزل والديكور", nameFr: "Maison & Déco", slug: "home", icon: "🏠" },
  { name: "Alimentation", nameAr: "الغذاء", nameFr: "Alimentation", slug: "food", icon: "🍎" },
  { name: "Auto & Moto", nameAr: "السيارات", nameFr: "Auto & Moto", slug: "auto", icon: "🚗" },
  { name: "Artisanat", nameAr: "الصناعة التقليدية", nameFr: "Artisanat", slug: "handicraft", icon: "🏺" },
  { name: "Matériaux BTP", nameAr: "مواد البناء", nameFr: "Matériaux BTP", slug: "construction", icon: "🧱" },
  { name: "Agriculture", nameAr: "الزراعة", nameFr: "Agriculture", slug: "agriculture", icon: "🌿" },
];

router.get("/", async (_req: Request, res: Response) => {
  let categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  if (categories.length === 0) {
    await prisma.category.createMany({ data: SEED_CATEGORIES, skipDuplicates: true });
    categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  }
  return res.json(categories);
});

export default router;
