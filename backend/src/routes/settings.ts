import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();
const DEFAULT_SETTINGS = { id: "main", supplierPopupEnabled: true };

router.get("/", async (_req: Request, res: Response) => {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
  return res.json(settings ?? DEFAULT_SETTINGS);
});

router.put("/", authenticate, requireRole("ADMIN"), async (req: Request, res: Response) => {
  const { supplierPopupEnabled } = req.body;
  if (typeof supplierPopupEnabled !== "boolean") {
    return res.status(400).json({ message: "supplierPopupEnabled doit être un booléen." });
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: { supplierPopupEnabled },
    create: { id: "main", supplierPopupEnabled },
  });
  return res.json(settings);
});

export default router;
