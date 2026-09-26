import React from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { VendorOrdersManager } from "@/components/vendor/vendor-orders-manager";
import type { OrderData } from "@/components/vendor/vendor-order-card";

export const dynamic = "force-dynamic";

export default async function VendorDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/vendor/login");
  }

  const vendor =
    session.vendorId != null
      ? await prisma.vendor.findUnique({ where: { id: session.vendorId } })
      : await prisma.vendor.findFirst({ where: { isActive: true } });

  const vendorId = vendor?.id;
  if (!vendorId) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center text-sm text-zinc-600">
        No vendor profile linked to this account.
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    where: {
      items: { some: { vendorId } },
    },
    include: {
      deliverySlot: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const netEarnings = totalRevenue * 0.85; // 85% after 15% marketplace commission

  const initialOrders: OrderData[] = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    customerEmail: o.customerEmail,
    recipientName: o.recipientName,
    recipientPhone: o.recipientPhone,
    deliveryAddress: o.deliveryAddress,
    deliveryCity: o.deliveryCity,
    deliveryPincode: o.deliveryPincode,
    landmark: o.landmark,
    deliveryInstructions: o.deliveryInstructions,
    messageOnCard: o.messageOnCard,
    messageOnCake: o.messageOnCake,
    deliveryDate: o.deliveryDate.toISOString(),
    deliverySlot: {
      title: o.deliverySlot.title,
      startTime: o.deliverySlot.startTime,
      endTime: o.deliverySlot.endTime,
    },
    status: o.status,
    subtotal: o.subtotal,
    total: o.total,
    items: o.items.map((it) => ({
      id: it.id,
      title: it.title,
      variantName: it.variantName,
      quantity: it.quantity,
      totalPrice: it.totalPrice,
      customCakeMessage: it.customCakeMessage,
      isEggless: it.isEggless,
    })),
  }));

  return (
    <VendorOrdersManager
      initialOrders={initialOrders}
      vendorName={vendor?.name || "Artisan Florist & Bakery Operations"}
      vendorCity={vendor?.city || undefined}
      prepTimeMinutes={vendor?.prepTimeMinutes || 45}
      netEarnings={netEarnings}
    />
  );
}
