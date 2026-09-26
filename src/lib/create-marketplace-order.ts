import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { lookupPincode } from "@/lib/delivery-pincodes";
import { citySlugFromPincodeCity, isCityLiveDelivery } from "@/lib/market-cities";
import type { SessionUser } from "@/lib/auth";

export interface CreateOrderItemInput {
  vendorId?: string;
  productId?: string;
  variantId?: string;
  title: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  messageOnCake?: string;
  isEggless?: boolean;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPincode: string;
  landmark?: string;
  deliveryInstructions?: string;
  deliveryDate: string;
  deliverySlotId?: string;
  messageOnCard?: string;
  messageOnCake?: string;
  isEggless?: boolean;
  subtotal: number;
  slotFee?: number;
  deliveryFee?: number;
  couponCode?: string;
  couponDiscount?: number;
  total: number;
  paymentMethod?: string;
  paymentStatus?: PaymentStatus;
  paymentId?: string | null;
  items: CreateOrderItemInput[];
}

export async function createMarketplaceOrder(
  input: CreateOrderInput,
  session: SessionUser | null
) {
  const pin = String(input.deliveryPincode || "").trim();
  const pinInfo = lookupPincode(pin);
  if (!pinInfo) {
    throw new Error("Delivery is not available for this pincode.");
  }

  const citySlug = citySlugFromPincodeCity(input.deliveryCity || pinInfo.city);
  if (!isCityLiveDelivery(citySlug)) {
    throw new Error(
      `Online checkout is not live in ${input.deliveryCity || pinInfo.city} yet. Guwahati is our active delivery city.`
    );
  }

  const serviceableVendor = await prisma.vendorServiceArea.findFirst({
    where: { pincode: pin, vendor: { isActive: true, isApproved: true } },
  });

  if (!serviceableVendor) {
    throw new Error("No vendor partners currently serve this pincode.");
  }

  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `BNB-${new Date().getFullYear()}-${randomSuffix}`;

  const slot = input.deliverySlotId
    ? await prisma.deliverySlot.findFirst({ where: { id: input.deliverySlotId } })
    : null;

  const targetSlotId =
    slot?.id ?? (await prisma.deliverySlot.findFirst({ orderBy: { sortOrder: "asc" } }))!.id;

  const defaultVendor = await prisma.vendor.findFirst({ where: { isActive: true } });
  const defaultProduct = await prisma.product.findFirst({
    where: { isAvailable: true, isApproved: true },
  });

  const orderItemsData = [];
  for (const item of input.items) {
    let vId = item.vendorId;
    let pId = item.productId;

    let existingProduct = null;
    if (pId) {
      existingProduct = await prisma.product.findUnique({
        where: { id: pId },
        include: { vendor: { include: { serviceAreas: true } } },
      });
    }

    if (!existingProduct) {
      pId = defaultProduct?.id || "";
      vId = defaultProduct?.vendorId || defaultVendor?.id || "";
    } else {
      vId = existingProduct.vendorId;
      const servesPin = existingProduct.vendor.serviceAreas.some((a) => a.pincode === pin);
      if (!servesPin) {
        throw new Error(`${existingProduct.title} cannot be delivered to pincode ${pin}.`);
      }
    }

    orderItemsData.push({
      vendorId: vId!,
      productId: pId!,
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

  const paymentStatus = input.paymentStatus ?? PaymentStatus.PENDING;
  const paidNote =
    paymentStatus === PaymentStatus.PAID
      ? "Payment verified via Razorpay. Order confirmed for fulfillment."
      : "Order placed. Complete payment to confirm fulfillment.";

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId: session?.id ?? null,
      customerName: input.customerName || session?.name || "Guest Customer",
      customerEmail: input.customerEmail || session?.email || "guest@example.com",
      customerPhone: input.customerPhone || "9999999999",
      recipientName: input.recipientName || input.customerName,
      recipientPhone: input.recipientPhone || input.customerPhone,
      deliveryAddress: input.deliveryAddress,
      deliveryCity: input.deliveryCity || lookupPincode(pin)!.city,
      deliveryPincode: pin,
      landmark: input.landmark || null,
      deliveryInstructions: input.deliveryInstructions || null,
      deliveryDate: input.deliveryDate ? new Date(input.deliveryDate) : new Date(),
      deliverySlotId: targetSlotId,
      messageOnCard: input.messageOnCard || null,
      messageOnCake: input.messageOnCake || null,
      isEggless: Boolean(input.isEggless),
      subtotal: Number(input.subtotal),
      slotFee: Number(input.slotFee || 0),
      deliveryFee: Number(input.deliveryFee || 0),
      couponCode: input.couponCode || null,
      couponDiscount: Number(input.couponDiscount || 0),
      discount: Number(input.couponDiscount || 0),
      total: Number(input.total),
      status: OrderStatus.PLACED,
      paymentStatus,
      paymentMethod: input.paymentMethod || "Razorpay",
      paymentId: input.paymentId ?? null,
      items: { create: orderItemsData },
      events: {
        create: {
          status: OrderStatus.PLACED,
          note: paidNote,
          actorRole: session ? "CUSTOMER" : "SYSTEM",
        },
      },
    },
    include: { items: true },
  });

  if (input.couponCode && input.couponDiscount) {
    await prisma.coupon.updateMany({
      where: { code: input.couponCode },
      data: { timesUsed: { increment: 1 } },
    });
  }

  return order;
}
