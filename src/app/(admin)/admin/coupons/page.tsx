"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Ticket,
  ArrowLeft,
  Plus,
  RefreshCw,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Check,
  Copy,
  Percent,
  DollarSign,
  Calendar,
  Layers,
  X,
  Save,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatINR } from "@/lib/utils";

interface CouponItem {
  id: string;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  timesUsed: number;
  isActive: boolean;
  validUntil: string | null;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "PERCENTAGE" | "FLAT">("all");

  // Notifications
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formCode, setFormCode] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDiscountType, setFormDiscountType] = useState<"PERCENTAGE" | "FLAT">("PERCENTAGE");
  const [formDiscountValue, setFormDiscountValue] = useState<number>(15);
  const [formMinOrderValue, setFormMinOrderValue] = useState<number>(499);
  const [formMaxDiscount, setFormMaxDiscount] = useState<string>("");
  const [formUsageLimit, setFormUsageLimit] = useState<string>("");
  const [formIsUnlimited, setFormIsUnlimited] = useState(true);
  const [formValidUntil, setFormValidUntil] = useState<string>("");
  const [formIsActive, setFormIsActive] = useState(true);

  // Fetch Coupons
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      if (!res.ok) throw new Error("Failed to load coupons");
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: "Failed to load coupons. Please check server logs.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // Auto-dismiss notification after 4s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Copy code helper
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Toggle Active / Disabled
  const handleToggleStatus = async (coupon: CouponItem) => {
    const nextStatus = !coupon.isActive;
    setUpdatingId(coupon.id);

    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, isActive: nextStatus } : c))
      );

      setNotification({
        type: "success",
        message: `Coupon "${coupon.code}" is now ${nextStatus ? "Active & Redeemable" : "Disabled"}.`,
      });
    } catch {
      setNotification({
        type: "error",
        message: "Failed to update coupon status.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Open Edit Modal
  const openEditModal = (coupon: CouponItem) => {
    setIsEditing(true);
    setEditingId(coupon.id);
    setFormCode(coupon.code);
    setFormDescription(coupon.description || "");
    setFormDiscountType(coupon.discountType);
    setFormDiscountValue(coupon.discountValue);
    setFormMinOrderValue(coupon.minOrderValue || 0);
    setFormMaxDiscount(coupon.maxDiscount != null ? coupon.maxDiscount.toString() : "");
    if (coupon.usageLimit != null) {
      setFormUsageLimit(coupon.usageLimit.toString());
      setFormIsUnlimited(false);
    } else {
      setFormUsageLimit("");
      setFormIsUnlimited(true);
    }
    setFormValidUntil(
      coupon.validUntil ? new Date(coupon.validUntil).toISOString().split("T")[0] : ""
    );
    setFormIsActive(coupon.isActive);
    setIsModalOpen(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormCode("");
    setFormDescription("");
    setFormDiscountType("PERCENTAGE");
    setFormDiscountValue(15);
    setFormMinOrderValue(499);
    setFormMaxDiscount("");
    setFormUsageLimit("");
    setFormIsUnlimited(true);
    setFormValidUntil("");
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  // Delete Coupon
  const handleDeleteCoupon = async (coupon: CouponItem) => {
    if (!confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete coupon");

      setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
      setNotification({
        type: "success",
        message: `Coupon "${coupon.code}" deleted successfully.`,
      });
    } catch {
      setNotification({
        type: "error",
        message: "Failed to delete coupon.",
      });
    }
  };

  // Save Coupon (Create or Update)
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formDescription.trim() || formDiscountValue == null) {
      setNotification({
        type: "error",
        message: "Code, description, and discount value are required.",
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code: formCode.toUpperCase().trim(),
        description: formDescription.trim(),
        discountType: formDiscountType,
        discountValue: Number(formDiscountValue),
        minOrderValue: Number(formMinOrderValue || 0),
        maxDiscount: formMaxDiscount ? Number(formMaxDiscount) : null,
        usageLimit: formIsUnlimited || !formUsageLimit ? null : Number(formUsageLimit),
        validUntil: formValidUntil ? new Date(formValidUntil).toISOString() : null,
        isActive: formIsActive,
      };

      const url = isEditing
        ? `/api/admin/coupons/${editingId}`
        : "/api/admin/coupons";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save coupon");

      setNotification({
        type: "success",
        message: isEditing
          ? `Coupon "${formCode.toUpperCase()}" updated successfully!`
          : `New coupon "${formCode.toUpperCase()}" created successfully!`,
      });

      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to save coupon.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Filtered List
  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      search === "" ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && c.isActive) ||
      (statusFilter === "disabled" && !c.isActive);

    const matchesType =
      typeFilter === "all" || c.discountType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Stats
  const totalCoupons = coupons.length;
  const activeCount = coupons.filter((c) => c.isActive).length;
  const disabledCount = totalCoupons - activeCount;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.timesUsed || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-semibold shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 ${
            notification.type === "success"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
          <div className="flex items-center gap-2.5 mt-1">
            <h1 className="text-2xl font-bold font-serif text-foreground tracking-tight">
              Promotional Coupons & Vouchers
            </h1>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">
              {totalCoupons} Configured
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage customer discount offers, set total redemption limits, edit discount rules, and activate or disable promo codes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCoupons}
            disabled={loading}
            className="border-border bg-card text-foreground hover:bg-muted gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={openCreateModal}
            className="bg-rose-600 hover:bg-rose-500 text-white gap-1.5 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Create Coupon</span>
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Coupons</span>
            <Ticket className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground font-mono">{totalCoupons}</span>
            <span className="text-[10px] text-muted-foreground">codes</span>
          </div>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Codes</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">{activeCount}</span>
            <span className="text-[10px] text-emerald-600/70 dark:text-emerald-500/70">redeemable live</span>
          </div>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Disabled Codes</span>
            <XCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">{disabledCount}</span>
            <span className="text-[10px] text-amber-600/70 dark:text-amber-500/70">paused</span>
          </div>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Redemptions</span>
            <Layers className="h-4 w-4 text-purple-500 dark:text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono">{totalRedemptions}</span>
            <span className="text-[10px] text-purple-600/70 dark:text-purple-500/70">orders claimed</span>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {/* Search Input */}
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search coupon code or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          {/* Status Filter */}
          <div>
            <Select
              value={statusFilter}
              onValueChange={(val: any) => setStatusFilter(val)}
            >
              <SelectTrigger className="w-full h-9 text-xs">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status: All</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="disabled">Disabled Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discount Type Filter */}
          <div>
            <Select
              value={typeFilter}
              onValueChange={(val: any) => setTypeFilter(val)}
            >
              <SelectTrigger className="w-full h-9 text-xs">
                <SelectValue placeholder="Type: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Type: All</SelectItem>
                <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                <SelectItem value="FLAT">Flat Discount (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <SlidersHorizontal className="h-3 w-3" /> Quick Filter:
          </span>
          <button
            onClick={() => setStatusFilter(statusFilter === "active" ? "all" : "active")}
            className={`px-2 py-0.5 rounded-full border transition cursor-pointer ${
              statusFilter === "active"
                ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-semibold"
                : "bg-muted text-muted-foreground border-border hover:text-foreground hover:bg-muted/80"
            }`}
          >
            🟢 Active Only ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === "disabled" ? "all" : "disabled")}
            className={`px-2 py-0.5 rounded-full border transition cursor-pointer ${
              statusFilter === "disabled"
                ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 font-semibold"
                : "bg-muted text-muted-foreground border-border hover:text-foreground hover:bg-muted/80"
            }`}
          >
            ⏸️ Disabled Only ({disabledCount})
          </button>

          {(search || statusFilter !== "all" || typeFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              className="text-rose-600 dark:text-rose-400 hover:underline font-medium ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </Card>

      {/* Main Coupons Table */}
      <Card className="overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider p-4 w-[180px]">
                  Promo Code
                </TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider p-4">
                  Discount Offer
                </TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider p-4">
                  Usage Limits
                </TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider p-4">
                  Status
                </TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider p-4 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-rose-500 mb-2" />
                    <span>Loading promotional coupons...</span>
                  </TableCell>
                </TableRow>
              ) : filteredCoupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                    <Ticket className="h-10 w-10 mx-auto text-muted-foreground/60 mb-3" />
                    <p className="font-semibold text-foreground">No coupons found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {search ? "No coupons match your search query." : "Click 'Create Coupon' above to add your first promotion."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCoupons.map((c) => {
                  const isLimitReached = c.usageLimit != null && c.timesUsed >= c.usageLimit;
                  const isExpired = c.validUntil && new Date(c.validUntil) < new Date();

                  return (
                    <TableRow key={c.id} className="border-border hover:bg-muted/40 transition-colors">
                      {/* Promo Code */}
                      <TableCell className="p-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-mono font-bold text-blue-600 dark:text-blue-300 tracking-wider">
                            {c.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(c.code)}
                            className="text-muted-foreground hover:text-foreground p-1 rounded transition"
                            title="Copy promo code"
                          >
                            {copiedCode === c.code ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </TableCell>

                      {/* Discount Offer */}
                      <TableCell className="p-4">
                        <div className="font-bold text-foreground text-xs">
                          {c.description || "Promotional Discount"}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span className="text-rose-600 dark:text-rose-400 font-semibold">
                            {c.discountType === "PERCENTAGE" ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                          </span>
                          <span>·</span>
                          <span>min order ₹{c.minOrderValue}</span>
                          {c.maxDiscount != null && (
                            <>
                              <span>·</span>
                              <span className="text-muted-foreground">max cap ₹{c.maxDiscount}</span>
                            </>
                          )}
                          {c.validUntil && (
                            <>
                              <span>·</span>
                              <span className={isExpired ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}>
                                {isExpired ? "Expired" : `Valid till ${new Date(c.validUntil).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}`}
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>

                      {/* Usage Limits */}
                      <TableCell className="p-4 font-mono text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="font-bold text-foreground">{c.timesUsed}</span>
                            <span className="text-muted-foreground">
                              {c.usageLimit != null ? `/ ${c.usageLimit} limit` : "redeemed (Unlimited)"}
                            </span>
                          </div>

                          {c.usageLimit != null && (
                            <div className="w-28 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isLimitReached ? "bg-amber-500" : "bg-blue-500"
                                }`}
                                style={{
                                  width: `${Math.min(100, Math.round((c.timesUsed / c.usageLimit) * 100))}%`,
                                }}
                              />
                            </div>
                          )}

                          {isLimitReached && (
                            <span className="inline-block text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1 rounded border border-amber-500/20">
                              Limit Exhausted
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Status: 1-Click Interactive Toggle */}
                      <TableCell className="p-4">
                        <button
                          onClick={() => handleToggleStatus(c)}
                          disabled={updatingId === c.id}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                            c.isActive
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-muted text-muted-foreground border border-border hover:bg-muted/80 hover:text-foreground"
                          }`}
                          title={`Click to ${c.isActive ? "Disable" : "Activate"} Coupon`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              c.isActive ? "bg-emerald-500 dark:bg-emerald-400 animate-pulse" : "bg-muted-foreground"
                            }`}
                          />
                          <span>
                            {updatingId === c.id
                              ? "Updating..."
                              : c.isActive
                              ? "Active"
                              : "Disabled"}
                          </span>
                        </button>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(c)}
                            className="h-7 w-7 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/30"
                            title="Edit Coupon & Limits"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCoupon(c)}
                            className="h-7 w-7 text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30"
                            title="Delete Coupon"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* COMPREHENSIVE CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-2xl animate-in fade-in zoom-in-95 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-serif">
                <Ticket className="h-5 w-5 text-rose-500" />
                <span>{isEditing ? "Edit Coupon" : "Create New Coupon"}</span>
                {isEditing && (
                  <span className="text-xs font-mono font-normal text-blue-500 dark:text-blue-400">
                    ({formCode})
                  </span>
                )}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleSaveCoupon} className="flex-1 overflow-y-auto pr-1 py-4 space-y-4 text-xs">
              {/* Promo Code & Description */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                  1. Code & Description
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-foreground font-semibold">Promo Code *</label>
                    <Input
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value.toUpperCase().replace(/\s+/g, ""))}
                      placeholder="e.g. FIRSTBLOOM"
                      className="font-mono font-bold tracking-wider"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-foreground font-semibold">Discount Type</label>
                    <div className="grid grid-cols-2 gap-1.5 h-9 p-1 rounded-lg border border-border bg-muted">
                      <button
                        type="button"
                        onClick={() => setFormDiscountType("PERCENTAGE")}
                        className={`rounded text-xs font-semibold transition ${
                          formDiscountType === "PERCENTAGE"
                            ? "bg-rose-600 text-white shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        % Percentage
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormDiscountType("FLAT")}
                        className={`rounded text-xs font-semibold transition ${
                          formDiscountType === "FLAT"
                            ? "bg-rose-600 text-white shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        ₹ Flat
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-foreground font-semibold">Offer Description *</label>
                  <Input
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="e.g. 15% off your first celebration order"
                    required
                  />
                </div>
              </div>

              {/* Discount Value & Constraints */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                  2. Discount Value & Cart Thresholds
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-foreground font-semibold">
                      {formDiscountType === "PERCENTAGE" ? "Discount (%) *" : "Discount (₹) *"}
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formDiscountValue}
                      onChange={(e) => setFormDiscountValue(Number(e.target.value))}
                      className="font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-foreground font-semibold">Min Order Value (₹)</label>
                    <Input
                      type="number"
                      step="1"
                      value={formMinOrderValue}
                      onChange={(e) => setFormMinOrderValue(Number(e.target.value))}
                      placeholder="e.g. 499"
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-foreground font-semibold">Max Discount Cap (₹)</label>
                    <Input
                      type="number"
                      step="1"
                      value={formMaxDiscount}
                      onChange={(e) => setFormMaxDiscount(e.target.value)}
                      placeholder={formDiscountType === "PERCENTAGE" ? "e.g. 200" : "N/A"}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Usage & Redemption Limits */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                    3. Redemption & Usage Limits
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-muted-foreground hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={formIsUnlimited}
                      onChange={(e) => {
                        setFormIsUnlimited(e.target.checked);
                        if (e.target.checked) setFormUsageLimit("");
                      }}
                      className="rounded border-border text-rose-600 focus:ring-0"
                    />
                    <span>Unlimited Uses</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-foreground font-semibold">
                      Max Total Redemptions
                    </label>
                    <Input
                      type="number"
                      disabled={formIsUnlimited}
                      value={formUsageLimit}
                      onChange={(e) => setFormUsageLimit(e.target.value)}
                      placeholder={formIsUnlimited ? "Unlimited redemptions allowed" : "e.g. 100"}
                      className={`font-mono ${
                        formIsUnlimited ? "opacity-40 cursor-not-allowed" : ""
                      }`}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      {formIsUnlimited
                        ? "Any customer can redeem this code without platform cap."
                        : `Promo code will auto-expire after ${formUsageLimit || 0} total successful orders.`}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-foreground font-semibold">Expiry Date (Optional)</label>
                    <Input
                      type="date"
                      value={formValidUntil}
                      onChange={(e) => setFormValidUntil(e.target.value)}
                      className="text-xs"
                    />
                    <p className="text-[10px] text-muted-foreground">Leave blank for no expiration date.</p>
                  </div>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                  4. Activation Status
                </div>

                <label className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/40 cursor-pointer hover:bg-muted/70 transition">
                  <div>
                    <div className="font-semibold text-foreground">Coupon Active</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {formIsActive
                        ? "Customers can apply this coupon at checkout right now."
                        : "Coupon is disabled and cannot be redeemed by customers."}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-rose-600 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-border bg-card text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-rose-600 hover:bg-rose-500 text-white gap-1.5 shadow-xs"
                >
                  {saving ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  <span>{isEditing ? "Save Changes" : "Create Coupon"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
