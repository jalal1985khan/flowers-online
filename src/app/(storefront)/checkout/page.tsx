"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useLocation } from "@/lib/location-context";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, slotFeesTotal, total, clearCart } = useCart();
  const { location } = useLocation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [senderName, setSenderName] = useState("Aakash Sharma");
  const [senderEmail, setSenderEmail] = useState("aakash@example.com");
  const [senderPhone, setSenderPhone] = useState("9876543210");

  const [recipientName, setRecipientName] = useState("Sneha Patel");
  const [recipientPhone, setRecipientPhone] = useState("9876543211");
  const [address, setAddress] = useState("Flat 402, Sunshine Heights, 12th Main");
  const [landmark, setLandmark] = useState("Near BDA Complex");
  const [instructions, setInstructions] = useState("Midnight surprise! Please don't call recipient beforehand.");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-zinc-900">Your cart is currently empty</h2>
        <p className="text-xs text-zinc-500 mt-1">Please add items to your cart before proceeding to checkout.</p>
        <Button onClick={() => router.push("/catalog")} className="mt-4">
          Browse Catalog
        </Button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const firstItem = items[0];
      const payload = {
        customerName: senderName,
        customerEmail: senderEmail,
        customerPhone: senderPhone,
        recipientName,
        recipientPhone,
        deliveryAddress: address,
        deliveryCity: location.city,
        deliveryPincode: location.pincode,
        landmark,
        deliveryInstructions: instructions,
        deliveryDate: firstItem?.deliveryDate || new Date().toISOString(),
        deliverySlotId: firstItem?.deliverySlotId,
        messageOnCard: firstItem?.messageOnCard,
        messageOnCake: firstItem?.messageOnCake,
        isEggless: firstItem?.isEggless,
        subtotal,
        slotFee: slotFeesTotal,
        deliveryFee: 0,
        total,
        paymentMethod,
        items: items.map((i) => ({
          vendorId: i.vendorId,
          productId: i.productId,
          variantId: i.variantId,
          title: i.title,
          variantName: i.variantName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          messageOnCake: i.messageOnCake,
          isEggless: i.isEggless,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      clearCart();
      router.push(`/order/${data.orderNumber}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-serif text-zinc-900 sm:text-3xl">
          Secure Delivery Checkout
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Complete recipient details for seamless same-day or midnight delivery coordination.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Form: Details */}
          <div className="space-y-6 lg:col-span-8">
            {/* Sender Info */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-rose-600" />
                <span>1. Sender (Your Details)</span>
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700">Full Name</label>
                  <Input
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700">Email (For receipt)</label>
                  <Input
                    required
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700">Mobile (For updates)</label>
                  <Input
                    required
                    type="tel"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="mt-1 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Recipient & Address */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-600" />
                <span>2. Recipient & Delivery Address</span>
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-zinc-700">Recipient Name</label>
                  <Input
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Person receiving flowers/cake"
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700">Recipient Mobile Number</label>
                  <Input
                    required
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="For rider call upon arrival"
                    className="mt-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700">Full Street Address / Apartment</label>
                <Input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat/House No, Building Name, Street"
                  className="mt-1 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700">Landmark</label>
                  <Input
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Near temple, park, metro"
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700">City</label>
                  <Input readOnly value={location.city} className="mt-1 text-xs bg-zinc-50 font-semibold" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700">Pincode</label>
                  <Input readOnly value={location.pincode} className="mt-1 text-xs bg-zinc-50 font-semibold font-mono" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700">Special Delivery Instructions</label>
                <Input
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Ring bell twice, leave with security, call sender first"
                  className="mt-1 text-xs"
                />
              </div>
            </div>

            {/* Payment Selection */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-rose-600" />
                <span>3. Payment Method</span>
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { id: "UPI", label: "Instant UPI", sub: "GPay, PhonePe, Paytm, BHIM" },
                  { id: "Card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
                  { id: "NetBanking", label: "NetBanking", sub: "All Indian banks supported" },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`rounded-xl border p-3.5 cursor-pointer transition ${
                      paymentMethod === m.id
                        ? "border-rose-600 bg-rose-50/60 ring-1 ring-rose-600"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                      <span>{m.label}</span>
                      {paymentMethod === m.id && <CheckCircle2 className="h-4 w-4 text-rose-600" />}
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">{m.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary & Pay Button */}
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4 sticky top-24">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
                Review & Confirm
              </h3>

              <div className="max-h-60 overflow-y-auto space-y-2 divide-y divide-zinc-100 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-zinc-900 line-clamp-1">{item.title}</div>
                      <div className="text-[11px] text-zinc-500">
                        Qty: {item.quantity} {item.variantName ? `• ${item.variantName}` : ""}
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-zinc-900">
                      {formatINR(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Slot Surcharge</span>
                  <span>{slotFeesTotal > 0 ? formatINR(slotFeesTotal) : "FREE"}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-700 font-semibold">FREE</span>
                </div>
                <div className="border-t border-zinc-100 pt-2 flex justify-between items-baseline font-bold">
                  <span className="text-sm text-zinc-900">Total Payable</span>
                  <span className="text-2xl font-black text-rose-600 font-serif">
                    {formatINR(total)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full gap-2 font-bold shadow-lg shadow-rose-600/20 hover:scale-[1.01] transition"
              >
                <Lock className="h-4 w-4" />
                <span>{isSubmitting ? "Processing Order..." : `Pay ${formatINR(total)} & Place Order`}</span>
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>256-bit Bank-grade Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
