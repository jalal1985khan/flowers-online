"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  Minus,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    slotFeesTotal,
    appliedCoupon,
    discountTotal,
    total,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = React.useState("");
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = React.useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError(null);
    const res = await applyCoupon(couponInput.trim());
    setIsApplyingCoupon(false);
    if (!res.success) {
      setCouponError(res.message || "Failed to apply coupon");
    } else {
      setCouponInput("");
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-zinc-900">Your Celebration Cart is Empty</h2>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-2">
          Discover fresh hand-tied bouquets, artisan celebration cakes, and memorable combos ready for delivery today.
        </p>
        <Link href="/catalog" className="inline-block mt-6">
          <Button size="lg" className="gap-2">
            <span>Explore Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 mb-8">
        <ShoppingBag className="h-6 w-6 text-rose-600" />
        <h1 className="text-2xl font-bold font-serif text-zinc-900 sm:text-3xl">
          Your Celebration Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Items List */}
        <div className="space-y-4 lg:col-span-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs"
            >
              {/* Product Thumbnail */}
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Item Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-zinc-900">{item.title}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-zinc-400 hover:text-red-600 transition p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    {item.variantName && (
                      <span className="rounded bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">
                        {item.variantName}
                      </span>
                    )}
                    {item.isEggless && (
                      <span className="rounded bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-800">
                        🌱 Eggless
                      </span>
                    )}
                  </div>

                  {/* Custom Messages */}
                  {item.messageOnCake && (
                    <p className="mt-1.5 text-[11px] text-zinc-600 bg-amber-50/70 rounded px-2 py-1 border border-amber-200/50">
                      <span className="font-semibold text-amber-900">Message on Cake:</span> "{item.messageOnCake}"
                    </p>
                  )}
                  {item.messageOnCard && (
                    <p className="mt-1 text-[11px] text-zinc-600 bg-rose-50/70 rounded px-2 py-1 border border-rose-200/50">
                      <span className="font-semibold text-rose-900">Card Message:</span> "{item.messageOnCard}"
                    </p>
                  )}

                  {/* Add-ons list if any */}
                  {item.addons && item.addons.length > 0 && (
                    <div className="mt-2 text-[11px] text-zinc-500">
                      <span className="font-semibold text-zinc-700">Add-ons: </span>
                      {item.addons.map((a) => `${a.title} (${formatINR(a.price)})`).join(", ")}
                    </div>
                  )}

                  {/* Delivery Slot info */}
                  {item.deliverySlotTitle && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-rose-700 bg-rose-50/60 rounded-lg p-2 font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{item.deliveryDate}</span>
                      <span>•</span>
                      <Clock className="h-3.5 w-3.5" />
                      <span>{item.deliverySlotTitle}</span>
                      {item.slotSurcharge ? (
                        <span className="font-bold">(+{formatINR(item.slotSurcharge)})</span>
                      ) : (
                        <span className="text-emerald-700 font-bold">(Free Slot)</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Row: Quantity & Price */}
                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="rounded border border-zinc-300 p-1 hover:bg-zinc-100"
                    >
                      <Minus className="h-3.5 w-3.5 text-zinc-600" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-zinc-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="rounded border border-zinc-300 p-1 hover:bg-zinc-100"
                    >
                      <Plus className="h-3.5 w-3.5 text-zinc-600" />
                    </button>
                  </div>

                  <span className="text-base font-bold text-zinc-900 tracking-tight tabular-nums">
                    {formatINR(
                      (item.unitPrice +
                        (item.addons?.reduce((a, b) => a + b.price * b.quantity, 0) || 0)) *
                        item.quantity
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout */}
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Items Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Delivery Slot Surcharges</span>
                <span>{slotFeesTotal > 0 ? formatINR(slotFeesTotal) : "FREE"}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Standard Delivery Fee</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>- {formatINR(discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600">
                <span>Estimated Taxes (GST)</span>
                <span className="text-zinc-500">Included</span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="border-t border-zinc-100 pt-3">
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs">
                  <div>
                    <div className="font-bold text-emerald-900 flex items-center gap-1">
                      <span>🏷️ {appliedCoupon.code}</span>
                      <span className="text-[10px] text-emerald-700 font-normal">Applied</span>
                    </div>
                    <div className="text-[11px] text-emerald-700">{appliedCoupon.description}</div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Coupon (e.g. FIRSTBLOOM)"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError(null);
                      }}
                      className="flex-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs uppercase font-medium placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <Button
                      size="sm"
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      onClick={handleApplyCoupon}
                      className="px-3"
                    >
                      {isApplyingCoupon ? "..." : "Apply"}
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                  )}
                  <div className="text-[10px] text-zinc-400">
                    Try <button onClick={() => setCouponInput("FIRSTBLOOM")} className="font-bold text-rose-600 underline">FIRSTBLOOM</button> or <button onClick={() => setCouponInput("MIDNIGHT50")} className="font-bold text-rose-600 underline">MIDNIGHT50</button>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-100 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold text-zinc-900">Total Payable</span>
              <span className="text-2xl font-bold text-rose-600 tracking-tight tabular-nums">
                {formatINR(total)}
              </span>
            </div>

            <Link href="/checkout" className="block w-full">
              <Button size="lg" className="w-full gap-2 font-bold shadow-md hover:shadow-lg">
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <div className="rounded-xl bg-zinc-50 p-3 text-[11px] text-zinc-500 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-700">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>100% Safe & Secure Checkout</span>
              </div>
              <p>Supports UPI, NetBanking, Debit/Credit cards, and wallets.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
