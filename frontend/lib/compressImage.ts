export function compressImage(dataUrl: string, maxWidth = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
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
export async function uploadImageToImgBB(dataUrlOrFile: string | File, maxWidth = 800): Promise<string> {
  let dataUrl: string;
  if (typeof dataUrlOrFile === "string") {
    dataUrl = dataUrlOrFile;
  } else {
    dataUrl = await readFileAsDataUrl(dataUrlOrFile);
  }

  const compressed = await compressImage(dataUrl, maxWidth, 0.75);
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
