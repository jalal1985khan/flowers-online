import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DiscountType } from "@prisma/client";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json();
  const {
    code,
    description,
    discountType,
    discountValue,
    minOrderValue,
    maxDiscount,
    usageLimit,
    validUntil,
    isActive,
  } = body;

  try {
    const cleanCode = String(code).toUpperCase().trim();
    const existing = await prisma.coupon.findUnique({ where: { code: cleanCode } });
    if (existing) {
      return NextResponse.json({ error: `Coupon code "${cleanCode}" already exists` }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        description: String(description).trim(),
        discountType: (discountType as DiscountType) || DiscountType.PERCENTAGE,
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue || 0),
        maxDiscount: maxDiscount != null && maxDiscount !== "" ? Number(maxDiscount) : null,
        usageLimit: usageLimit != null && usageLimit !== "" ? Math.max(1, parseInt(usageLimit, 10)) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (err: unknown) {
    console.error("Failed to create coupon:", err);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
