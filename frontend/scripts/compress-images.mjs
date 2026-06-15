import sharp from "sharp";
import { existsSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");

function kb(bytes) {
  return (bytes / 1024).toFixed(0) + " KB";
}

async function compress(file, opts) {
  const input = path.join(PUBLIC, file);
  if (!existsSync(input)) { console.log(`⚠️  Not found: ${file}`); return; }

  const before = statSync(input).size;
  const tmp = input + ".tmp";

  let chain = sharp(input);
  if (opts.resize) chain = chain.resize(opts.resize.width, opts.resize.height, { fit: "inside", withoutEnlargement: true });
  if (opts.png) chain = chain.png({ quality: opts.quality ?? 80, compressionLevel: 9 });
  else chain = chain.webp({ quality: opts.quality ?? 82 });

  await chain.toFile(tmp);

  const after = statSync(tmp).size;
  // Only replace if smaller
  if (after < before) {
    const { renameSync } = await import("fs");
    renameSync(tmp, input);
    console.log(`✅ ${file}: ${kb(before)} → ${kb(after)} (saved ${kb(before - after)})`);
  } else {
    const { unlinkSync } = await import("fs");
    unlinkSync(tmp);
    console.log(`ℹ️  ${file}: already optimal (${kb(before)})`);
  }
}

// logo.png — small display size, high compression
await compress("logo.png", { resize: { width: 400, height: 120 }, png: true, quality: 85 });

// hero-bg.png — large background, WebP is best but keep as PNG for CSS compat
await compress("hero-bg.png", { resize: { width: 1920, height: 1080 }, png: true, quality: 75 });
