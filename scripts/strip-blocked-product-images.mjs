/**
 * Removes blocked legacy CDN URLs from product.images (DB cleanup).
 * Does not upload to CDN — use db:migrate-images for that.
 */

import { PrismaClient } from "@prisma/client";
import { FALLBACK_IMAGE, isBlockedImageHost, isManagedCdnUrl } from "./lib/media-upload.mjs";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, images: true, cloudinaryImages: true },
  });

  let updated = 0;
  for (const p of products) {
    const cleanIk = p.images.filter((u) => !isBlockedImageHost(u));
    const cleanCl = (p.cloudinaryImages || []).filter((u) => !isBlockedImageHost(u));

    const nextImages =
      cleanIk.length > 0
        ? cleanIk
        : cleanCl.length > 0
          ? cleanCl
          : p.images.some(isBlockedImageHost)
            ? [FALLBACK_IMAGE]
            : p.images;

    const changed =
      nextImages.join("|") !== p.images.join("|") ||
      cleanCl.join("|") !== (p.cloudinaryImages || []).join("|");

    if (changed) {
      await prisma.product.update({
        where: { id: p.id },
        data: {
          images: nextImages.every(isManagedCdnUrl) ? nextImages : nextImages,
          cloudinaryImages: cleanCl,
        },
      });
      updated += 1;
    }
  }

  console.log(`Stripped blocked URLs from ${updated} product(s).`);
}

main()
  .finally(() => prisma.$disconnect());
