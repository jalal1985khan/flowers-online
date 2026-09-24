import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  User,
  Package,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const [orders, addresses] = await Promise.all([
    prisma.order.findMany({
      include: {
        deliverySlot: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.customerAddress.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Profile Header */}
      <div className="rounded-3xl border border-rose-200/80 bg-gradient-to-r from-rose-50 via-white to-amber-50/50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-600 text-white font-bold text-xl shadow-md">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-serif text-zinc-900">
                Aakash Sharma
              </h1>
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800">
                Celebration Member
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              aakash@example.com • +91 9876543210
            </p>
          </div>
        </div>

        <Link href="/catalog">
          <Button className="gap-2">
            <span>Send New Gift</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Orders History */}
        <div className="space-y-4 lg:col-span-8">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-rose-600" />
              <span>Past Celebrations & Orders ({orders.length})</span>
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-zinc-900">No past orders yet</p>
              <p className="text-xs text-zinc-500 mt-1">
                Your ordered flowers and cakes will appear here with live tracking.
              </p>
              <Link href="/catalog" className="inline-block mt-4">
                <Button size="sm">Browse Catalog</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-100 pb-3">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 font-mono">
                        #{o.orderNumber}
                      </span>
                      <span className="mx-2 text-zinc-300">•</span>
                      <span className="text-xs text-zinc-500">
                        Placed on {new Date(o.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>

                    <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 border border-rose-200">
                      {o.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
                    <div>
                      <div className="font-semibold text-zinc-800">
                        Recipient: {o.recipientName} ({o.deliveryCity} — {o.deliveryPincode})
                      </div>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                        <Clock className="h-3 w-3 text-rose-500" />
                        <span>Slot: {o.deliverySlot.title}</span>
                      </div>
                      <div className="text-xs text-zinc-600 mt-1">
                        {o.items.map((it) => `${it.quantity}x ${it.title}`).join(", ")}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                      <div className="text-base font-bold text-zinc-900 font-serif">
                        {formatINR(o.total)}
                      </div>
                      <Link href={`/order/${o.orderNumber}`}>
                        <Button size="sm" variant="outline" className="text-xs font-semibold">
                          Track Status →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Saved Delivery Addresses */}
        <div className="space-y-4 lg:col-span-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-600" />
              <span>Saved Addresses</span>
            </h2>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900">Sneha Patel</span>
                <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                  HOME
                </span>
              </div>
              <p className="text-zinc-600">
                Flat 402, Sunshine Heights, 12th Main, Indiranagar
              </p>
              <p className="text-zinc-500 font-mono">
                Bengaluru — 560038 • +91 9876543211
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900">Rahul Verma</span>
                <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
                  WORK
                </span>
              </div>
              <p className="text-zinc-600">
                Prestige Tech Park, Tower B, Outer Ring Road
              </p>
              <p className="text-zinc-500 font-mono">
                Bengaluru — 560068 • +91 9876543212
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
