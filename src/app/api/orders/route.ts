import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createMarketplaceOrder } from "@/lib/create-marketplace-order";

/** Place order without online payment (fallback / COD-style pending). Prefer Razorpay verify for paid orders. */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const order = await createMarketplaceOrder(body, session);

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      paymentStatus: order.paymentStatus,
    });
  } catch (error: unknown) {
    console.error("Order creation failed:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
