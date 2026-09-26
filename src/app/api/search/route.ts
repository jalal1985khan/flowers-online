import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProductImage } from "@/lib/product-images";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [], categories: [], occasions: [] });
  }

  try {
    const [products, categories, occasions] = await Promise.all([
      prisma.product.findMany({
        where: {
          isAvailable: true,
          isApproved: true,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { tags: { has: query } },
          ],
        },
        include: {
          category: true,
        },
        take: 6,
      }),
      prisma.category.findMany({
        where: {
          name: { contains: query, mode: "insensitive" },
          isActive: true,
        },
        take: 3,
      }),
      prisma.occasion.findMany({
        where: {
          name: { contains: query, mode: "insensitive" },
          isActive: true,
        },
        take: 3,
      }),
    ]);

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        basePrice: p.basePrice,
        image: getProductImage(p),
        categoryName: p.category.name,
      })),
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })),
      occasions: occasions.map((o) => ({
        id: o.id,
        name: o.name,
        slug: o.slug,
      })),
    });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
