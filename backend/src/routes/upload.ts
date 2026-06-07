import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { Response } from "express";

const router = Router();

// Upload image to ImgBB (free) — accepts base64, returns URL
router.post("/", authenticate, async (req: any, res: Response) => {
  const { data } = req.body;
  if (!data) return res.status(400).json({ message: "No image data" });

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) return res.status(500).json({ message: "IMGBB_API_KEY not configured" });

  try {
    // Strip data URI prefix if present
    const base64 = data.includes(",") ? data.split(",")[1] : data;

    const form = new URLSearchParams();
    form.append("key", apiKey);
    form.append("image", base64);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: form,
    });
    const result = await response.json() as any;

    if (!result.success) {
      return res.status(500).json({ message: "Upload failed", error: result.error });
    }
    return res.json({ url: result.data.display_url });
  } catch (err: any) {
    return res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

export default router;
