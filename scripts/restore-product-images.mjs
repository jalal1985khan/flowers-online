/**
 * Fetches product images from a WooCommerce Store API (env only),
 * uploads to ImageKit + Cloudinary, updates the database.
 *
 * Requires: CATALOG_WOO_STORE_API, IMAGEKIT_*, CLOUDINARY_*
 *
 * npm run db:restore-images
 * npm run db:restore-images -- --limit=10
 */

import { PrismaClient } from "@prisma/client";
import {
  mediaStorageConfigured,
  rehostProductImages,
  FALLBACK_IMAGE,
} from "./lib/media-upload.mjs";

const prisma = new PrismaClient();

function parseArgs() {
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  return {
    limit: limitArg ? Number(limitArg.split("=")[1]) : undefined,
    force: process.argv.includes("--force"),
  };
}

function isAlreadyOnCdn(product) {
  return product.images.some(
    (u) => u.includes("ik.imagekit.io") || u.includes("res.cloudinary.com")
  );
}

const PRODUCT_TIMEOUT_MS = 120_000;

async function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timed out after ${ms}ms (${label})`)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

async function fetchCatalogImageMap(baseUrl) {
  const map = new Map();
  let page = 1;
  let totalPages = 1;
  const base = baseUrl.replace(/\/$/, "");

  while (page <= totalPages) {
    const res = await fetch(`${base}?per_page=100&page=${page}`, {
      headers: { "User-Agent": "BloomBakesCatalogSync/1.0" },
    });
    if (!res.ok) throw new Error(`Catalog API HTTP ${res.status}`);
    totalPages = Number(res.headers.get("x-wp-totalpages") || 1);
    const batch = await res.json();
    for (const p of batch) {
      if (p.slug && p.images?.length) {
        map.set(p.slug, p.images.map((i) => i.src).filter(Boolean));
      }
    }
    console.log(`  catalog page ${page}/${totalPages}`);
    page += 1;
  }
  return map;
}

async function main() {
  const { limit, force } = parseArgs();
  const catalogApi = process.env.CATALOG_WOO_STORE_API?.trim();

  if (!catalogApi) {
    console.error("Set CATALOG_WOO_STORE_API in .env (WooCommerce Store API products endpoint).");
    process.exit(1);
  }

  if (!mediaStorageConfigured().ready) {
    console.error("Configure IMAGEKIT_* and CLOUDINARY_* in .env first.");
    process.exit(1);
  }

  console.log("📡 Loading catalog image index …");
  const imageBySlug = await fetchCatalogImageMap(catalogApi);
  console.log(`   ${imageBySlug.size} slugs with images\n`);

  let products = await prisma.product.findMany({
    select: { id: true, slug: true, title: true, images: true },
    orderBy: { slug: "asc" },
  });

  if (!force) {
    const before = products.length;
    products = products.filter((p) => !isAlreadyOnCdn(p));
    console.log(`   Skipping ${before - products.length} already on CDN (use --force to redo)\n`);
  }

  const queue = typeof limit === "number" ? products.slice(0, limit) : products;
  console.log(`🖼  Restoring images for ${queue.length} product(s)…\n`);

  let updated = 0;
  let missing = 0;
  let skipped = 0;

  for (const product of queue) {
    const sources = imageBySlug.get(product.slug);
    if (!sources?.length) {
      missing += 1;
      console.warn(`   skip (no catalog images): ${product.slug}`);
      continue;
    }

    try {
      process.stdout.write(`   ${product.slug} … `);
      const { imagekitUrls, cloudinaryUrls } = await withTimeout(
        rehostProductImages(sources, product.slug, {
          allowBlockedSources: true,
        }),
        PRODUCT_TIMEOUT_MS,
        product.slug
      );
      await prisma.product.update({
        where: { id: product.id },
        data: {
          images: imagekitUrls.length ? imagekitUrls : [FALLBACK_IMAGE],
          cloudinaryImages: cloudinaryUrls,
        },
      });
      updated += 1;
      console.log("ok");
      if (updated % 10 === 0) console.log(`   — ${updated} restored this run`);
    } catch (err) {
      console.log("fail");
      console.warn(`   failed ${product.slug}: ${err.message}`);
    }
  }

  console.log(
    `\n✅ Updated ${updated} product(s). No catalog match: ${missing}. Skipped (CDN): ${skipped}.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
