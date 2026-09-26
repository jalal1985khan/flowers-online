import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import sharp from "sharp";
import { PrismaClient } from "@prisma/client";
import { uploadProductImageBuffer, downloadImage } from "./lib/media-upload.mjs";

const prisma = new PrismaClient();

/**
 * Natural high-fidelity enhancement:
 * - Upscales cleanly with Lanczos3 to 1024px on long edge
 * - Gentle deblurring to remove JPEG compression softness
 * - ZERO extra decoration, ZERO color distortion, preserving authentic reference look
 */
async function naturalEnhance(buffer) {
  const meta = await sharp(buffer).metadata();
  const width = meta.width || 0;
  const height = meta.height || 0;

  // Calculate target dimensions keeping exact aspect ratio up to 1024px
  const maxDim = Math.max(width, height);
  const targetScale = maxDim < 1024 ? 1024 / maxDim : 1;
  const targetW = Math.round(width * targetScale);
  const targetH = Math.round(height * targetScale);

  return await sharp(buffer)
    .resize(targetW, targetH, {
      kernel: sharp.kernel.lanczos3,
      fit: "inside",
      withoutEnlargement: false,
    })
    .sharpen({
      sigma: 1.0,
      m1: 0.6,
      m2: 1.8,
    })
    .jpeg({
      quality: 92,
      mozjpeg: true,
    })
    .toBuffer();
}

async function main() {
  console.log("Loading audit report to find products needing resolution enhancement...");
  let report;
  try {
    report = JSON.parse(fs.readFileSync("./scripts/audit-report.json", "utf-8"));
  } catch (err) {
    console.error("Could not read ./scripts/audit-report.json:", err.message);
    process.exit(1);
  }

  // Filter only items that need enhancement
  const itemsToProcess = report.problematic.filter((item) => {
    // Skip if already processed or high-res
    if (item.width >= 800 && item.height >= 800 && item.variance >= 500) {
      return false;
    }
    return true;
  });

  console.log(`Found ${itemsToProcess.length} products to enhance faithfully.`);

  const BATCH_SIZE = 8;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < itemsToProcess.length; i += BATCH_SIZE) {
    const batch = itemsToProcess.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (item) => {
      try {
        const product = await prisma.product.findUnique({
          where: { slug: item.slug },
          select: { id: true, slug: true, images: true, cloudinaryImages: true },
        });

        if (!product || !product.images?.[0]) return null;

        // Skip if already updated to an enhanced 1024px version
        const currentUrl = product.images[0];
        const { buffer } = await downloadImage(currentUrl);
        const meta = await sharp(buffer).metadata();

        if (meta.width >= 900 && meta.height >= 900) {
          // Already high-res
          return { slug: item.slug, skipped: true };
        }

        const enhanced = await naturalEnhance(buffer);
        const uploadRes = await uploadProductImageBuffer({
          buffer: enhanced,
          contentType: "image/jpeg",
          ext: "jpg",
          productSlug: item.slug,
          index: 0,
        });

        await prisma.product.update({
          where: { slug: item.slug },
          data: {
            images: [uploadRes.imagekitUrl],
            cloudinaryImages: uploadRes.cloudinaryUrl ? [uploadRes.cloudinaryUrl] : [],
          },
        });

        return { slug: item.slug, success: true };
      } catch (err) {
        return { slug: item.slug, error: err.message };
      }
    });

    const results = await Promise.all(promises);
    for (const r of results) {
      if (!r) continue;
      if (r.success) successCount++;
      else if (r.error) {
        failCount++;
        console.warn(`\n[FAIL] ${r.slug}: ${r.error}`);
      }
    }

    const processed = Math.min(i + BATCH_SIZE, itemsToProcess.length);
    process.stdout.write(
      `\rProgress: ${processed}/${itemsToProcess.length} processed (${successCount} enhanced, ${failCount} failed)`
    );
  }

  console.log("\n\n=== ENHANCEMENT COMPLETE ===");
  console.log(`Successfully enhanced: ${successCount}`);
  console.log(`Failed / Skipped: ${failCount}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
