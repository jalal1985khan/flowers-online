"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Lock, Mail, User, Phone, CheckCircle2, ArrowRight } from "lucide-react";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillCustomerDemo = () => {
    setEmail("customer@example.com");
    setPassword("Customer@123");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        tab === "login"
          ? { email, password, requiredPortal: "CUSTOMER" }
          : { name, email, phone, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push(data.redirectUrl || "/account");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-zinc-900">
            Welcome to Bloom & Bakes
          </h1>
          <p className="text-xs text-zinc-500">
            Sign in to track orders, manage saved addresses, and receive special occasion reminders.
          </p>
        </div>

        {/* Card Box */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {/* Quick Demo Pill */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-3 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-rose-900 block">Test Customer Account</span>
              <span className="text-[11px] text-zinc-500">customer@example.com / Customer@123</span>
            </div>
            <button
              type="button"
              onClick={fillCustomerDemo}
              className="rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-rose-700 transition"
            >
              Autofill
            </button>
          </div>

          {/* Switch Tabs */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-zinc-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setTab("login");
                setError(null);
              }}
              className={`py-2 rounded-lg transition ${
                tab === "login" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("signup");
                setError(null);
              }}
              className={`py-2 rounded-lg transition ${
                tab === "signup" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "signup" && (
              <>
                <div>
                  <label className="text-xs font-semibold text-zinc-700">Full Name</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <Input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aakash Sharma"
                      className="pl-9 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700">Mobile Phone</label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <Input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="pl-9 text-xs"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-zinc-700">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-zinc-700">Password</label>
                {tab === "login" && (
                  <a href="#" className="text-[11px] text-rose-600 hover:underline">
                    Forgot password?
                  </a>
                )}
              </div>
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
              className="w-full font-bold shadow-md hover:shadow-lg"
            >
              {loading ? "Verifying..." : tab === "login" ? "Sign In" : "Register Account"}
            </Button>
          </form>

          {/* Alternate logins */}
          <div className="pt-4 border-t border-zinc-100 flex justify-between text-xs text-zinc-500">
            <Link href="/vendor/login" className="hover:text-rose-600">
              Vendor Portal Sign In →
            </Link>
            <Link href="/admin/login" className="hover:text-zinc-900">
              Super Admin →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
