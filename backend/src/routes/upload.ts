import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import { authenticate } from "../middleware/auth";
import { Response } from "express";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = Router();

// Accept base64 image, upload to Cloudinary, return secure URL
router.post("/", authenticate, async (req: any, res: Response) => {
  const { data, folder = "jemlamaroc" } = req.body;
  if (!data) return res.status(400).json({ message: "No image data" });

  try {
    const result = await cloudinary.uploader.upload(data, {
      folder,
      transformation: [{ width: 400, height: 400, crop: "fill", quality: "auto" }],
    });
    return res.json({ url: result.secure_url });
  } catch (err: any) {
    return res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

export default router;
