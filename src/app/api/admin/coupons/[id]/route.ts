import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DiscountType } from "@prisma/client";
import { requireAdminSession } from "@/lib/admin-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ coupon });
  } catch (err: unknown) {
    console.error("Failed to fetch coupon:", err);
    return NextResponse.json({ error: "Failed to fetch coupon" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};

    if (body.code !== undefined) {
      const cleanCode = String(body.code).toUpperCase().trim();
      if (!cleanCode) {
        return NextResponse.json({ error: "Coupon code cannot be empty" }, { status: 400 });
      }
      if (cleanCode !== existing.code) {
        const collision = await prisma.coupon.findUnique({ where: { code: cleanCode } });
        if (collision && collision.id !== id) {
          return NextResponse.json({ error: `Coupon code "${cleanCode}" already exists` }, { status: 400 });
        }
      }
      data.code = cleanCode;
    }

    if (body.description !== undefined) {
      data.description = String(body.description).trim();
    }

    if (body.discountType !== undefined) {
      data.discountType = body.discountType as DiscountType;
    }

    if (body.discountValue !== undefined) {
      data.discountValue = Number(body.discountValue);
    }

    if (body.minOrderValue !== undefined) {
      data.minOrderValue = Number(body.minOrderValue) || 0;
    }

    if ("maxDiscount" in body) {
      data.maxDiscount =
        body.maxDiscount === null || body.maxDiscount === ""
          ? null
          : Number(body.maxDiscount);
    }

    if ("usageLimit" in body) {
      data.usageLimit =
        body.usageLimit === null || body.usageLimit === ""
          ? null
          : Math.max(1, parseInt(body.usageLimit, 10));
    }

    if ("validUntil" in body) {
      data.validUntil = body.validUntil ? new Date(body.validUntil) : null;
    }

    if (typeof body.isActive === "boolean") {
      data.isActive = body.isActive;
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      coupon,
      message: `Coupon "${coupon.code}" updated successfully`,
    });
  } catch (err: unknown) {
    console.error("Failed to update coupon:", err);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    await prisma.coupon.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: `Coupon "${existing.code}" deleted successfully`,
    });
  } catch (err: unknown) {
    console.error("Failed to delete coupon:", err);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
