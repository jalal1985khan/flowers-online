"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Store,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  Lock,
  User,
  Building,
} from "lucide-react";

export default function VendorRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form Fields
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Guwahati");
  const [state, setState] = useState("Assam");
  const [address, setAddress] = useState("");
  const [primaryPincode, setPrimaryPincode] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState("45");
  const [servicePincodesText, setServicePincodesText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const servicePincodes = servicePincodesText
        .split(",")
        .map((p) => p.trim())
        .filter((p) => /^\d{6}$/.test(p));

      const res = await fetch("/api/vendor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          ownerName,
          email,
          password,
          phone,
          city,
          state,
          address,
          primaryPincode,
          prepTimeMinutes: Number(prepTimeMinutes) || 45,
          servicePincodes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register vendor account");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-xl space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-zinc-900">
            Application Received!
          </h2>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Thank you for registering <strong>{businessName}</strong> with MyPetalsCart. Our merchant operations team is reviewing your bakery/florist details and service radius.
          </p>
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-left text-xs space-y-1">
            <div className="font-semibold text-zinc-800">Account Credentials:</div>
            <div className="text-zinc-500">Email: {email}</div>
            <div className="text-emerald-700 font-medium">Status: Pending Verification</div>
          </div>
          <Link href="/vendor/login">
            <Button className="w-full font-bold bg-rose-600 hover:bg-rose-700 text-white mt-2">
              Proceed to Vendor Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <Link href="/vendor/login" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 mb-2">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Vendor Sign In</span>
          </Link>

          <div className="flex items-center justify-center gap-2">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
              <Store className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold font-serif text-zinc-900">
              MyPetalsCart
            </span>
          </div>

          <h1 className="text-3xl font-extrabold font-serif text-zinc-900 tracking-tight">
            Partner With India&apos;s Leading Flower & Cake Network
          </h1>
          <p className="text-sm text-zinc-600 max-w-2xl mx-auto">
            Expand your artisan bakery or floral studio. Receive guaranteed local orders, express courier dispatch, and automated weekly direct bank payouts.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/50 flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-zinc-900">High Volume Orders</div>
              <div className="text-[11px] text-zinc-600 mt-0.5">Continuous celebrations, birthdays, anniversaries, and midnight deliveries.</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50/50 flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-zinc-900">Kitchen Prep Dashboard</div>
              <div className="text-[11px] text-zinc-600 mt-0.5">Live order queue, cake customization messages, and rider coordination.</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-zinc-900">15% Flat Commission</div>
              <div className="text-[11px] text-zinc-600 mt-0.5">Transparent platform rates with direct NEFT bank settlements every Monday.</div>
            </div>
          </div>
        </div>

        {/* Registration Form Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800">
                {error}
              </div>
            )}

            {/* Section 1: Business Identity */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-600 border-b border-zinc-100 pb-2 flex items-center gap-1.5">
                <Building className="h-4 w-4" />
                <span>1. Business Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Florist / Bakery Name *</label>
                  <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Guwahati Florist & Bakery"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">City *</label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Guwahati, Bengaluru, Mumbai"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">State *</label>
                  <Input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Assam, Karnataka, Maharashtra"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Kitchen / Studio Prep Time (mins)</label>
                  <Input
                    type="number"
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(e.target.value)}
                    placeholder="45"
                    required
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Complete Shop / Kitchen Address *</label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Shop #, Street name, Landmark..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Owner Login & Contact */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-600 border-b border-zinc-100 pb-2 flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>2. Owner Account & Contact</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Owner / Manager Name *</label>
                  <Input
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Mobile / WhatsApp Number *</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Portal Login Email *</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="merchant@example.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Create Password (min 6 chars) *</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Delivery Coverage Radius */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-600 border-b border-zinc-100 pb-2 flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>3. Delivery Service Radius</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Primary Kitchen Pincode (6 digits) *</label>
                  <Input
                    value={primaryPincode}
                    onChange={(e) => setPrimaryPincode(e.target.value)}
                    placeholder="e.g. 781001"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">
                    Additional Service Pincodes (comma-separated)
                  </label>
                  <Input
                    value={servicePincodesText}
                    onChange={(e) => setServicePincodesText(e.target.value)}
                    placeholder="e.g. 781003, 781005, 781006"
                  />
                </div>
              </div>
              <p className="text-[11px] text-zinc-500">
                Customers entering these pincodes will be able to order fresh items from your kitchen. You can always expand this list later from your store settings.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-zinc-100">
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md text-sm py-3"
              >
                {loading ? "Submitting Application..." : "Submit Partner Application"}
              </Button>
              <div className="mt-3 text-center text-xs text-zinc-500">
                Already registered with us?{" "}
                <Link href="/vendor/login" className="text-rose-600 font-semibold hover:underline">
                  Sign in here
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
