import React from "react";
import { prisma } from "@/lib/prisma";
import { VendorOrderCard } from "@/components/vendor/vendor-order-card";
import { formatINR } from "@/lib/utils";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Store,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VendorDashboardPage() {
  const [orders, vendor] = await Promise.all([
    prisma.order.findMany({
      include: {
        deliverySlot: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.vendor.findFirst({
      where: { isActive: true },
    }),
  ]);

  const placedCount = orders.filter((o) => o.status === "PLACED").length;
  const preparingCount = orders.filter((o) => o.status === "PREPARING" || o.status === "ACCEPTED").length;
  const outCount = orders.filter((o) => o.status === "OUT_FOR_DELIVERY").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const netEarnings = totalRevenue * 0.85; // 85% after 15% marketplace commission

  return (
    <div className="space-y-8">
      {/* Vendor Profile Header */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 font-bold text-lg">
            {vendor?.name ? vendor.name.charAt(0) : "V"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-zinc-900 font-serif">
                {vendor?.name || "Artisan Florist & Bakery Operations"}
              </h2>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                Active Partner
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {vendor?.city} • Standard Prep Time: {vendor?.prepTimeMinutes || 45} mins • Commission: 15%
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-2 text-right">
            <div className="text-[11px] text-zinc-500">Net Estimated Payout</div>
            <div className="text-lg font-bold text-zinc-900 font-mono">
              {formatINR(netEarnings)}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold uppercase tracking-wider">New Placed</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-900 mt-2">
            {placedCount}
          </div>
          <p className="text-[11px] text-amber-700 mt-1">Requires immediate acceptance</p>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4">
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-xs font-bold uppercase tracking-wider">In Prep</span>
            <Package className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-900 mt-2">
            {preparingCount}
          </div>
          <p className="text-[11px] text-purple-700 mt-1">Flowers tying / cakes baking</p>
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-xs font-bold uppercase tracking-wider">Out with Rider</span>
            <Truck className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-900 mt-2">
            {outCount}
          </div>
          <p className="text-[11px] text-indigo-700 mt-1">On delivery transit</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-900 mt-2">
            {deliveredCount}
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">Successfully delivered</p>
        </div>
      </div>

      {/* Orders Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <h3 className="text-base font-bold text-zinc-900">
            Active Fulfillment Queue ({orders.length} orders)
          </h3>
          <span className="text-xs text-zinc-500">Sorted by newest first</span>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
            <Package className="mx-auto h-8 w-8 text-zinc-400" />
            <p className="mt-2 text-sm font-semibold text-zinc-900">No active orders</p>
            <p className="text-xs text-zinc-500 mt-1">
              Place a test order on the storefront to see it arrive here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <VendorOrderCard
                key={o.id}
                order={{
                  id: o.id,
                  orderNumber: o.orderNumber,
                  customerName: o.customerName,
                  customerPhone: o.customerPhone,
                  recipientName: o.recipientName,
                  recipientPhone: o.recipientPhone,
                  deliveryAddress: o.deliveryAddress,
                  deliveryCity: o.deliveryCity,
                  deliveryPincode: o.deliveryPincode,
                  landmark: o.landmark,
                  deliveryInstructions: o.deliveryInstructions,
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
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
