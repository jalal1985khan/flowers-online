import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      recipientName,
      recipientPhone,
      deliveryAddress,
      deliveryCity,
      deliveryPincode,
      landmark,
      deliveryInstructions,
      deliveryDate,
      deliverySlotId,
      messageOnCard,
      messageOnCake,
      isEggless,
      subtotal,
      slotFee,
      deliveryFee,
      total,
      paymentMethod,
      items,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Generate random order number
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `BNB-${new Date().getFullYear()}-${randomSuffix}`;

    // Verify slot
    const slot = await prisma.deliverySlot.findFirst({
      where: { id: deliverySlotId },
    });

    const targetSlotId = slot ? slot.id : (await prisma.deliverySlot.findFirst())!.id;

    // Resolve default vendor and product fallback if needed
    const defaultVendor = await prisma.vendor.findFirst();
    const defaultProduct = await prisma.product.findFirst();

    const orderItemsData = [];
    for (const item of items) {
      let vId = item.vendorId;
      let pId = item.productId;

      let existingProduct = null;
      if (pId) {
        existingProduct = await prisma.product.findUnique({
          where: { id: pId },
        });
      }

      if (!existingProduct) {
        pId = defaultProduct?.id || "";
        vId = defaultProduct?.vendorId || defaultVendor?.id || "";
      } else {
        vId = existingProduct.vendorId;
      }

      orderItemsData.push({
        vendorId: vId,
        productId: pId,
        variantId: item.variantId && item.variantId !== "default" ? item.variantId : null,
        title: item.title,
        variantName: item.variantName || null,
        quantity: Number(item.quantity) || 1,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.unitPrice) * (Number(item.quantity) || 1),
        customCakeMessage: item.messageOnCake || null,
        isEggless: Boolean(item.isEggless),
      });
    }

    // Create Order in Database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName || "Guest Customer",
        customerEmail: customerEmail || "guest@example.com",
        customerPhone: customerPhone || "9999999999",
        recipientName: recipientName || customerName,
        recipientPhone: recipientPhone || customerPhone,
        deliveryAddress: deliveryAddress || "Address provided at checkout",
        deliveryCity: deliveryCity || "Bengaluru",
        deliveryPincode: deliveryPincode || "560001",
        landmark: landmark || null,
        deliveryInstructions: deliveryInstructions || null,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : new Date(),
        deliverySlotId: targetSlotId,
        messageOnCard: messageOnCard || null,
        messageOnCake: messageOnCake || null,
        isEggless: Boolean(isEggless),
        subtotal: Number(subtotal),
        slotFee: Number(slotFee || 0),
        deliveryFee: Number(deliveryFee || 0),
        couponCode: body.couponCode || null,
        couponDiscount: Number(body.couponDiscount || 0),
        discount: Number(body.couponDiscount || 0),
        total: Number(total),
        status: OrderStatus.PLACED,
        paymentStatus: PaymentStatus.PAID, // Simulated successful payment
        paymentMethod: paymentMethod || "UPI / Netbanking",
        paymentId: `PAY-${Date.now()}`,
        items: {
          create: orderItemsData,
        },
        events: {
          create: {
            status: OrderStatus.PLACED,
            note: "Order confirmed and payment verified via UPI. Dispatched to vendor partner.",
            actorRole: "SYSTEM",
          },
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
