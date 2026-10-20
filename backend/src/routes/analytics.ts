import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

const VALID_SOURCES = ["product_order", "product_inquiry", "seller_profile", "supplier_card"];

router.post("/whatsapp-click", async (req: Request, res: Response) => {
  const { sellerId, productId, source } = req.body;
  if (typeof sellerId !== "string" || !sellerId || !VALID_SOURCES.includes(source)) {
    return res.status(400).json({ message: "Invalid payload" });
  }
  try {
    await prisma.whatsAppClick.create({
      data: { sellerId, productId: typeof productId === "string" ? productId : null, source },
    });
  } catch (err: any) {
    // Don't let a bad/stale sellerId break the buyer's WhatsApp redirect flow.
    console.error("[trackWhatsAppClick]", err?.message ?? err);
  }
  return res.status(204).end();
});

export default router;
