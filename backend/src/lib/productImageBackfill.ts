// Core logic for migrating product images stored as raw base64 data URIs to
// hosted ImgBB URLs. Shared by the standalone CLI script (prisma/backfillProductImages.ts,
// for anyone who does end up with shell access) and the admin-triggered HTTP
// endpoint (routes/admin.ts) — this platform has no shell/terminal access, so
// the HTTP-triggered path is the one actually usable in production today.
import { prisma } from "./prisma";

const IMGBB_KEY = process.env.IMGBB_API_KEY || "625d1f7f5185e487acc6d4355842d2de";
const DELAY_MS = 300;
const MAX_ATTEMPTS = 3;
const CONSECUTIVE_FAILURE_LIMIT = 5;

export class BackfillAbortedError extends Error {}

export interface BackfillSummary {
  productsTotal: number;
  productsAlreadyClean: number;
  productsFixed: number;
  imagesFixed: number;
  imagesFailed: number;
  dryRun: boolean;
  aborted: boolean;
  abortReason?: string;
}

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
  // The original base64-only bug came from trusting a 200 OK without
  // checking the payload — a bad/missing key can respond without throwing.
  if (!data?.success || !data?.data?.display_url) {
    throw new Error(`ImgBB did not return a usable URL: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return data.data.display_url as string;
}

async function uploadWithRetry(dataUri: string, log: (msg: string) => void): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await uploadBase64ToImgBB(dataUri);
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_ATTEMPTS) {
        const backoff = 1000 * 2 ** attempt; // 2s, 4s
        log(`    retry ${attempt}/${MAX_ATTEMPTS - 1} in ${backoff}ms: ${(err as Error).message}`);
        await sleep(backoff);
      }
    }
  }
  throw lastErr;
}

export async function runProductImageBackfill(
  dryRun: boolean,
  log: (msg: string) => void = () => {}
): Promise<BackfillSummary> {
  log(dryRun ? "=== DRY RUN - no changes will be written ===" : "=== LIVE RUN - this will update the database ===");

  const products = await prisma.product.findMany({ select: { id: true, images: true } });
  const toFix = products.filter((p) => p.images.some((img) => img.startsWith("data:")));
  log(`${products.length} products total, ${toFix.length} with at least one base64 image.`);

  let productsFixed = 0;
  let imagesFixed = 0;
  let imagesFailed = 0;
  let consecutiveFailures = 0;

  try {
    for (const product of toFix) {
      const newImages: string[] = [];
      let changed = false;

      for (const img of product.images) {
        if (!img.startsWith("data:")) {
          newImages.push(img);
          continue;
        }

        try {
          const url = await uploadWithRetry(img, log);
          newImages.push(url);
          imagesFixed++;
          changed = true;
          consecutiveFailures = 0;
        } catch (err) {
          log(`  [${product.id}] image upload failed after retries, keeping base64: ${(err as Error).message}`);
          newImages.push(img); // never drop an image, even on failure
          imagesFailed++;
          consecutiveFailures++;
          if (consecutiveFailures >= CONSECUTIVE_FAILURE_LIMIT) {
            throw new BackfillAbortedError(
              `${CONSECUTIVE_FAILURE_LIMIT} consecutive image uploads failed — stopping instead of silently ` +
              `limping through the rest (likely an API key, quota, or network problem; check before re-running).`
            );
          }
        }

        await sleep(DELAY_MS);
      }

      if (changed) {
        log(`Product ${product.id}: ${newImages.length} image(s) processed.`);
        if (!dryRun) {
          try {
            await prisma.product.update({ where: { id: product.id }, data: { images: newImages } });
          } catch (err) {
            log(`  [${product.id}] failed to save to database: ${(err as Error).message}`);
            continue;
          }
        }
        productsFixed++;
      }
    }
  } catch (err) {
    if (err instanceof BackfillAbortedError) {
      log(`\nABORTED: ${err.message}`);
      return {
        productsTotal: products.length,
        productsAlreadyClean: products.length - toFix.length,
        productsFixed,
        imagesFixed,
        imagesFailed,
        dryRun,
        aborted: true,
        abortReason: err.message,
      };
    }
    throw err;
  }

  log("\n=== Summary ===");
  log(`Products already clean: ${products.length - toFix.length}`);
  log(`Products fixed: ${productsFixed}`);
  log(`Images uploaded successfully: ${imagesFixed}`);
  log(`Images that failed (kept as base64): ${imagesFailed}`);
  if (dryRun) log("\nDry run only — nothing was written.");

  return {
    productsTotal: products.length,
    productsAlreadyClean: products.length - toFix.length,
    productsFixed,
    imagesFixed,
    imagesFailed,
    dryRun,
    aborted: false,
  };
}
