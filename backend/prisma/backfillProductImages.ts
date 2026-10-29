// Standalone CLI version of the product-image backfill. Self-contained
// (doesn't import src/lib/productImageBackfill.ts — ts-node --skip-project
// reparses this as ESM and chokes on that cross-directory relative import)
// so it stays reliably runnable if shell access is ever available (e.g. a
// future VPS). The actual logic matches src/lib/productImageBackfill.ts
// exactly — that's the path actually used in production today, triggered
// from the admin UI, since this hosting platform has no shell/terminal.
//
// Usage:
//   DRY_RUN=true npm run backfill:product-images   (preview only, no writes)
//   npm run backfill:product-images                (applies the changes)
//
// Plain PrismaClient (no Neon adapter) and no dotenv import, matching
// prisma/seed.ts — the server environment already supplies DATABASE_URL /
// IMGBB_API_KEY the same way it does for `npm run seed`.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IMGBB_KEY = process.env.IMGBB_API_KEY || "625d1f7f5185e487acc6d4355842d2de";
const DELAY_MS = 300;
const MAX_ATTEMPTS = 3;
const CONSECUTIVE_FAILURE_LIMIT = 5;
const DRY_RUN = process.env.DRY_RUN === "true";

class AbortedError extends Error {}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function uploadBase64ToImgBB(dataUri: string): Promise<string> {
  const base64 = dataUri.includes(",") ? dataUri.split(",")[1] : dataUri;
  const form = new URLSearchParams();
  form.append("key", IMGBB_KEY);
  form.append("image", base64);

  const res = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body: form });
  const data: any = await res.json();
  if (!data?.success || !data?.data?.display_url) {
    throw new Error(`ImgBB did not return a usable URL: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return data.data.display_url as string;
}

async function uploadWithRetry(dataUri: string): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await uploadBase64ToImgBB(dataUri);
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_ATTEMPTS) {
        const backoff = 1000 * 2 ** attempt;
        console.warn(`    retry ${attempt}/${MAX_ATTEMPTS - 1} in ${backoff}ms: ${(err as Error).message}`);
        await sleep(backoff);
      }
    }
  }
  throw lastErr;
}

async function main() {
  console.log(DRY_RUN ? "=== DRY RUN - no changes will be written ===\n" : "=== LIVE RUN - this will update the database ===\n");

  const products = await prisma.product.findMany({ select: { id: true, images: true } });
  const toFix = products.filter((p) => p.images.some((img) => img.startsWith("data:")));
  console.log(`${products.length} products total, ${toFix.length} with at least one base64 image.\n`);

  let productsFixed = 0;
  let imagesFixed = 0;
  let imagesFailed = 0;
  let consecutiveFailures = 0;

  for (const product of toFix) {
    const newImages: string[] = [];
    let changed = false;

    for (const img of product.images) {
      if (!img.startsWith("data:")) {
        newImages.push(img);
        continue;
      }

      try {
        const url = await uploadWithRetry(img);
        newImages.push(url);
        imagesFixed++;
        changed = true;
        consecutiveFailures = 0;
      } catch (err) {
        console.error(`  [${product.id}] image upload failed after retries, keeping base64: ${(err as Error).message}`);
        newImages.push(img);
        imagesFailed++;
        consecutiveFailures++;
        if (consecutiveFailures >= CONSECUTIVE_FAILURE_LIMIT) {
          throw new AbortedError(
            `${CONSECUTIVE_FAILURE_LIMIT} consecutive image uploads failed — stopping instead of silently ` +
            `limping through the rest (likely an API key, quota, or network problem; check before re-running).`
          );
        }
      }

      await sleep(DELAY_MS);
    }

    if (changed) {
      console.log(`Product ${product.id}: ${newImages.length} image(s) processed.`);
      if (!DRY_RUN) {
        try {
          await prisma.product.update({ where: { id: product.id }, data: { images: newImages } });
        } catch (err) {
          console.error(`  [${product.id}] failed to save to database: ${(err as Error).message}`);
          continue;
        }
      }
      productsFixed++;
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Products already clean: ${products.length - toFix.length}`);
  console.log(`Products fixed: ${productsFixed}`);
  console.log(`Images uploaded successfully: ${imagesFixed}`);
  console.log(`Images that failed (kept as base64): ${imagesFailed}`);
  if (DRY_RUN) console.log("\nDry run only — nothing was written. Re-run without DRY_RUN=true to apply.");
}

main()
  .catch((err) => {
    if (err instanceof AbortedError) console.error(`\nABORTED: ${err.message}`);
    else console.error("Fatal error:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
