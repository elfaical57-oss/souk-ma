export function compressImage(dataUrl: string, maxWidth = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = dataUrl;
  });
}

// Upload directly from browser to ImgBB — bypasses backend body size limits
export async function uploadImageToImgBB(dataUrl: string): Promise<string> {
  const compressed = await compressImage(dataUrl, 800, 0.75);
  const base64 = compressed.split(",")[1];

  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_IMGBB_API_KEY not set");

  const form = new URLSearchParams();
  form.append("key", key);
  form.append("image", base64);

  const res = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!data.success) throw new Error("ImgBB upload failed");
  return data.data.display_url as string;
}
