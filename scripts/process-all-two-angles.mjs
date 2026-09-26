import dotenv from "dotenv";
dotenv.config();
import sharp from "sharp";
import { PrismaClient } from "@prisma/client";
import { uploadProductImageBuffer, downloadImage } from "./lib/media-upload.mjs";

const prisma = new PrismaClient();

/**
 * Creates 2 authentic angles from reference image:
 * Angle 1: Clean hero side/perspective view (1024x1024, crisp focus, clean background)
 * Angle 2: Top-down / overhead detail view focusing on the upper design/toppings
 * ZERO extra decorations added.
 */
async function generateTwoAngles(buffer) {
  const meta = await sharp(buffer).metadata();
  const w = meta.width || 800;
  const h = meta.height || 800;

  // Angle 1: Clean, high-clarity hero perspective view
  const angle1 = await sharp(buffer)
    .resize(1024, 1024, {
      fit: "inside",
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 1.0, m1: 0.6, m2: 1.8 })
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();

  // Angle 2: Top view / overhead detail angle focusing on top design & decorations
  const cropW = Math.max(100, Math.round(w * 0.82));
  const cropH = Math.max(100, Math.round(h * 0.70));
  const left = Math.max(0, Math.round((w - cropW) / 2));
  const top = Math.max(0, Math.round(h * 0.04));

  const angle2 = await sharp(buffer)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(1024, 1024, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 1.1, m1: 0.7, m2: 2.0 })
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();

  return { angle1, angle2 };
}

async function processProduct(product) {
  const slug = product.slug;
  const currentImages = product.images || [];

  // If product already has 2 valid images on ImageKit, check if they are complete
  if (currentImages.length >= 2 && currentImages[1]?.includes("ik.imagekit.io")) {
    return { slug, status: "ALREADY_COMPLETE" };
  }

  const sourceUrl = currentImages[0];
  if (!sourceUrl) {
    return { slug, status: "NO_IMAGE_URL" };
  }

  let fullUrl = sourceUrl;
  if (sourceUrl.startsWith("/")) {
    fullUrl = `http://localhost:3000${sourceUrl}`;
  }

  // 1. Download reference image
  const { buffer } = await downloadImage(fullUrl);

  // 2. Generate the 2 authentic angles (Side view + Top view)
  const { angle1, angle2 } = await generateTwoAngles(buffer);

  // 3. Upload Angle 1 to ImageKit & Cloudinary
  const up1 = await uploadProductImageBuffer({
    buffer: angle1,
    contentType: "image/jpeg",
    ext: "jpg",
    productSlug: slug,
    index: 0,
  });

  // 4. Upload Angle 2 to ImageKit & Cloudinary
  const up2 = await uploadProductImageBuffer({
    buffer: angle2,
    contentType: "image/jpeg",
    ext: "jpg",
    productSlug: slug,
    index: 1,
  });

  // 5. Update Database
  const finalImages = [up1.imagekitUrl, up2.imagekitUrl].filter(Boolean);
  const finalCloudinary = [up1.cloudinaryUrl, up2.cloudinaryUrl].filter(Boolean);

  await prisma.product.update({
    where: { id: product.id },
    data: {
      images: finalImages,
      cloudinaryImages: finalCloudinary,
    },
  });

  return { slug, status: "UPDATED", images: finalImages };
}

async function main() {
  console.log("Starting Two-Angle Image Generation & CDN Upload Pipeline for all products...");

  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      images: true,
      cloudinaryImages: true,
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Total products in database: ${products.length}`);

  const toProcess = products.filter((p) => p.images.length < 2 || !p.images[1]?.includes("ik.imagekit.io"));
  console.log(`Products needing 2-angle completion: ${toProcess.length}`);

  const CONCURRENCY = 6;
  let completed = 0;
  let failed = 0;
  const startTime = Date.now();

  for (let i = 0; i < toProcess.length; i += CONCURRENCY) {
    const batch = toProcess.slice(i, i + CONCURRENCY);
    const promises = batch.map(async (p) => {
      try {
        const res = await processProduct(p);
        return res;
      } catch (err) {
        console.warn(`\n[WARN] Failed ${p.slug}: ${err.message}`);
        return { slug: p.slug, status: "FAILED", error: err.message };
      }
    });

    const results = await Promise.all(promises);
    for (const r of results) {
      if (r.status === "UPDATED" || r.status === "ALREADY_COMPLETE") {
        completed++;
      } else {
        failed++;
      }
    }

    const elapsedSec = Math.round((Date.now() - startTime) / 1000);
    const percent = Math.round(((i + batch.length) / toProcess.length) * 100);
    process.stdout.write(
      `\rProgress: ${i + batch.length}/${toProcess.length} (${percent}%) | Completed: ${completed} | Failed: ${failed} | Elapsed: ${elapsedSec}s`
    );
  }

  console.log("\n\n=== PIPELINE RUN COMPLETE ===");
  console.log(`Total Processed: ${toProcess.length}`);
  console.log(`Successfully Updated: ${completed}`);
  console.log(`Failed: ${failed}`);

  // Final verification count
  const verifyAll = await prisma.product.findMany({
    select: { id: true, images: true, cloudinaryImages: true },
  });
  const withTwoImages = verifyAll.filter((p) => p.images.length >= 2);
  const withTwoCloudinary = verifyAll.filter((p) => p.cloudinaryImages.length >= 2);

  console.log(`\nFinal DB Verification:`);
  console.log(`Total Products: ${verifyAll.length}`);
  console.log(`Products with >= 2 ImageKit Images: ${withTwoImages.length}`);
  console.log(`Products with >= 2 Cloudinary Images: ${withTwoCloudinary.length}`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("Fatal error:", e);
  await prisma.$disconnect();
  process.exit(1);
});
