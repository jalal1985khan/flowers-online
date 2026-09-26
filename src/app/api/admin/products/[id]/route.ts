import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { ProductType, Prisma } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        vendor: true,
        occasions: {
          include: {
            occasion: true,
          },
        },
        variants: {
          orderBy: { price: "asc" },
        },
        _count: {
          select: { orderItems: true, reviews: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (err: unknown) {
    console.error("Failed to fetch product:", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id },
      include: { occasions: true, variants: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const {
      title,
      slug: newSlug,
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

    const updateData: Prisma.ProductUpdateInput = {};

    if (title !== undefined) updateData.title = String(title).trim();

    if (newSlug !== undefined) {
      const cleanSlug = String(newSlug).toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-");
      // Check collision
      if (cleanSlug !== existing.slug) {
        const collision = await prisma.product.findUnique({ where: { slug: cleanSlug } });
        if (collision && collision.id !== id) {
          return NextResponse.json(
            { error: `Slug "${cleanSlug}" is already in use by another product.` },
            { status: 400 }
          );
        }
      }
      updateData.slug = cleanSlug;
    }

    if (description !== undefined) updateData.description = String(description);
    if (productType !== undefined && Object.values(ProductType).includes(productType as ProductType)) {
      updateData.productType = productType as ProductType;
    }
    if (categoryId !== undefined) {
      updateData.category = { connect: { id: categoryId } };
    }
    if (vendorId !== undefined) {
      updateData.vendor = { connect: { id: vendorId } };
    }
    if (basePrice !== undefined) updateData.basePrice = Number(basePrice);
    if (compareAtPrice !== undefined) {
      updateData.compareAtPrice = compareAtPrice === null || compareAtPrice === "" ? null : Number(compareAtPrice);
    }
    if (images !== undefined && Array.isArray(images)) {
      updateData.images = images.filter((img: string) => typeof img === "string" && img.trim().length > 0);
    }
    if (isAvailable !== undefined) updateData.isAvailable = Boolean(isAvailable);
    if (isApproved !== undefined) updateData.isApproved = Boolean(isApproved);
    if (isEgglessAvailable !== undefined) updateData.isEgglessAvailable = Boolean(isEgglessAvailable);
    if (isCustomMessageSupported !== undefined) updateData.isCustomMessageSupported = Boolean(isCustomMessageSupported);
    if (isPhotoCake !== undefined) updateData.isPhotoCake = Boolean(isPhotoCake);
    if (prepTimeMinutes !== undefined) updateData.prepTimeMinutes = Number(prepTimeMinutes);

    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];
    }

    if (metaTitle !== undefined) updateData.metaTitle = metaTitle || null;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription || null;

    // Handle occasion mappings if explicitly passed
    if (Array.isArray(occasionIds)) {
      await prisma.productOccasion.deleteMany({
        where: { productId: id },
      });

      if (occasionIds.length > 0) {
        await prisma.productOccasion.createMany({
          data: occasionIds.map((occId: string) => ({
            productId: id,
            occasionId: occId,
          })),
        });
      }
    }

    // Handle variants update if provided
    if (Array.isArray(variants)) {
      // Re-sync variants
      await prisma.productVariant.deleteMany({
        where: { productId: id },
      });

      if (variants.length > 0) {
        await prisma.productVariant.createMany({
          data: variants.map((v: any, idx: number) => ({
            productId: id,
            name: v.name || "Standard",
            price: Number(v.price) || Number(basePrice ?? existing.basePrice),
            compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
            stock: Number(v.stock) || 50,
            isDefault: v.isDefault !== undefined ? Boolean(v.isDefault) : idx === 0,
          })),
        });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        vendor: true,
        occasions: {
          include: { occasion: true },
        },
        variants: true,
      },
    });

    return NextResponse.json({
      product: updatedProduct,
      success: true,
      message: "Product updated successfully",
    });
  } catch (err: unknown) {
    console.error("Failed to update product:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { _count: { select: { orderItems: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // If product has historical orders, prevent hard deletion to preserve accounting
    if (existing._count.orderItems > 0) {
      await prisma.product.update({
        where: { id },
        data: { isAvailable: false },
      });
      return NextResponse.json({
        success: true,
        message: "Product has associated orders; it has been deactivated and marked unavailable.",
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err: unknown) {
    console.error("Failed to delete product:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
