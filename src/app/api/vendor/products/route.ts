import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      vendorId,
      title,
      description,
      productType,
      categoryId,
      basePrice,
      compareAtPrice,
      images,
      isEgglessAvailable,
      isCustomMessageSupported,
      prepTimeMinutes,
      tags,
      variants,
      occasionIds,
    } = body;

    if (!title || !basePrice) {
      return NextResponse.json(
        { error: "Title and base price are required" },
        { status: 400 }
      );
    }

    // Default vendor if none provided
    const targetVendor = vendorId
      ? await prisma.vendor.findUnique({ where: { id: vendorId } })
      : await prisma.vendor.findFirst();

    if (!targetVendor) {
      return NextResponse.json({ error: "No valid vendor found" }, { status: 400 });
    }

    // Verify category exists, or fallback
    let targetCategory = null;
    if (categoryId) {
      targetCategory = await prisma.category.findUnique({
        where: { id: categoryId },
      });
    }

    if (!targetCategory) {
      targetCategory = await prisma.category.findFirst();
    }

    if (!targetCategory) {
      return NextResponse.json({ error: "No valid category found" }, { status: 400 });
    }

    // Slug generation
    const slugBase = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${slugBase}-${randomSuffix}`;

    const product = await prisma.product.create({
      data: {
        vendorId: targetVendor.id,
        title,
        slug,
        description: description || `Freshly crafted artisan ${title}`,
        productType: (productType as ProductType) || ProductType.CAKES,
        categoryId: targetCategory.id,
        basePrice: Number(basePrice),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        images: images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"],
        isAvailable: true,
        isApproved: true, // Auto-approved for verified vendors in MVP
        isEgglessAvailable: Boolean(isEgglessAvailable),
        isCustomMessageSupported: Boolean(isCustomMessageSupported),
        prepTimeMinutes: Number(prepTimeMinutes) || 60,
        tags: tags || ["Artisan", "Handcrafted"],
        metaTitle: `${title} Delivery | Bloom & Bakes`,
        metaDescription: `Order fresh ${title} with guaranteed same-day and midnight delivery.`,
        variants: {
          create:
            variants && variants.length > 0
              ? variants.map((v: any, idx: number) => ({
                  name: v.name,
                  price: Number(v.price),
                  compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
                  isDefault: idx === 0,
                  stock: Number(v.stock) || 50,
                }))
              : [
                  {
                    name: "Standard",
                    price: Number(basePrice),
                    isDefault: true,
                    stock: 50,
                  },
                ],
        },
        occasions:
          occasionIds && occasionIds.length > 0
            ? {
                create: occasionIds.map((occId: string) => ({
                  occasionId: occId,
                })),
              }
            : undefined,
      },
      include: {
        variants: true,
        category: true,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorEmail: targetVendor.email,
        actorRole: "VENDOR_OWNER",
        action: "PRODUCT_CREATED",
        entityType: "PRODUCT",
        entityId: product.id,
        diff: JSON.stringify({ title: product.title, price: product.basePrice, slug: product.slug }),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Vendor product creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
