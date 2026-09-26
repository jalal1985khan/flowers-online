import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await getSession();

  if (
    !session ||
    (session.role !== "VENDOR_OWNER" &&
      session.role !== "VENDOR_STAFF" &&
      session.role !== "SUPER_ADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    let targetVendorId = session.vendorId;
    if (!targetVendorId) {
      const first = await prisma.vendor.findFirst();
      targetVendorId = first?.id;
    }

    if (!targetVendorId) {
      return NextResponse.json({ error: "No vendor profile linked" }, { status: 404 });
    }

    // Check existing addon and verify vendor isolation
    const existing = await prisma.addon.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Addon not found" }, { status: 404 });
    }

    // STRICT ISOLATION: A vendor can only update their own items
    if (existing.vendorId !== targetVendorId && session.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Access denied. You can only manage items belonging to your store." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (body.title !== undefined) {
      const cleanTitle = String(body.title).trim();
      if (!cleanTitle) {
        return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
      }
      data.title = cleanTitle;
    }

    if (body.category !== undefined) {
      const cleanCategory = String(body.category).trim();
      if (!cleanCategory) {
        return NextResponse.json({ error: "Category cannot be empty" }, { status: 400 });
      }
      data.category = cleanCategory;
    }

    if (body.price !== undefined) {
      const numPrice = Number(body.price);
      if (isNaN(numPrice) || numPrice < 0) {
        return NextResponse.json({ error: "Price must be a valid positive number" }, { status: 400 });
      }
      data.price = numPrice;
    }

    if (body.image !== undefined) {
      const cleanImage = String(body.image).trim();
      if (!cleanImage) {
        return NextResponse.json({ error: "Image path or URL cannot be empty" }, { status: 400 });
      }
      data.image = cleanImage;
    }

    // When vendor updates details/price, require admin approval before reflecting on website
    data.isApproved = false;

    const updated = await prisma.addon.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      addon: updated,
      success: true,
      message: "Addon updated. Awaiting admin review for the updated price and details.",
    });
  } catch (err: unknown) {
    console.error("Failed to update vendor addon:", err);
    return NextResponse.json({ error: "Failed to update addon" }, { status: 500 });
  }
}

// Vendor delete is strictly disabled per requirements:
// "update no delete option for vendor admin can only delete and make inactive feature for admin"
export async function DELETE() {
  return NextResponse.json(
    {
      error: "Vendors cannot delete add-on items. Please contact marketplace administrator to remove an item.",
    },
    { status: 403 }
  );
}
