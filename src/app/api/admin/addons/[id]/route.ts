import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    const addon = await prisma.addon.findUnique({ where: { id } });
    if (!addon) {
      return NextResponse.json({ error: "Addon not found" }, { status: 404 });
    }
    return NextResponse.json({ addon });
  } catch (err: unknown) {
    console.error("Failed to fetch addon:", err);
    return NextResponse.json({ error: "Failed to fetch addon" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.addon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Addon not found" }, { status: 404 });
    }

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

    if (body.isAvailable !== undefined) {
      data.isAvailable = Boolean(body.isAvailable);
    }

    if (body.isApproved !== undefined) {
      data.isApproved = Boolean(body.isApproved);
    }

    const updated = await prisma.addon.update({
      where: { id },
      data,
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
    });

    return NextResponse.json({ addon: updated, success: true });
  } catch (err: unknown) {
    console.error("Failed to update addon:", err);
    return NextResponse.json({ error: "Failed to update addon" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    const existing = await prisma.addon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Addon not found" }, { status: 404 });
    }

    await prisma.addon.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Addon deleted successfully" });
  } catch (err: unknown) {
    console.error("Failed to delete addon:", err);
    return NextResponse.json({ error: "Failed to delete addon" }, { status: 500 });
  }
}
