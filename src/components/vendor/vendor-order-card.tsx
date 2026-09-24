"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  CheckCircle,
  Truck,
  Package,
  Calendar,
  AlertCircle,
  User,
  Phone,
} from "lucide-react";

interface OrderProps {
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    recipientName: string;
    recipientPhone: string;
    deliveryAddress: string;
    deliveryCity: string;
    deliveryPincode: string;
    landmark?: string | null;
    deliveryInstructions?: string | null;
    deliveryDate: string;
    deliverySlot: {
      title: string;
      startTime: string;
      endTime: string;
    };
    status: string;
    subtotal: number;
    total: number;
    items: Array<{
      id: string;
      title: string;
      variantName?: string | null;
      quantity: number;
      totalPrice: number;
      customCakeMessage?: string | null;
      isEggless: boolean;
    }>;
  };
}

export function VendorOrderCard({ order: initialOrder }: OrderProps) {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (nextStatus: string, note: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          note,
          actorRole: "VENDOR",
        }),
      });

      if (res.ok) {
        setOrder((prev) => ({ ...prev, status: nextStatus }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    PLACED: "bg-amber-100 text-amber-800 border-amber-300",
    ACCEPTED: "bg-blue-100 text-blue-800 border-blue-300",
    PREPARING: "bg-purple-100 text-purple-800 border-purple-300",
    OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-800 border-indigo-300",
    DELIVERED: "bg-emerald-100 text-emerald-800 border-emerald-300",
    CANCELLED: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs transition hover:shadow-md">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-zinc-900">
            #{order.orderNumber}
          </span>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
              statusColors[order.status] || "bg-zinc-100 text-zinc-700"
            }`}
          >
            {order.status.replace("_", " ")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
          <span>
            {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <span>•</span>
          <Clock className="h-3.5 w-3.5 text-rose-500" />
          <span className="font-semibold text-rose-700">{order.deliverySlot.title}</span>
        </div>
      </div>

      {/* Recipient & Address */}
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs bg-zinc-50/80 rounded-xl p-3.5 border border-zinc-100">
        <div>
          <div className="font-bold text-zinc-900 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-zinc-500" />
            <span>Recipient: {order.recipientName}</span>
          </div>
          <div className="text-zinc-600 flex items-center gap-1.5 mt-1">
            <Phone className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-mono">{order.recipientPhone}</span>
          </div>
        </div>

        <div>
          <div className="text-zinc-700 font-medium flex items-start gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
            <span>
              {order.deliveryAddress}
              {order.landmark ? `, Near ${order.landmark}` : ""}
              <br />
              {order.deliveryCity} — <strong className="font-mono">{order.deliveryPincode}</strong>
            </span>
          </div>
          {order.deliveryInstructions && (
            <p className="mt-1 text-[11px] text-amber-900 font-semibold">
              Note: {order.deliveryInstructions}
            </p>
          )}
        </div>
      </div>

      {/* Items list */}
      <div className="mt-3 space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          Items to Prepare:
        </div>
        {order.items.map((it) => (
          <div
            key={it.id}
            className="flex items-center justify-between text-xs rounded-lg border border-zinc-100 p-2.5 bg-white"
          >
            <div>
              <span className="font-bold text-zinc-900">{it.quantity}x {it.title}</span>
              {it.variantName && <span className="text-zinc-500"> ({it.variantName})</span>}
              {it.isEggless && (
                <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  🌱 Eggless
                </span>
              )}
              {it.customCakeMessage && (
                <div className="mt-1 text-[11px] text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded">
                  🎂 Cake Piping: "{it.customCakeMessage}"
                </div>
              )}
            </div>
            <span className="font-mono font-bold text-zinc-900">{formatINR(it.totalPrice)}</span>
          </div>
        ))}
      </div>

      {/* Vendor Action Buttons based on state */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-3">
        <div className="text-xs text-zinc-500">
          Vendor Payout (85%):{" "}
          <strong className="text-zinc-900 font-mono text-sm">
            {formatINR(order.total * 0.85)}
          </strong>
        </div>

        <div className="flex gap-2">
          {order.status === "PLACED" && (
            <Button
              size="sm"
              disabled={loading}
              onClick={() => updateStatus("ACCEPTED", "Vendor confirmed kitchen/florist capacity.")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              ✓ Accept Order
            </Button>
          )}

          {order.status === "ACCEPTED" && (
            <Button
              size="sm"
              disabled={loading}
              onClick={() => updateStatus("PREPARING", "Chef & Florist started preparation.")}
              className="bg-purple-600 hover:bg-purple-700 gap-1.5"
            >
              <Package className="h-3.5 w-3.5" />
              <span>Start Preparing</span>
            </Button>
          )}

          {order.status === "PREPARING" && (
            <Button
              size="sm"
              disabled={loading}
              onClick={() => updateStatus("OUT_FOR_DELIVERY", "Handed over to delivery rider.")}
              className="bg-indigo-600 hover:bg-indigo-700 gap-1.5"
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Dispatch with Rider</span>
            </Button>
          )}

          {order.status === "OUT_FOR_DELIVERY" && (
            <Button
              size="sm"
              disabled={loading}
              onClick={() => updateStatus("DELIVERED", "Order delivered to recipient.")}
              className="bg-emerald-600 hover:bg-emerald-700 gap-1.5"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Confirm Delivery</span>
            </Button>
          )}

          {order.status === "DELIVERED" && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle className="h-4 w-4" />
              Fulfillment Complete
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
