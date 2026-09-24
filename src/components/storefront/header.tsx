"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocation } from "@/lib/location-context";
import { useCart } from "@/lib/cart-context";
import { PincodeModal } from "./pincode-modal";
import { SearchBar } from "./search-bar";
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
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MegaMenu, MEGA_MENU_CATEGORIES } from "./mega-menu";

export function Header() {
  const { location, setIsPincodeModalOpen } = useLocation();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCat, setExpandedMobileCat] = useState<string | null>("flowers");
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    window.location.href = "/";
  };

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
          <div className="hidden lg:flex flex-1 max-w-md">
            <SearchBar />
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

            {/* Account / Auth link */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/50 p-1 pr-2.5 text-xs">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 font-semibold text-rose-900 hover:underline"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span>{currentUser.name.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="ml-1 p-1 text-zinc-400 hover:text-red-600 transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition"
              >
                <User className="h-3.5 w-3.5 text-zinc-500" />
                <span>Sign In</span>
              </Link>
            )}

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

        {/* Desktop Mega Menu Bar */}
        <nav className="hidden lg:block border-t border-rose-100/60 bg-white px-4">
          <MegaMenu />
        </nav>

        {/* Mobile slide-out / dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white max-h-[85vh] overflow-y-auto divide-y divide-zinc-100">
            {/* Mobile Pincode bar */}
            <div className="p-3 bg-rose-50/60">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsPincodeModalOpen(true);
                }}
                className="flex w-full items-center justify-between rounded-lg border border-rose-200 bg-white p-2.5 text-xs text-rose-950 font-semibold shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-rose-600" />
                  <span>Deliver To: {location.city} ({location.pincode})</span>
                </div>
                <span className="text-rose-600 text-xs font-bold underline">Change</span>
              </button>
            </div>

            {/* Mobile Search Input */}
            <div className="p-3">
              <SearchBar />
            </div>

            {/* Mega Menu Categories Accordion */}
            <div className="py-2">
              <div className="px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Shop by Department
              </div>
              <div className="divide-y divide-zinc-100">
                {MEGA_MENU_CATEGORIES.map((cat) => {
                  const isExpanded = expandedMobileCat === cat.id;
                  return (
                    <div key={cat.id} className="text-xs">
                      <button
                        onClick={() =>
                          setExpandedMobileCat(isExpanded ? null : cat.id)
                        }
                        className={`w-full flex items-center justify-between px-4 py-3 font-semibold transition ${
                          isExpanded
                            ? "bg-rose-50/60 text-rose-900"
                            : "text-zinc-800 hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{cat.label}</span>
                          {cat.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase">
                              {cat.badge}
                            </span>
                          )}
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-zinc-400 transition-transform ${
                            isExpanded ? "rotate-180 text-rose-600" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="bg-zinc-50/80 px-4 py-3 space-y-4">
                          <Link
                            href={cat.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:underline"
                          >
                            <span>Explore All {cat.label}</span>
                            <span>&rarr;</span>
                          </Link>

                          <div className="grid grid-cols-2 gap-4">
                            {cat.columns.map((col, colIdx) => (
                              <div key={colIdx} className="space-y-1.5">
                                <div className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
                                  {col.title}
                                </div>
                                <ul className="space-y-1">
                                  {col.links.slice(0, 4).map((link, lIdx) => (
                                    <li key={lIdx}>
                                      <Link
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-zinc-700 hover:text-rose-600 block py-0.5 text-xs"
                                      >
                                        {link.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Portals & Authentication in Mobile */}
            <div className="p-4 space-y-2 bg-zinc-50/50 text-xs">
              {currentUser ? (
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 font-semibold text-zinc-900"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span>{currentUser.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-600 font-semibold hover:underline"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 py-2.5 font-bold text-white shadow-xs"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In or Register</span>
                </Link>
              )}

              <div className="flex justify-between pt-2 text-zinc-600 font-medium">
                <Link
                  href="/vendor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1 hover:text-rose-600"
                >
                  <Store className="h-3.5 w-3.5" />
                  <span>Vendor Portal</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1 hover:text-rose-600"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Admin Console</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      <PincodeModal />
    </>
  );
}
