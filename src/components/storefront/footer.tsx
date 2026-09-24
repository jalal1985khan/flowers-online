import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Clock, Award, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-rose-100 bg-rose-50/30 text-zinc-600">
      {/* Trust Badges */}
      <div className="border-b border-rose-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900">Guaranteed On-Time</h4>
                <p className="text-xs text-zinc-500">Same-day, 2-hr express & midnight deliveries</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900">100% Farm Fresh Blooms</h4>
                <p className="text-xs text-zinc-500">Hand-curated Dutch roses & oriental lilies</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900">Certified Artisan Bakeries</h4>
                <p className="text-xs text-zinc-500">Freshly baked upon order with pure ingredients</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900">Free Personalized Card</h4>
                <p className="text-xs text-zinc-500">Handwritten messages with every floral order</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-serif font-bold text-zinc-900 text-lg">Bloom & Bakes</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed mb-4">
              India's premier floral & gourmet bakery marketplace connecting artisan florists and pastry chefs to celebrate moments that matter.
            </p>
            <p className="text-[11px] text-zinc-400">
              © {new Date().getFullYear()} Bloom & Bakes Marketplace Ltd.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/catalog?category=flowers" className="hover:text-rose-600">Fresh Red Roses</Link></li>
              <li><Link href="/catalog?category=cakes" className="hover:text-rose-600">Belgian Chocolate Truffle</Link></li>
              <li><Link href="/catalog?category=cakes" className="hover:text-rose-600">Eggless Specialty Cakes</Link></li>
              <li><Link href="/catalog?category=combos" className="hover:text-rose-600">Flower + Cake Hampers</Link></li>
              <li><Link href="/catalog?category=gifts" className="hover:text-rose-600">Personalized Keepsakes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
              Delivery Cities
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/city/guwahati" className="text-rose-600 font-semibold hover:underline">Guwahati (Assam Hub)</Link></li>
              <li><Link href="/city/delhi" className="text-zinc-700 hover:text-rose-600">Delhi NCR (110001, 110016, 122001)</Link></li>
              <li><Link href="/city/mumbai" className="text-zinc-700 hover:text-rose-600">Mumbai (400001, 400050)</Link></li>
              <li><Link href="/city/bengaluru" className="text-zinc-700 hover:text-rose-600">Bengaluru (560001, 560038)</Link></li>
              <li><span className="text-zinc-500">Hyderabad & Pune (Active)</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
              Partners & Operations
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/vendor" className="text-rose-700 font-semibold hover:underline">Vendor Partner Portal</Link></li>
              <li><Link href="/admin" className="text-zinc-700 hover:text-zinc-900">Admin Control Center</Link></li>
              <li><a href="#" className="hover:text-rose-600">Fulfillment Quality Standards</a></li>
              <li><a href="#" className="hover:text-rose-600">Midnight Delivery FAQ</a></li>
              <li><a href="#" className="hover:text-rose-600">Privacy & Terms</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Popular Delivery Areas & Bottom Bar (Screenshot match) */}
      <div className="bg-[#0b0f19] text-zinc-300 border-t border-zinc-800/80">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-5">
          {/* Popular Delivery Areas Pills */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              Popular Delivery Areas
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { name: "Dispur", href: "/city/guwahati" },
                { name: "Ganeshguri", href: "/city/guwahati" },
                { name: "Zoo Road", href: "/city/guwahati" },
                { name: "Beltola", href: "/city/guwahati" },
                { name: "Six Mile", href: "/city/guwahati" },
                { name: "Khanapara", href: "/city/guwahati" },
                { name: "Maligaon", href: "/city/guwahati" },
                { name: "Chandmari", href: "/city/guwahati" },
              ].map((area) => (
                <Link
                  key={area.name}
                  href={area.href}
                  className="rounded-full border border-zinc-700/80 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-500 px-3.5 py-1 text-xs text-zinc-300 hover:text-white transition shadow-2xs"
                >
                  {area.name}
                </Link>
              ))}

              <Link
                href="/city/guwahati"
                className="rounded-full border border-rose-600/90 bg-rose-950/40 hover:bg-rose-600 text-rose-400 hover:text-white font-semibold px-4 py-1 text-xs transition flex items-center gap-1 shadow-2xs"
              >
                <span>All Areas</span>
                <span className="text-xs">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Sub-footer bottom row */}
          <div className="pt-4 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span>© {new Date().getFullYear()} Petalscart · Delivering Love Across Guwahati</span>
              <span>🌸</span>
            </div>

            {/* Payment Method Badges */}
            <div className="flex items-center gap-2">
              {["UPI", "Razorpay", "PhonePe", "Visa", "Mastercard"].map((method) => (
                <span
                  key={method}
                  className="rounded bg-zinc-800/80 border border-zinc-700/60 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-300 shadow-2xs"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
