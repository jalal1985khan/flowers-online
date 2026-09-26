"use client";

import React, { useState, useMemo } from "react";
import { VendorOrderCard, type OrderData } from "./vendor-order-card";
import { formatINR } from "@/lib/utils";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  X,
  AlertCircle,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VendorOrdersManagerProps {
  initialOrders: OrderData[];
  vendorName?: string;
  vendorCity?: string;
  prepTimeMinutes?: number;
  netEarnings: number;
}

type TabType = "active" | "delivered" | "all";

export function VendorOrdersManager({
  initialOrders,
  vendorName,
  vendorCity,
  prepTimeMinutes = 45,
  netEarnings,
}: VendorOrdersManagerProps) {
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentlyMovedId, setRecentlyMovedId] = useState<string | null>(null);

  // Status counts computed from real-time state
  const placedCount = useMemo(
    () => orders.filter((o) => o.status === "PLACED").length,
    [orders]
  );
  const preparingCount = useMemo(
    () =>
      orders.filter((o) => o.status === "PREPARING" || o.status === "ACCEPTED").length,
    [orders]
  );
  const outCount = useMemo(
    () => orders.filter((o) => o.status === "OUT_FOR_DELIVERY").length,
    [orders]
  );
  const deliveredCount = useMemo(
    () => orders.filter((o) => o.status === "DELIVERED").length,
    [orders]
  );
  const activeCount = useMemo(
    () =>
      orders.filter(
        (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
      ).length,
    [orders]
  );

  const handleStatusChange = (orderId: string, nextStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );

    if (nextStatus === "DELIVERED" && activeTab === "active") {
      setRecentlyMovedId(orderId);
      setTimeout(() => {
        setRecentlyMovedId(null);
      }, 4000);
    }
  };

  const handleMetricCardClick = (targetStatus: string, preferredTab: TabType) => {
    if (statusFilter === targetStatus) {
      // Toggle off
      setStatusFilter(null);
    } else {
      setStatusFilter(targetStatus);
      setActiveTab(preferredTab);
    }
  };

  // Filter logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Tab level filter
      if (activeTab === "active") {
        if (order.status === "DELIVERED" || order.status === "CANCELLED") {
          return false;
        }
      } else if (activeTab === "delivered") {
        if (order.status !== "DELIVERED") {
          return false;
        }
      }

      // 2. Specific status pill / stat card filter
      if (statusFilter) {
        if (statusFilter === "PREPARING") {
          if (order.status !== "PREPARING" && order.status !== "ACCEPTED") {
            return false;
          }
        } else if (order.status !== statusFilter) {
          return false;
        }
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesOrderNumber = order.orderNumber.toLowerCase().includes(query);
        const matchesRecipient = order.recipientName.toLowerCase().includes(query);
        const matchesPhone = order.recipientPhone.includes(query);
        const matchesItem = order.items.some((it) =>
          it.title.toLowerCase().includes(query)
        );
        const matchesAddress =
          order.deliveryAddress.toLowerCase().includes(query) ||
          order.deliveryCity.toLowerCase().includes(query);

        if (
          !matchesOrderNumber &&
          !matchesRecipient &&
          !matchesPhone &&
          !matchesItem &&
          !matchesAddress
        ) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeTab, statusFilter, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Vendor Profile Header */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 font-bold text-lg">
            {vendorName ? vendorName.charAt(0) : "V"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-zinc-900 font-serif">
                {vendorName || "Artisan Florist & Bakery Operations"}
              </h2>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                Active Partner
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {vendorCity ? `${vendorCity} • ` : ""}Standard Prep Time: {prepTimeMinutes} mins • Commission: 15%
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-2 text-right">
            <div className="text-[11px] text-zinc-500">Net Estimated Payout</div>
            <div className="text-lg font-bold text-zinc-900 font-mono">
              {formatINR(netEarnings)}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row (Interactive Filters) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => handleMetricCardClick("PLACED", "active")}
          className={`rounded-2xl border p-4 text-left transition-all duration-200 hover:shadow-md cursor-pointer ${statusFilter === "PLACED"
            ? "border-amber-400 bg-amber-100/70 ring-2 ring-amber-400/50"
            : "border-amber-200 bg-amber-50/50 hover:bg-amber-50"
            }`}
        >
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold uppercase tracking-wider">New Placed</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-900 mt-2">
            {placedCount}
          </div>
          <p className="text-[11px] text-amber-700 mt-1">Requires immediate acceptance</p>
        </button>

        <button
          type="button"
          onClick={() => handleMetricCardClick("PREPARING", "active")}
          className={`rounded-2xl border p-4 text-left transition-all duration-200 hover:shadow-md cursor-pointer ${statusFilter === "PREPARING"
            ? "border-purple-400 bg-purple-100/70 ring-2 ring-purple-400/50"
            : "border-purple-200 bg-purple-50/50 hover:bg-purple-50"
            }`}
        >
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-xs font-bold uppercase tracking-wider">In Prep</span>
            <Package className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-900 mt-2">
            {preparingCount}
          </div>
          <p className="text-[11px] text-purple-700 mt-1">Flowers tying / cakes baking</p>
        </button>

        <button
          type="button"
          onClick={() => handleMetricCardClick("OUT_FOR_DELIVERY", "active")}
          className={`rounded-2xl border p-4 text-left transition-all duration-200 hover:shadow-md cursor-pointer ${statusFilter === "OUT_FOR_DELIVERY"
            ? "border-indigo-400 bg-indigo-100/70 ring-2 ring-indigo-400/50"
            : "border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50"
            }`}
        >
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-xs font-bold uppercase tracking-wider">Out with Rider</span>
            <Truck className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-900 mt-2">
            {outCount}
          </div>
          <p className="text-[11px] text-indigo-700 mt-1">On delivery transit</p>
        </button>

        <button
          type="button"
          onClick={() => handleMetricCardClick("DELIVERED", "delivered")}
          className={`rounded-2xl border p-4 text-left transition-all duration-200 hover:shadow-md cursor-pointer ${statusFilter === "DELIVERED"
            ? "border-emerald-400 bg-emerald-100/70 ring-2 ring-emerald-400/50"
            : "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50"
            }`}
        >
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-900 mt-2">
            {deliveredCount}
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">Successfully delivered</p>
        </button>
      </div>

      {/* Real-time notification banner when an order was just delivered */}
      {recentlyMovedId && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              Order completed and moved to the <strong>Delivered</strong> tab.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab("delivered");
              setStatusFilter(null);
            }}
            className="flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 ml-4"
          >
            View in Delivered <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Main Tabs & Search Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-200 pb-3">
          {/* Primary View Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100/90 rounded-2xl border border-zinc-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab("active");
                if (statusFilter === "DELIVERED") setStatusFilter(null);
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${activeTab === "active"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
                }`}
            >
              <span>⚡ Active Queue</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${activeTab === "active"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-zinc-200 text-zinc-600"
                  }`}
              >
                {activeCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("delivered");
                if (statusFilter && statusFilter !== "DELIVERED") {
                  setStatusFilter(null);
                }
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${activeTab === "delivered"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
                }`}
            >
              <span>✅ Delivered</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${activeTab === "delivered"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-zinc-200 text-zinc-600"
                  }`}
              >
                {deliveredCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${activeTab === "all"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
                }`}
            >
              <span>📋 All Orders</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${activeTab === "all"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-200 text-zinc-600"
                  }`}
              >
                {orders.length}
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search order #, customer, item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-8 text-xs rounded-xl border-zinc-200 bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills / Status bar */}
        {(statusFilter || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-500 font-medium">Active filters:</span>
            {statusFilter && (
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 text-white px-2.5 py-0.5 text-[11px] font-medium">
                Status: {statusFilter.replace("_", " ")}
                <button
                  type="button"
                  onClick={() => setStatusFilter(null)}
                  className="hover:text-zinc-300 ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 px-2.5 py-0.5 text-[11px] font-medium">
                Query: "{searchQuery}"
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="hover:text-zinc-600 ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setStatusFilter(null);
                setSearchQuery("");
              }}
              className="text-[11px] text-rose-600 hover:underline font-semibold ml-1"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Orders Listing */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center">
            {activeTab === "delivered" ? (
              <>
                <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-400" />
                <p className="mt-2 text-sm font-semibold text-zinc-900">
                  No delivered orders yet
                </p>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  Once orders in the Active Queue are dispatched and marked as
                  delivered, they will be archived here for record keeping.
                </p>
              </>
            ) : activeTab === "active" ? (
              <>
                <Package className="mx-auto h-9 w-9 text-zinc-400" />
                <p className="mt-2 text-sm font-semibold text-zinc-900">
                  Fulfillment queue is clear! 🎉
                </p>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  There are no active orders needing kitchen or florist action right now.
                  New customer orders will automatically appear here.
                </p>
              </>
            ) : (
              <>
                <Inbox className="mx-auto h-9 w-9 text-zinc-400" />
                <p className="mt-2 text-sm font-semibold text-zinc-900">
                  No matching orders found
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Try adjusting your search query or removing the status filter.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((o) => (
              <VendorOrderCard
                key={o.id}
                order={o}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
