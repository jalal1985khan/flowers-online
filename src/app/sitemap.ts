import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/seo-config";
import { LIVE_DELIVERY_CITY_SLUGS } from "@/lib/market-cities";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const [products, seoPages] = await Promise.all([
    prisma.product.findMany({
      where: { isAvailable: true, isApproved: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.seoLandingPage.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const [categories, occasions] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
    prisma.occasion.findMany({ where: { isActive: true }, select: { slug: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalog`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    // Core commercial category landing pages
    ...categories.map((c) => ({
      url: `${baseUrl}/catalog?category=${c.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
    // Core high-intent occasion landing pages
    ...occasions.map((o) => ({
      url: `${baseUrl}/catalog?occasion=${o.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
    // Only index cities with live, verified delivery operations
    ...LIVE_DELIVERY_CITY_SLUGS.map((city) => ({
      url: `${baseUrl}/city/${city}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const seoLandingRoutes: MetadataRoute.Sitemap = seoPages.map((p) => ({
    url: `${baseUrl}/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...seoLandingRoutes,
    ...productRoutes,
  ];
}
