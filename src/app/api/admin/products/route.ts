import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { ProductType, Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category") || "";
    const vendor = searchParams.get("vendor") || "";
    const productType = searchParams.get("productType") || "";
    const status = searchParams.get("status") || "all";
    const eggless = searchParams.get("eggless") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    // Build Prisma filter
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search] } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (vendor) {
      where.vendorId = vendor;
    }

    if (productType && Object.values(ProductType).includes(productType as ProductType)) {
      where.productType = productType as ProductType;
    }

    if (status === "available") {
      where.isAvailable = true;
    } else if (status === "unavailable") {
      where.isAvailable = false;
    } else if (status === "pending") {
      where.isApproved = false;
    }

    if (eggless === "true") {
      where.isEgglessAvailable = true;
    } else if (eggless === "false") {
      where.isEgglessAvailable = false;
    }

    // Dynamic sorting
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy === "basePrice") {
      orderBy.basePrice = sortOrder;
    } else if (sortBy === "title") {
      orderBy.title = sortOrder;
    } else if (sortBy === "updatedAt") {
      orderBy.updatedAt = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const skip = (page - 1) * limit;

    const [products, total, totalAvailable, totalEggless, categories, vendors, occasions] =
      await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: { select: { id: true, name: true, slug: true } },
            vendor: { select: { id: true, name: true, city: true } },
            occasions: {
              include: {
                occasion: { select: { id: true, name: true, slug: true } },
              },
            },
            variants: {
              select: {
                id: true,
                name: true,
                price: true,
                compareAtPrice: true,
                stock: true,
                isDefault: true,
              },
            },
            _count: {
              select: { orderItems: true },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.product.count({ where }),
        prisma.product.count({ where: { isAvailable: true } }),
        prisma.product.count({ where: { isEgglessAvailable: true } }),
        prisma.category.findMany({
          select: { id: true, name: true, slug: true },
          orderBy: { name: "asc" },
        }),
        prisma.vendor.findMany({
          select: { id: true, name: true, city: true },
          orderBy: { name: "asc" },
        }),
        prisma.occasion.findMany({
          select: { id: true, name: true, slug: true },
          orderBy: { name: "asc" },
        }),
      ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      stats: {
        total,
        totalAvailable,
        totalUnavailable: total - totalAvailable,
        totalEggless,
      },
      categories,
      vendors,
      occasions,
    });
  } catch (err: unknown) {
    console.error("Failed to fetch admin products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await req.json();
    const {
      title,
      slug: customSlug,
      description,
      productType,
      categoryId,
      vendorId,
      basePrice,
      compareAtPrice,
      images,
      isAvailable,
      isApproved,
      isEgglessAvailable,
      isCustomMessageSupported,
      isPhotoCake,
      prepTimeMinutes,
      tags,
      metaTitle,
      metaDescription,
      occasionIds,
      variants,
    } = body;

    if (!title || !basePrice || !categoryId) {
      return NextResponse.json(
        { error: "Title, Category, and Base Price are required" },
        { status: 400 }
      );
    }

    // Default vendor if none provided
    const targetVendor = vendorId
      ? await prisma.vendor.findUnique({ where: { id: vendorId } })
      : await prisma.vendor.findFirst();

    if (!targetVendor) {
      return NextResponse.json(
        { error: "A valid vendor must exist before creating products" },
        { status: 400 }
      );
    }

    // Generate or clean slug
    let slug = customSlug
      ? customSlug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-")
      : title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    // Check slug collision
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const parsedImages = Array.isArray(images) && images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"];

    const cleanTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];

    const product = await prisma.product.create({
      data: {
        vendorId: targetVendor.id,
        categoryId,
        title,
        slug,
        description: description || `Freshly crafted artisan ${title}`,
        productType: (productType as ProductType) || ProductType.CAKES,
        basePrice: Number(basePrice),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        images: parsedImages,
        isAvailable: isAvailable !== false,
        isApproved: isApproved !== false,
        isEgglessAvailable: Boolean(isEgglessAvailable),
        isCustomMessageSupported: Boolean(isCustomMessageSupported),
        isPhotoCake: Boolean(isPhotoCake),
        prepTimeMinutes: Number(prepTimeMinutes) || 60,
        tags: cleanTags,
        metaTitle: metaTitle || `${title} Delivery | MyPetalsCart`,
        metaDescription: metaDescription || `Order fresh ${title} with guaranteed same-day and midnight delivery.`,
        occasions: Array.isArray(occasionIds) && occasionIds.length > 0
          ? {
            create: occasionIds.map((occId: string) => ({
              occasionId: occId,
            })),
          }
          : undefined,
        variants: Array.isArray(variants) && variants.length > 0
          ? {
            create: variants.map((v: any, idx: number) => ({
              name: v.name || "Standard",
              price: Number(v.price) || Number(basePrice),
              compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
              stock: Number(v.stock) || 50,
              isDefault: idx === 0,
            })),
          }
          : {
            create: [
              {
                name: "Standard",
                price: Number(basePrice),
                isDefault: true,
                stock: 50,
              },
            ],
          },
      },
      include: {
        category: true,
        vendor: true,
        occasions: { include: { occasion: true } },
        variants: true,
      },
    });

    return NextResponse.json({ product, success: true }, { status: 201 });
  } catch (err: unknown) {
    console.error("Failed to create admin product:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
