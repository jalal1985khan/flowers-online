import dotenv from "dotenv";
dotenv.config();
import sharp from "sharp";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LAPLACIAN_KERNEL = {
  width: 3,
  height: 3,
  kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0],
};

async function auditSingleImage(url) {
  if (!url) return { ok: false, reason: "EMPTY_URL" };
  try {
    let fullUrl = url;
    if (url.startsWith("/")) {
      fullUrl = `http://localhost:3000${url}`;
    }
    const res = await fetch(fullUrl, {
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "ProductImageAuditor/1.0" },
    });
    if (!res.ok) {
      return { ok: false, reason: `HTTP_${res.status}`, status: res.status };
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const bytes = buffer.length;

    const meta = await sharp(buffer).metadata();
    const width = meta.width || 0;
    const height = meta.height || 0;

    // Laplacian edge variance for blur detection
    const laplacian = await sharp(buffer)
      .greyscale()
      .resize(500, 500, { fit: "inside" })
      .convolve(LAPLACIAN_KERNEL)
      .stats();

    const variance = Math.pow(laplacian.channels[0].stdev, 2);

    const isLowRes = width < 500 || height < 500;
    const isTinyFile = bytes < 12000; // < 12KB
    const isBlurry = variance < 500; // very low edge contrast

    const isProblematic = isLowRes || isTinyFile || isBlurry;

    return {
      ok: !isProblematic,
      width,
      height,
      bytes,
      variance,
      format: meta.format,
      isLowRes,
      isTinyFile,
      isBlurry,
      reason: isProblematic
        ? [
            isLowRes ? `LOW_RES(${width}x${height})` : null,
            isTinyFile ? `TINY_FILE(${Math.round(bytes / 1024)}KB)` : null,
            isBlurry ? `BLURRY(var=${Math.round(variance)})` : null,
          ]
            .filter(Boolean)
            .join("+")
        : "OK",
    };
  } catch (err) {
    return { ok: false, reason: `ERROR: ${err.message}` };
  }
}

async function main() {
  console.log("Starting audit of all products in database...");
  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      images: true,
      cloudinaryImages: true,
      productType: true,
      category: { select: { slug: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${products.length} products to audit.`);

  const results = [];
  const problematic = [];
  const broken = [];
  const healthy = [];

  const BATCH_SIZE = 15;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map(async (p) => {
      const primaryImage = p.images?.[0];
      const audit = await auditSingleImage(primaryImage);
      return {
        product: p,
        primaryImage,
        audit,
      };
    });

    const batchResults = await Promise.all(batchPromises);
    for (const res of batchResults) {
      results.push(res);
      if (!res.audit.ok) {
        if (res.audit.reason.startsWith("HTTP") || res.audit.reason.startsWith("ERROR")) {
          broken.push(res);
        } else {
          problematic.push(res);
        }
      } else {
        healthy.push(res);
      }
    }

    process.stdout.write(
      `\rAudited ${results.length}/${products.length} products (Healthy: ${healthy.length}, LowRes/Blur: ${problematic.length}, Broken: ${broken.length})`
    );
  }

  console.log("\n\n=== AUDIT SUMMARY ===");
  console.log(`Total Products: ${products.length}`);
  console.log(`Healthy / High-Res / Sharp: ${healthy.length}`);
  console.log(`Problematic / Low-Res / Blurry: ${problematic.length}`);
  console.log(`Broken / Error / 404: ${broken.length}`);

  if (broken.length > 0) {
    console.log("\n--- BROKEN / ERROR PRODUCTS ---");
    broken.forEach((b) => {
      console.log(`- [${b.product.slug}] ${b.product.title}: ${b.audit.reason} (url: ${b.primaryImage})`);
    });
  }

  if (problematic.length > 0) {
    console.log("\n--- PROBLEMATIC / LOW-RES / BLURRY PRODUCTS ---");
    problematic.forEach((p) => {
      console.log(
        `- [${p.product.slug}] "${p.product.title}" [${p.product.category?.name || "No Cat"}]: ${p.audit.reason} (${p.audit.width}x${p.audit.height}, ${Math.round((p.audit.bytes || 0) / 1024)}KB, var=${Math.round(p.audit.variance || 0)})`
      );
    });
  }

  // Save report to JSON file
  const report = {
    total: products.length,
    healthyCount: healthy.length,
    problematicCount: problematic.length,
    brokenCount: broken.length,
    problematic: problematic.map((p) => ({
      id: p.product.id,
      slug: p.product.slug,
      title: p.product.title,
      description: p.product.description,
      category: p.product.category?.name,
      productType: p.product.productType,
      currentImage: p.primaryImage,
      reason: p.audit.reason,
      width: p.audit.width,
      height: p.audit.height,
      bytes: p.audit.bytes,
      variance: p.audit.variance,
    })),
    broken: broken.map((b) => ({
      id: b.product.id,
      slug: b.product.slug,
      title: b.product.title,
      currentImage: b.primaryImage,
      reason: b.audit.reason,
    })),
  };

  import("fs").then((fs) => {
    fs.writeFileSync("./scripts/audit-report.json", JSON.stringify(report, null, 2));
    console.log("\nDetailed report saved to ./scripts/audit-report.json");
  });

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
