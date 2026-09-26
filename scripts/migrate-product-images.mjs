/**
 * Re-host product images from external URLs to ImageKit + Cloudinary
 * with Bloom-branded file names. Does not call any third-party catalog API.
 *
 * npm run db:migrate-images
 * npm run db:migrate-images -- --limit=20 --dry-run
 */

import { PrismaClient } from "@prisma/client";
import {
  mediaStorageConfigured,
  isBlockedImageHost,
  isManagedCdnUrl,
  rehostProductImages,
} from "./lib/media-upload.mjs";

const prisma = new PrismaClient();

function parseArgs() {
  const dryRun = process.argv.includes("--dry-run");
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;
  return { dryRun, limit };
}

function productNeedsWork(product) {
  const all = [...product.images, ...(product.cloudinaryImages || [])];
  if (all.length === 0) return true;
  return product.images.some((u) => isBlockedImageHost(u) || !isManagedCdnUrl(u));
}

async function main() {
  const { dryRun, limit } = parseArgs();
  const cfg = mediaStorageConfigured();

  if (!cfg.ready && !dryRun) {
    console.error(
      "Configure both ImageKit and Cloudinary in .env before migrating (see .env.example)."
    );
    process.exit(1);
  }

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

  const queue = products.filter(productNeedsWork);
  const toProcess = typeof limit === "number" ? queue.slice(0, limit) : queue;

  console.log(`🖼  Products needing image migration: ${queue.length}`);
  console.log(`   Processing: ${toProcess.length}${dryRun ? " (dry run)" : ""}\n`);

  let updated = 0;

  for (const product of toProcess) {
    const sources = product.images.filter(Boolean);
    console.log(`→ ${product.slug} (${sources.length} images)`);

    if (dryRun) {
      const blocked = sources.filter(isBlockedImageHost);
      const external = sources.filter((u) => !isManagedCdnUrl(u) && !isBlockedImageHost(u));
      console.log(`   would rehost ${blocked.length + external.length} URL(s)`);
      continue;
    }

    const { imagekitUrls, cloudinaryUrls } = await rehostProductImages(sources, product.slug);

    await prisma.product.update({
      where: { id: product.id },
      data: {
        images: imagekitUrls,
        cloudinaryImages: cloudinaryUrls.length ? cloudinaryUrls : product.cloudinaryImages,
      },
    });

    updated += 1;
    if (updated % 10 === 0) {
      console.log(`   … ${updated} products updated`);
    }
  }

  console.log(`\n✅ Done. Updated ${updated} product(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
