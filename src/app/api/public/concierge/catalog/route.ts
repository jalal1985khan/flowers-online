import { NextResponse } from "next/server";

import { getBaseUrl, getSiteName } from "@/lib/seo-config";
import { getProductImage } from "@/lib/product-images";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * SocialHive Chat Concierge catalog export (v1).
 * Point SocialHive "Catalog Feed URL" here, then POST /api/chat-sites/:id/sync.
 *
 * Optional: set CONCIERGE_CATALOG_SECRET and send Authorization: Bearer <secret>.
 */
export async function GET(request: Request) {
  const secret = process.env.CONCIERGE_CATALOG_SECRET?.trim();
  if (secret) {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    if (token !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const baseUrl = getBaseUrl();

    const [products, categories, occasions] = await Promise.all([
      prisma.product.findMany({
        where: { isAvailable: true, isApproved: true },
        include: { category: true, occasions: { include: { occasion: true } } },
        orderBy: { updatedAt: "desc" },
        take: 2000,
      }),
      prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.occasion.findMany({ where: { isActive: true }, take: 50 }),
    ]);

    const pages = [
      ...categories.map((c) => ({
        id: `cat-${c.slug}`,
        title: c.name,
        content: c.description || `Browse ${c.name} gifts and cakes on ${getSiteName()}.`,
        url: `${baseUrl}/catalog?category=${c.slug}`,
        kind: "category",
      })),
      ...occasions.map((o) => ({
        id: `occ-${o.slug}`,
        title: o.name,
        content: o.description || `Shop ${o.name} gifts.`,
        url: `${baseUrl}/catalog?occasion=${o.slug}`,
        kind: "occasion",
      })),
    ];

    return NextResponse.json({
      version: 1 as const,
      siteName: getSiteName(),
      baseUrl,
      currency: "INR",
      products: products.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description?.slice(0, 2000),
        price: p.basePrice,
        currency: "INR",
        imageUrl: getProductImage(p),
        url: `${baseUrl}/${p.slug}`,
        category: p.category.name,
        tags: [
          ...p.tags,
          p.isEgglessAvailable ? "Eggless" : "Egg",
          p.productType,
          ...p.occasions.map((po) => po.occasion.name),
        ],
        metadata: {
          slug: p.slug,
          vendorId: p.vendorId,
          isEgglessAvailable: p.isEgglessAvailable,
          compareAtPrice: p.compareAtPrice,
        },
      })),
      pages,
    });
  } catch (error) {
    console.error("[concierge/catalog]", error);
    return NextResponse.json({ error: "Failed to build catalog export" }, { status: 500 });
  }
}
