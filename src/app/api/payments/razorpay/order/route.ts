import { NextResponse } from "next/server";
import { getRazorpayClient, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay-server";

export async function POST(request: Request) {
  try {
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: "Razorpay is not configured on the server." },
        { status: 503 }
      );
    }

    const { amount, receipt } = await request.json();
    const amountPaise = Math.round(Number(amount) * 100);

    if (!amountPaise || amountPaise < 100) {
      return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: receipt || `bnb_${Date.now()}`,
      payment_capture: true,
    });

    return NextResponse.json({
      keyId: getRazorpayKeyId(),
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: unknown) {
    console.error("Razorpay order creation failed:", error);
    const message = error instanceof Error ? error.message : "Failed to create payment order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
