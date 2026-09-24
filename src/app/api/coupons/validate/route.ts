import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ valid: false, message: "Coupon code is required" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ valid: false, message: "Invalid or inactive coupon code" }, { status: 404 });
    }

    if (coupon.validUntil && new Date() > coupon.validUntil) {
      return NextResponse.json({ valid: false, message: "This coupon code has expired" }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, message: "Coupon usage limit has been reached" }, { status: 400 });
    }

    const orderAmount = Number(subtotal) || 0;
    if (orderAmount < coupon.minOrderValue) {
      return NextResponse.json(
        {
          valid: false,
          message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`,
        },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(coupon.discountValue, orderAmount);
    }

    // Round to whole rupees
    discount = Math.round(discount);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discount,
      description: coupon.description,
    });
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ valid: false, message: "Server error validating coupon" }, { status: 500 });
  }
}
