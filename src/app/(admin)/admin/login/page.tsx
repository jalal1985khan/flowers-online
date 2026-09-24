"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Lock, Mail, ArrowLeft, Sparkles, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillAdminDemo = () => {
    setEmail("admin@bloomandbakes.com");
    setPassword("Admin@123");
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
        body: JSON.stringify({ email, password, requiredPortal: "ADMIN" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Super Admin authentication failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to log in as administrator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-white">
            Super Admin Governance Console
          </h1>
          <p className="text-xs text-zinc-400">
            Restricted access for marketplace operations, catalog governance, and AI Growth engine.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Demo Autofill */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white block">Super Admin Credentials</span>
              <span className="text-[11px] text-zinc-400">admin@bloomandbakes.com / Admin@123</span>
            </div>
            <button
              type="button"
              onClick={fillAdminDemo}
              className="rounded-lg bg-zinc-800 px-2.5 py-1 text-[11px] font-bold text-zinc-200 hover:bg-zinc-700 transition"
            >
              Autofill
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300">Admin Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bloomandbakes.com"
                  className="pl-9 text-xs bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300">Admin Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 text-xs bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-950/80 border border-red-800 p-3 text-xs text-red-300 font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/30"
            >
              {loading ? "Verifying Credentials..." : "Authenticate & Open Console"}
            </Button>
          </form>

          <div className="pt-4 border-t border-zinc-800 flex justify-between text-xs text-zinc-400">
            <Link href="/" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Storefront</span>
            </Link>
            <Link href="/vendor/login" className="hover:text-white">
              Vendor Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
