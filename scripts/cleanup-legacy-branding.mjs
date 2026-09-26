/**
 * One-time DB cleanup: rename legacy import vendor slug and strip unwanted tags.
 * Set LEGACY_VENDOR_SLUG and LEGACY_TAG_PATTERN in env when running.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const legacySlug = process.env.LEGACY_VENDOR_SLUG?.trim();
  if (legacySlug) {
    const legacy = await prisma.vendor.findFirst({ where: { slug: legacySlug } });
    if (legacy) {
      await prisma.vendor.update({
        where: { id: legacy.id },
        data: {
          name: "Bloom & Bakes Guwahati",
          slug: "bloom-bakes-guwahati",
          email: "catalog@bloomandbakes.local",
        },
      });
      console.log("Renamed legacy vendor → bloom-bakes-guwahati");
    }
  }

  const tagPattern = process.env.LEGACY_TAG_PATTERN
    ? new RegExp(process.env.LEGACY_TAG_PATTERN, "i")
    : null;

  if (tagPattern) {
    const products = await prisma.product.findMany({ select: { id: true, tags: true } });
    let tagUpdates = 0;
    for (const p of products) {
      const filtered = p.tags.filter((t) => !tagPattern.test(t));
      if (filtered.length !== p.tags.length) {
        await prisma.product.update({ where: { id: p.id }, data: { tags: filtered } });
        tagUpdates += 1;
      }
    }
    console.log(`Cleaned tags on ${tagUpdates} product(s).`);
  }
}

main()
  .finally(() => prisma.$disconnect());
