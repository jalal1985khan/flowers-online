"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/utils";
import { useCart, CartAddon } from "@/lib/cart-context";
import { useLocation } from "@/lib/location-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import Link from "next/link";

interface Variant {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  isDefault: boolean;
}

interface DeliverySlot {
  id: string;
  title: string;
  slotType: string;
  startTime: string;
  endTime: string;
  surcharge: number;
}

interface Addon {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
}

interface PDPInteractiveProps {
  product: {
    id: string;
    vendorId: string;
    title: string;
    slug: string;
    productType: string;
    basePrice: number;
    compareAtPrice: number | null;
    images: string[];
    isEgglessAvailable: boolean;
    isCustomMessageSupported: boolean;
  };
  variants: Variant[];
  deliverySlots: DeliverySlot[];
  addons: Addon[];
}

export function PDPInteractive({
  product,
  variants,
  deliverySlots,
  addons,
}: PDPInteractiveProps) {
  const { addItem } = useCart();
  const { location, setIsPincodeModalOpen } = useLocation();

  // Selection states
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    variants.find((v) => v.isDefault) || variants[0] || {
      id: "default",
      name: "Standard",
      price: product.basePrice,
      compareAtPrice: product.compareAtPrice,
      isDefault: true,
    }
  );

  const [isEggless, setIsEggless] = useState(false);
  const [messageOnCake, setMessageOnCake] = useState("");
  const [messageOnCard, setMessageOnCard] = useState("");

  // Delivery date selection (Today, Tomorrow, Day After)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const formatDateVal = (d: Date) => d.toISOString().split("T")[0];
  const formatLabel = (d: Date, prefix: string) =>
    `${prefix} (${d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })})`;

  const dateOptions = [
    { label: formatLabel(today, "Today"), val: formatDateVal(today) },
    { label: formatLabel(tomorrow, "Tomorrow"), val: formatDateVal(tomorrow) },
    { label: formatLabel(dayAfter, "Day After"), val: formatDateVal(dayAfter) },
  ];

  const [selectedDate, setSelectedDate] = useState(dateOptions[0].val);
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot>(
    deliverySlots[1] || deliverySlots[0]
  );

  // Selected add-ons map
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({});
  const [addedNotice, setAddedNotice] = useState(false);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) => {
      const cur = prev[addonId] || 0;
      if (cur > 0) {
        const copy = { ...prev };
        delete copy[addonId];
        return copy;
      }
      return { ...prev, [addonId]: 1 };
    });
  };

  // Price calculations
  const egglessSurcharge = isEggless ? 100 : 0;
  const addonsCost = Object.entries(selectedAddons).reduce((acc, [id, qty]) => {
    const found = addons.find((a) => a.id === id);
    return acc + (found ? found.price * qty : 0);
  }, 0);

  const currentPrice = selectedVariant.price + egglessSurcharge;
  const slotSurcharge = selectedSlot ? selectedSlot.surcharge : 0;
  const grandTotal = currentPrice + slotSurcharge + addonsCost;

  const handleAddToCart = () => {
    const chosenAddons: CartAddon[] = Object.entries(selectedAddons).map(([id, qty]) => {
      const found = addons.find((a) => a.id === id)!;
      return {
        id: found.id,
        title: found.title,
        price: found.price,
        quantity: qty,
      };
    });

    addItem({
      productId: product.id,
      vendorId: product.vendorId,
      title: product.title,
      image: product.images[0] || "",
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      unitPrice: currentPrice,
      quantity: 1,
      isEggless,
      messageOnCake: messageOnCake.trim() || undefined,
      messageOnCard: messageOnCard.trim() || undefined,
      deliveryDate: selectedDate,
      deliverySlotId: selectedSlot.id,
      deliverySlotTitle: selectedSlot.title,
      slotSurcharge: selectedSlot.surcharge,
      addons: chosenAddons,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Price Header */}
      <div className="flex items-baseline gap-3 border-b border-zinc-100 pb-4">
        <span className="text-3xl font-extrabold text-zinc-900 font-serif">
          {formatINR(currentPrice)}
        </span>
        {selectedVariant.compareAtPrice && (
          <span className="text-base text-zinc-400 line-through">
            {formatINR(selectedVariant.compareAtPrice + egglessSurcharge)}
          </span>
        )}
        <span className="text-xs text-zinc-500 font-medium">Inclusive of all taxes</span>
      </div>

      {/* Pincode & Delivery Area Check */}
      <div className="rounded-xl border border-rose-200/80 bg-rose-50/40 p-3.5 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-zinc-900">
              Delivering to: {location.city} ({location.pincode})
            </span>
          </div>
          <button
            onClick={() => setIsPincodeModalOpen(true)}
            className="font-bold text-rose-600 underline hover:text-rose-700"
          >
            Change Pincode
          </button>
        </div>
        <p className="mt-1 text-[11px] text-zinc-500">
          Earliest Delivery: <span className="font-semibold text-emerald-700">Today within 2 hrs</span> or tonight for <span className="font-semibold text-rose-700">Midnight (11-12 PM)</span>
        </p>
      </div>

      {/* Variant Selection */}
      {variants.length > 1 && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Select Size / Arrangement:
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                  selectedVariant.id === v.id
                    ? "border-rose-600 bg-rose-50/60 ring-2 ring-rose-600/20"
                    : "border-zinc-200 hover:border-zinc-300 bg-white"
                }`}
              >
                <span className="text-xs font-bold text-zinc-900">{v.name}</span>
                <span className="text-xs text-rose-700 font-semibold mt-1">
                  {formatINR(v.price)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Eggless Option (for cakes/combos) */}
      {product.isEgglessAvailable && (
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
              🌱
            </span>
            <div>
              <div className="text-xs font-bold text-zinc-900">Make it 100% Eggless</div>
              <div className="text-[11px] text-zinc-500">Baked fresh with pure vegetarian ingredients</div>
            </div>
          </div>
          <button
            onClick={() => setIsEggless(!isEggless)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              isEggless
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {isEggless ? <Check className="h-3.5 w-3.5" /> : null}
            <span>{isEggless ? "Added (+₹100)" : "+ ₹100"}</span>
          </button>
        </div>
      )}

      {/* Message on Cake (if supported) */}
      {product.isCustomMessageSupported && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <label className="font-bold text-zinc-700">Message on Cake (Optional):</label>
            <span className="text-[11px] text-zinc-400">{messageOnCake.length}/30</span>
          </div>
          <Input
            type="text"
            maxLength={30}
            placeholder="e.g. Happy Birthday Rahul!"
            value={messageOnCake}
            onChange={(e) => setMessageOnCake(e.target.value)}
            className="text-xs font-medium"
          />
        </div>
      )}

      {/* Free Greeting Card Message */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-700">
          Complimentary Message on Gift Card:
        </label>
        <Input
          type="text"
          maxLength={100}
          placeholder="e.g. With love from Ananya & Arjun"
          value={messageOnCard}
          onChange={(e) => setMessageOnCard(e.target.value)}
          className="text-xs"
        />
      </div>

      {/* Delivery Date & Time Slot Picker */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
          <Calendar className="h-4 w-4 text-rose-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
            Select Delivery Schedule
          </h4>
        </div>

        {/* Date Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {dateOptions.map((opt) => (
            <button
              key={opt.val}
              onClick={() => setSelectedDate(opt.val)}
              className={`rounded-lg border py-2 text-center text-xs font-semibold transition ${
                selectedDate === opt.val
                  ? "border-rose-600 bg-rose-50 text-rose-800"
                  : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Slots List */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Available Delivery Slots:
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {deliverySlots.map((slot) => {
              const isSelected = selectedSlot.id === slot.id;
              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`flex items-center justify-between rounded-xl border p-2.5 text-left text-xs transition ${
                    isSelected
                      ? "border-rose-600 bg-rose-50/70 ring-1 ring-rose-600"
                      : "border-zinc-200 text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-zinc-900">{slot.title}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </div>
                  <div>
                    {slot.surcharge > 0 ? (
                      <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">
                        +{formatINR(slot.surcharge)}
                      </span>
                    ) : (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        FREE
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Celebration Add-ons (Cross-sell) */}
      {addons.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Make it a Grand Celebration:
            </h4>
            <span className="text-[11px] text-zinc-400">Add to bundle</span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {addons.map((a) => {
              const isChosen = (selectedAddons[a.id] || 0) > 0;
              return (
                <div
                  key={a.id}
                  onClick={() => toggleAddon(a.id)}
                  className={`relative flex flex-col items-center rounded-xl border p-2.5 text-center cursor-pointer transition ${
                    isChosen
                      ? "border-rose-600 bg-rose-50/50 ring-1 ring-rose-600"
                      : "border-zinc-200 bg-white hover:border-rose-200"
                  }`}
                >
                  <img
                    src={a.image}
                    alt={a.title}
                    className="h-14 w-14 rounded-lg object-cover mb-2"
                  />
                  <span className="line-clamp-1 text-[11px] font-semibold text-zinc-900">
                    {a.title}
                  </span>
                  <span className="text-xs font-bold text-rose-700 mt-1">
                    +{formatINR(a.price)}
                  </span>
                  <button
                    className={`mt-2 w-full rounded-md py-1 text-[10px] font-bold transition ${
                      isChosen
                        ? "bg-rose-600 text-white"
                        : "border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {isChosen ? "✓ Added" : "+ Add"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cart Summary Bar & CTA */}
      <div className="sticky bottom-4 z-20 rounded-2xl border border-rose-200 bg-white/95 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-zinc-500">Order Subtotal:</div>
            <div className="text-xl font-black text-zinc-900 font-serif">
              {formatINR(grandTotal)}
            </div>
            {slotSurcharge > 0 && (
              <div className="text-[10px] text-rose-600">
                Includes {formatINR(slotSurcharge)} {selectedSlot.title.split(" ")[0]} Slot Fee
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="gap-2 px-6 font-bold shadow-lg shadow-rose-600/20 hover:scale-[1.02] transition"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Add to Cart</span>
            </Button>
          </div>
        </div>

        {addedNotice && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 border border-emerald-200 animate-in fade-in">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Added to your celebration cart!</span>
            </div>
            <Link href="/cart" className="underline font-bold text-emerald-900">
              View Cart →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
