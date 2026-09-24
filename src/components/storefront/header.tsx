"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocation } from "@/lib/location-context";
import { useCart } from "@/lib/cart-context";
import { PincodeModal } from "./pincode-modal";
import {
  MapPin,
  ShoppingBag,
  Search,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Store,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { location, setIsPincodeModalOpen } = useLocation();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-rose-100 bg-white/95 backdrop-blur-md">
        {/* Top notification bar */}
        <div className="bg-rose-950 px-4 py-1.5 text-center text-xs text-rose-100 font-medium tracking-wide">
          <span>✨ Order within 2 hrs for Guaranteed Midnight Delivery (11 PM - 12 AM)</span>
          <span className="mx-2 opacity-50">•</span>
          <span className="text-rose-300">Free Greeting Card with All Flower Bouquets</span>
        </div>

        {/* Main header row */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-md group-hover:scale-105 transition">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 font-serif">
                Bloom & Bakes
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-wider text-rose-600">
                Artisan Florist & Bakery
              </span>
            </div>
          </Link>

          {/* Delivery Location Chip */}
          <button
            onClick={() => setIsPincodeModalOpen(true)}
            className="hidden md:flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/50 px-3.5 py-1.5 text-xs text-zinc-800 hover:border-rose-400 hover:bg-rose-100/50 transition cursor-pointer"
          >
            <MapPin className="h-3.5 w-3.5 text-rose-600" />
            <div className="text-left leading-tight">
              <div className="text-[10px] uppercase font-bold text-rose-700">Deliver To</div>
              <div className="font-semibold text-zinc-900 flex items-center gap-1">
                <span>{location.city} ({location.pincode})</span>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </div>
            </div>
          </button>

          {/* Search bar */}
          <div className="hidden lg:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search roses, truffle cake, birthday combos..."
              className="w-full rounded-full border border-zinc-200 bg-zinc-50/70 pl-9 pr-4 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Vendor & Admin links for demo convenience */}
            <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-zinc-600">
              <Link
                href="/vendor"
                className="flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-zinc-100 text-zinc-700 transition"
              >
                <Store className="h-3.5 w-3.5 text-zinc-500" />
                <span>Vendor Portal</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-zinc-100 text-zinc-700 transition"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-zinc-500" />
                <span>Admin</span>
              </Link>
            </div>

            {/* Cart link */}
            <Link href="/cart">
              <Button
                variant="outline"
                className="relative rounded-full border-rose-200 bg-white hover:bg-rose-50 text-rose-900 gap-2 px-3.5"
              >
                <ShoppingBag className="h-4 w-4 text-rose-600" />
                <span className="hidden sm:inline text-xs font-semibold">Cart</span>
                {itemCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[11px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-600 hover:text-zinc-900"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Secondary Navigation row */}
        <nav className="hidden lg:block border-t border-rose-100/60 bg-white px-4 py-2">
          <div className="mx-auto flex max-w-7xl items-center justify-between text-xs font-medium text-zinc-700">
            <div className="flex items-center gap-6">
              <Link href="/catalog?category=flowers" className="hover:text-rose-600 transition">
                🌹 Fresh Flowers
              </Link>
              <Link href="/catalog?category=cakes" className="hover:text-rose-600 transition">
                🎂 Gourmet Cakes
              </Link>
              <Link href="/catalog?category=combos" className="hover:text-rose-600 transition">
                🎁 Combos & Hampers
              </Link>
              <Link href="/catalog?occasion=birthday" className="hover:text-rose-600 transition">
                🎉 Birthday Special
              </Link>
              <Link href="/catalog?occasion=anniversary" className="hover:text-rose-600 transition">
                💍 Anniversary
              </Link>
              <Link href="/catalog?occasion=love-and-romance" className="hover:text-rose-600 transition">
                ❤️ Romance & Midnight
              </Link>
            </div>
            <div className="flex items-center gap-4 text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Same-Day Delivery Active
              </span>
            </div>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white p-4 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsPincodeModalOpen(true);
              }}
              className="flex w-full items-center justify-between rounded-lg bg-rose-50 p-2.5 text-xs text-rose-900 font-semibold"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-600" />
                <span>Deliver To: {location.city} ({location.pincode})</span>
              </div>
              <span className="text-rose-600 underline">Change</span>
            </button>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <Link
                href="/catalog?category=flowers"
                className="rounded-lg border p-2 hover:bg-zinc-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                🌹 Fresh Flowers
              </Link>
              <Link
                href="/catalog?category=cakes"
                className="rounded-lg border p-2 hover:bg-zinc-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                🎂 Gourmet Cakes
              </Link>
              <Link
                href="/catalog?category=combos"
                className="rounded-lg border p-2 hover:bg-zinc-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                🎁 Combos
              </Link>
              <Link
                href="/catalog?occasion=birthday"
                className="rounded-lg border p-2 hover:bg-zinc-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                🎉 Birthday Special
              </Link>
            </div>
            <div className="pt-2 border-t flex justify-between text-xs text-zinc-600">
              <Link href="/vendor" onClick={() => setMobileMenuOpen(false)}>Vendor Portal</Link>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
            </div>
          </div>
        )}
      </header>
      <PincodeModal />
    </>
  );
}
