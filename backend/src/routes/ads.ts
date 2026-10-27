import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();
const DEFAULT_AD = {
  id: "homepage",
  imageUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=65",
  targetUrl: "/sellers",
};

const updateSchema = z.object({
  imageUrl: z.string().url().max(2048).refine((value) => value.startsWith("https://"), "L’image doit utiliser HTTPS."),
  targetUrl: z.string().min(1).max(2048).refine((value) => {
    if (value.startsWith("/")) return !value.startsWith("//");
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }, "Le lien doit être une URL http(s) ou un chemin interne."),
});

router.get("/homepage", async (_req: Request, res: Response) => {
  const ad = await prisma.homepageAd.findUnique({ where: { id: "homepage" } });
  return res.json(ad ?? DEFAULT_AD);
});

router.put("/homepage", authenticate, requireRole("ADMIN"), async (req: Request, res: Response) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message || "Données invalides." });
  }

  const ad = await prisma.homepageAd.upsert({
    where: { id: "homepage" },
    update: parsed.data,
    create: { id: "homepage", ...parsed.data },
  });
  return res.json(ad);
});

async function trackEvent(type: "impression" | "click", _req: Request, res: Response) {
  try {
    await prisma.adEvent.create({ data: { adId: "homepage", type } });
  } catch (err: any) {
    // Never let a tracking hiccup break the banner or the buyer's click-through.
    console.error(`[trackAdEvent:${type}]`, err?.message ?? err);
  }
  return res.status(204).end();
}

router.post("/homepage/impression", (req: Request, res: Response) => trackEvent("impression", req, res));
router.post("/homepage/click", (req: Request, res: Response) => trackEvent("click", req, res));

export default router;
