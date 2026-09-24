import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  Calendar,
  Gift,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface OrderTrackingProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default async function OrderTrackingPage({ params }: OrderTrackingProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      deliverySlot: true,
      items: {
        include: {
          product: true,
          vendor: true,
        },
      },
      events: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const steps = [
    { key: "PLACED", label: "Order Placed", desc: "Payment verified", icon: CheckCircle2 },
    { key: "ACCEPTED", label: "Vendor Accepted", desc: "Baker/Florist notified", icon: ShieldCheck },
    { key: "PREPARING", label: "Crafting & Baking", desc: "Fresh blooms & cake in prep", icon: Package },
    { key: "OUT_FOR_DELIVERY", label: "Out For Delivery", desc: "Rider on the way", icon: Truck },
    { key: "DELIVERED", label: "Celebration Delivered", desc: "Smiles shared", icon: Gift },
  ];

  const currentStepIdx = steps.findIndex((s) => s.key === order.status);
  const activeIdx = currentStepIdx === -1 ? 0 : currentStepIdx;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Top Success Banner */}
      <div className="rounded-3xl border border-rose-200/80 bg-gradient-to-r from-rose-50 via-white to-amber-50/40 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  Celebration Order Confirmed
                </span>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  {order.paymentStatus}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-serif text-zinc-900 sm:text-3xl mt-0.5">
                Order #{order.orderNumber}
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                A confirmation has been sent to <span className="font-semibold text-zinc-700">{order.customerEmail}</span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-3 text-right text-xs">
            <div className="text-zinc-400">Total Paid</div>
            <div className="text-xl font-black text-rose-600 font-serif">
              {formatINR(order.total)}
            </div>
            <div className="text-[10px] text-zinc-500">{order.paymentMethod}</div>
          </div>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-6">
          Live Fulfillment Status
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= activeIdx;
            const isCurrent = idx === activeIdx;

            return (
              <div
                key={step.key}
                className={`flex flex-col items-center text-center p-3 rounded-xl border transition ${
                  isCurrent
                    ? "border-rose-600 bg-rose-50/70 shadow-xs"
                    : isCompleted
                    ? "border-emerald-200 bg-emerald-50/40 text-zinc-900"
                    : "border-zinc-100 bg-zinc-50/50 opacity-50"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full mb-2 ${
                    isCurrent
                      ? "bg-rose-600 text-white animate-bounce"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-200 text-zinc-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-zinc-900">{step.label}</span>
                <span className="text-[11px] text-zinc-500 mt-0.5">{step.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Schedule & Recipient Details */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-600">
            <Clock className="h-5 w-5" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Delivery Schedule
            </h4>
          </div>
          <div className="text-sm font-bold text-zinc-900">
            {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-800">
            <span>{order.deliverySlot.title}</span>
            <span className="text-[10px] text-zinc-500">
              ({order.deliverySlot.startTime} - {order.deliverySlot.endTime})
            </span>
          </div>
          {order.deliveryInstructions && (
            <p className="text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200/60">
              <span className="font-semibold text-zinc-800">Instructions: </span>
              {order.deliveryInstructions}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-600">
            <MapPin className="h-5 w-5" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Recipient & Destination
            </h4>
          </div>
          <div className="text-sm font-bold text-zinc-900">{order.recipientName}</div>
          <div className="text-xs text-zinc-600 leading-relaxed">
            {order.deliveryAddress}
            {order.landmark ? `, Near ${order.landmark}` : ""}
            <br />
            {order.deliveryCity} — {order.deliveryPincode}
          </div>
          <div className="text-xs text-zinc-500 font-mono">
            Contact: {order.recipientPhone}
          </div>
        </div>
      </div>

      {/* Ordered Items */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
          Items in this Celebration
        </h3>

        <div className="divide-y divide-zinc-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-zinc-100">
                  <img
                    src={item.product.images[0] || ""}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">{item.title}</h4>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Vendor: <span className="font-semibold text-zinc-700">{item.vendor.name}</span>
                    {item.variantName ? ` • ${item.variantName}` : ""}
                    {item.isEggless ? " • 🌱 Eggless" : ""}
                  </div>
                  {item.customCakeMessage && (
                    <div className="mt-1 text-[11px] text-amber-900 bg-amber-50 rounded px-2 py-0.5 inline-block">
                      Cake Note: "{item.customCakeMessage}"
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-zinc-500">Qty: {item.quantity}</div>
                <div className="text-sm font-bold text-zinc-900 font-serif">
                  {formatINR(item.totalPrice)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Timeline Log */}
      {order.events.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
            Order Activity History
          </h3>
          <div className="space-y-3">
            {order.events.map((ev) => (
              <div key={ev.id} className="flex items-start gap-3 text-xs">
                <div className="h-2 w-2 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900">{ev.status.replace("_", " ")}</span>
                    <span className="text-[10px] text-zinc-400">
                      {new Date(ev.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {ev.note && <p className="text-zinc-500 text-[11px] mt-0.5">{ev.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back to Home CTA */}
      <div className="flex justify-between items-center pt-4">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            ← Return to Storefront
          </Button>
        </Link>
        <Link href="/catalog">
          <Button className="gap-2">
            <span>Send Another Gift</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
