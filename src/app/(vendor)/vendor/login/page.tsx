"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Lock, Mail, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillVendorDemo = () => {
    setEmail("vendor@petalsbloom.in");
    setPassword("Vendor@123");
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, requiredPortal: "VENDOR" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Vendor login failed");
      }

      router.push("/vendor");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to log in as vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md">
            <Store className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-zinc-900">
            Vendor Partner Portal
          </h1>
          <p className="text-xs text-zinc-500">
            Sign in to manage live orders, kitchen prep, rider dispatch, and weekly payouts.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {/* Demo Autofill */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-3 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-rose-900 block">Florist Partner Demo</span>
              <span className="text-[11px] text-zinc-500">vendor@petalsbloom.in / Vendor@123</span>
            </div>
            <button
              type="button"
              onClick={fillVendorDemo}
              className="rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-rose-700 transition"
            >
              Autofill
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-700">Vendor Business Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="orders@yourbakery.in"
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full font-bold shadow-md hover:bg-rose-700"
            >
              {loading ? "Authenticating..." : "Access Vendor Portal"}
            </Button>
          </form>

          <div className="pt-4 border-t border-zinc-100 flex justify-between text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-900 flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Customer Storefront</span>
            </Link>
            <Link href="/admin/login" className="hover:text-zinc-900">
              Admin Console →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
