import { NextResponse } from "next/server";
import { PaymentStatus } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { createMarketplaceOrder } from "@/lib/create-marketplace-order";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay-server";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderPayload,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing Razorpay payment details" }, { status: 400 });
    }

    const valid = verifyRazorpayPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!valid) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    if (!orderPayload?.items?.length) {
      return NextResponse.json({ error: "Order payload is invalid" }, { status: 400 });
    }

    const order = await createMarketplaceOrder(
      {
        ...orderPayload,
        paymentStatus: PaymentStatus.PAID,
        paymentId: razorpay_payment_id,
        paymentMethod: "Razorpay",
      },
      session
    );

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      paymentStatus: order.paymentStatus,
    });
  } catch (error: unknown) {
    console.error("Razorpay verify failed:", error);
    const message = error instanceof Error ? error.message : "Payment verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
