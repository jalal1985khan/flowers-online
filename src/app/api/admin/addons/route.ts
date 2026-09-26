import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET(req: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const approval = searchParams.get("approval");
    const origin = searchParams.get("origin");
    const vendorId = searchParams.get("vendorId");

    const where: any = {};
    if (category && category !== "ALL") {
      where.category = category;
    }
    if (search && search.trim()) {
      where.title = { contains: search.trim() };
    }
    if (approval === "PENDING") {
      where.isApproved = false;
    } else if (approval === "APPROVED") {
      where.isApproved = true;
    }
    if (origin === "VENDOR") {
      where.vendorId = { not: null };
    } else if (origin === "GLOBAL") {
      where.vendorId = null;
    } else if (vendorId && vendorId !== "ALL") {
      where.vendorId = vendorId;
    }

    const addons = await prisma.addon.findMany({
      where,
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: [
        { isApproved: "asc" }, // Show unapproved items first for admin attention
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ addons });
  } catch (err: unknown) {
    console.error("Failed to fetch admin addons:", err);
    return NextResponse.json({ error: "Failed to fetch addons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await req.json();
    const { title, category, price, image, isAvailable } = body;

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

    const addon = await prisma.addon.create({
      data: {
        title: title.trim(),
        category: category.trim(),
        price: numPrice,
        image: image.trim(),
        isAvailable: isAvailable !== false,
      },
    });

    return NextResponse.json({ addon, success: true }, { status: 201 });
  } catch (err: unknown) {
    console.error("Failed to create addon:", err);
    return NextResponse.json({ error: "Failed to create addon" }, { status: 500 });
  }
}
