"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  MapPin,
  Clock,
  Phone,
  Mail,
  Building,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ServiceAreaItem {
  id: string;
  pincode: string;
  city: string;
}

interface VendorProfile {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  prepTimeMinutes: number;
  commissionRate: number;
  isApproved: boolean;
  isActive: boolean;
  serviceAreas: ServiceAreaItem[];
  _count?: {
    products: number;
    orderItems: number;
  };
}

export default function VendorSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<VendorProfile | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(45);
  const [pincodes, setPincodes] = useState<string[]>([]);
  const [newPincode, setNewPincode] = useState("");

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/profile");
      if (!res.ok) throw new Error("Failed to load store profile");
      const data = await res.json();
      const v: VendorProfile = data.vendor;
      setProfile(v);
      setName(v.name);
      setPhone(v.phone);
      setCity(v.city);
      setState(v.state);
      setAddress(v.address);
      setPrepTimeMinutes(v.prepTimeMinutes || 45);
      setPincodes(v.serviceAreas.map((sa) => sa.pincode));
    } catch {
      setNotification({
        type: "error",
        message: "Failed to load store profile. Please refresh.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newPincode.trim();
    if (!/^\d{6}$/.test(clean)) {
      setNotification({ type: "error", message: "Pincode must be exactly 6 digits." });
      return;
    }
    if (pincodes.includes(clean)) {
      setNotification({ type: "error", message: "This pincode is already in your service list." });
      return;
    }
    setPincodes([...pincodes, clean]);
    setNewPincode("");
  };

  const handleRemovePincode = (pin: string) => {
    setPincodes(pincodes.filter((p) => p !== pin));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      setNotification({
        type: "error",
        message: "Shop Name, Phone, City, and Address are required.",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          state: state.trim(),
          address: address.trim(),
          prepTimeMinutes: Number(prepTimeMinutes),
          servicePincodes: pincodes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setProfile(data.vendor);
      setNotification({
        type: "success",
        message: "Your kitchen and store profile was saved successfully!",
      });
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to save profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-500 space-y-3">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-rose-600" />
        <p className="text-sm font-medium">Loading store settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-semibold shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 ${notification.type === "success"
            ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
            : "bg-rose-50 text-rose-800 border border-rose-300"
            }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <Link
            href="/vendor"
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 transition mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Orders Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold font-serif text-zinc-900">
            Store Profile & Kitchen Settings
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage your bakery/florist business details, preparation timings, and serviceable local pincodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold border ${profile?.isApproved
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
          >
            {profile?.isApproved ? "Approved Merchant" : "Pending Operations Review"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Business Details */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Building className="h-5 w-5 text-rose-600" />
            <h2 className="text-base font-bold text-zinc-900">Merchant Identity & Contact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                  <span>Bakery / Florist Store Name</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200/80 px-2 py-0.5 rounded-full">
                    <Lock className="h-2.5 w-2.5" />
                    Locked
                  </span>
                </label>
              </div>
              <div className="relative">
                <Input
                  value={name}
                  disabled
                  readOnly
                  className="bg-zinc-50 text-zinc-600 border-zinc-200 cursor-not-allowed pr-9 font-medium"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
              <p className="text-[11px] text-zinc-500">
                Store name is verified and locked to protect merchant identity. Contact marketplace admin to request a legal business name change.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Contact Phone / WhatsApp *</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile number"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Account Email (Login identifier)</label>
              <Input
                value={profile?.email || ""}
                disabled
                className="bg-zinc-50 text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">City *</label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Guwahati"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">State *</label>
              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Assam"
                required
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-700">Kitchen / Studio Physical Address *</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop number, building, street, landmark..."
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Standard Prep Time (minutes)</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={prepTimeMinutes}
                  onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                  placeholder="45"
                  className="font-mono"
                  required
                />
                <span className="text-xs text-zinc-500 shrink-0">mins</span>
              </div>
              <p className="text-[10px] text-zinc-400">
                Used to calculate realistic delivery slots and dispatch estimates for incoming orders.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Marketplace Commission</label>
              <div className="flex items-center gap-2">
                <Input
                  value={`${profile?.commissionRate || 15}%`}
                  disabled
                  className="bg-zinc-50 text-zinc-500 font-mono"
                />
              </div>
              <p className="text-[10px] text-zinc-400">Platform commission set by Super Admin operations.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Service Radius Pincodes */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-rose-600" />
              <h2 className="text-base font-bold text-zinc-900">
                Service Radius & Coverage ({pincodes.length} Pincodes)
              </h2>
            </div>
          </div>

          <p className="text-xs text-zinc-500">
            Customers entering any of these 6-digit delivery pincodes will see your cakes and bouquets available for same-day and midnight delivery.
          </p>

          {/* Add Pincode Input */}
          <div className="flex gap-2 max-w-sm">
            <Input
              value={newPincode}
              onChange={(e) => setNewPincode(e.target.value)}
              placeholder="Enter 6-digit pincode"
              maxLength={6}
            />
            <Button
              type="button"
              onClick={handleAddPincode}
              className="bg-rose-600 hover:bg-rose-700 text-white shrink-0 gap-1 text-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add Pincode</span>
            </Button>
          </div>

          {/* Pincodes Chips List */}
          <div className="flex flex-wrap gap-2 pt-2">
            {pincodes.length === 0 ? (
              <div className="text-xs text-zinc-400 italic">
                No delivery pincodes assigned yet. Add your primary kitchen pincode above.
              </div>
            ) : (
              pincodes.map((pin) => (
                <span
                  key={pin}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-mono font-semibold text-zinc-800"
                >
                  <span>{pin}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePincode(pin)}
                    className="text-zinc-400 hover:text-rose-600 transition"
                    title={`Remove pincode ${pin}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={saving}
            size="lg"
            className="bg-rose-600 hover:bg-rose-700 text-white gap-2 font-bold shadow-md"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? "Saving Changes..." : "Save Store Settings"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
