// Product photos need more resolution than a logo/avatar — unoptimized:true
// in next.config.mjs (sharp is broken on this host) means whatever width
// gets uploaded is exactly what every visitor downloads, so this is also
// the floor for Google's large-image-preview eligibility in search results.
export const PRODUCT_IMAGE_MAX_WIDTH = 1200;

// Canvas silently falls back to PNG instead of erroring when a browser can't
// encode WebP, so the only reliable check is to look at what it actually
// produced. Cached because it's the same answer for the whole session.
let webpSupported: boolean | null = null;
function supportsWebP(): boolean {
  if (webpSupported !== null) return webpSupported;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    webpSupported = canvas.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    webpSupported = false;
  }
  return webpSupported;
}

export function compressImage(dataUrl: string, maxWidth = 800, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Already small enough — re-encoding through canvas would only cost
      // quality (a fresh lossy pass) for zero size benefit, since there's
      // nothing to shrink. Upload the original bytes untouched instead.
      if (img.width <= maxWidth) {
        resolve(dataUrl);
        return;
      }
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      // Canvas defaults to low-quality smoothing when scaling down, which
      // visibly blurs fine detail (text, logos) — "high" costs nothing here
      // since this only runs once per upload, not per frame.
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);
      resolve(
        supportsWebP()
          ? canvas.toDataURL("image/webp", quality)
          : canvas.toDataURL("image/jpeg", quality)
      );
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// Read a File as data URL
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Upload directly from browser to ImgBB — bypasses backend body size limits
export async function uploadImageToImgBB(dataUrlOrFile: string | File, maxWidth = 800, quality = 0.8): Promise<string> {
  let dataUrl: string;
  if (typeof dataUrlOrFile === "string") {
    dataUrl = dataUrlOrFile;
  } else {
    dataUrl = await readFileAsDataUrl(dataUrlOrFile);
  }

  const compressed = await compressImage(dataUrl, maxWidth, quality);
  const base64 = compressed.split(",")[1];

  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "625d1f7f5185e487acc6d4355842d2de";

  const form = new URLSearchParams();
  form.append("key", key);
  form.append("image", base64);

  const res = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!data.success) throw new Error("ImgBB upload failed");
  return data.data.display_url as string;
}
