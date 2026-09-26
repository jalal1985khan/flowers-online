import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
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
    let targetVendorId = session.vendorId;
    if (!targetVendorId) {
      const first = await prisma.vendor.findFirst();
      targetVendorId = first?.id;
    }

    if (!targetVendorId) {
      return NextResponse.json({ error: "No vendor profile linked" }, { status: 404 });
    }

    // STRICT VENDOR ISOLATION: A vendor can only see their own added items
    const addons = await prisma.addon.findMany({
      where: {
        vendorId: targetVendorId,
      },
      orderBy: [
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ addons, vendorId: targetVendorId });
  } catch (err: unknown) {
    console.error("Failed to fetch vendor addons:", err);
    return NextResponse.json({ error: "Failed to fetch vendor addons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
    let targetVendorId = session.vendorId;
    if (!targetVendorId) {
      const first = await prisma.vendor.findFirst();
      targetVendorId = first?.id;
    }

    if (!targetVendorId) {
      return NextResponse.json({ error: "No vendor profile linked" }, { status: 404 });
    }

    const body = await req.json();
    const { title, category, price, image } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!category || !category.trim()) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json({ error: "Price must be a valid positive number" }, { status: 400 });
    }
    if (!image || !image.trim()) {
      return NextResponse.json({ error: "Image URL or path is required" }, { status: 400 });
    }

    // Create addon tied to this vendor.
    // Notice: isApproved is false by default so admin must review and approve item & price before it reflects on the website.
    const addon = await prisma.addon.create({
      data: {
        vendorId: targetVendorId,
        title: title.trim(),
        category: category.trim(),
        price: numPrice,
        image: image.trim(),
        isApproved: false, // Requires admin approval
        isAvailable: true,  // Ready to be active once approved
      },
    });

    return NextResponse.json({ addon, success: true }, { status: 201 });
  } catch (err: unknown) {
    console.error("Failed to create vendor addon:", err);
    return NextResponse.json({ error: "Failed to create addon" }, { status: 500 });
  }
}
