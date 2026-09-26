"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Gift,
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
  Layers,
  X,
  Save,
  SlidersHorizontal,
  ExternalLink,
  Sparkles,
  DollarSign,
  Tag,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Store,
  Clock,
  ShieldAlert,
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatINR } from "@/lib/utils";
import { MediaImagePicker } from "@/components/ui/media-image-picker";

interface AddonItem {
  id: string;
  vendorId?: string | null;
  vendor?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  } | null;
  title: string;
  category: string;
  price: number;
  image: string;
  isAvailable: boolean;
  isApproved: boolean;
  createdAt?: string;
}

const PRESET_CATEGORIES = [
  "Chocolates",
  "Soft Toys",
  "Candles",
  "Cards",
  "Celebration",
  "Flowers",
];

const PRESET_IMAGES = [
  { label: "Ferrero Rocher 200 GM", path: "/200gm-chocolate.jpg" },
  { label: "Ferrero Rocher 16 Pcs", path: "/16-peaces-chocolate.jpeg" },
  { label: "Cuddly Teddy Bear", path: "/teddy.webp" },
  { label: "Chocolate Category Fallback", path: "/images/categories/chocolates-sweets.jpg" },
  { label: "Soft Toy Fallback", path: "/images/white-teddy-6-inch.jpg" },
];

export default function AdminAddonsPage() {
  const [addons, setAddons] = useState<AddonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState<"ALL" | "AVAILABLE" | "UNAVAILABLE">("ALL");
  const [approvalFilter, setApprovalFilter] = useState<"ALL" | "PENDING" | "APPROVED">("ALL");
  const [originFilter, setOriginFilter] = useState<"ALL" | "VENDOR" | "GLOBAL">("ALL");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddonItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Chocolates");
  const [formCustomCategory, setFormCustomCategory] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formIsApproved, setFormIsApproved] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<AddonItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success message toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchAddons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/addons");
      if (!res.ok) throw new Error("Failed to fetch addons");
      const data = await res.json();
      setAddons(data.addons || []);
    } catch (err) {
      console.error(err);
      showToast("Error loading celebration add-ons");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddons();
  }, [fetchAddons]);

  const openAddModal = () => {
    setEditingAddon(null);
    setFormTitle("");
    setFormCategory("Chocolates");
    setFormCustomCategory("");
    setFormPrice("");
    setFormImage("");
    setFormIsAvailable(true);
    setFormIsApproved(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (addon: AddonItem) => {
    setEditingAddon(addon);
    setFormTitle(addon.title);
    if (PRESET_CATEGORIES.includes(addon.category)) {
      setFormCategory(addon.category);
      setFormCustomCategory("");
    } else {
      setFormCategory("OTHER");
      setFormCustomCategory(addon.category);
    }
    setFormPrice(String(addon.price));
    setFormImage(addon.image);
    setFormIsAvailable(addon.isAvailable);
    setFormIsApproved(addon.isApproved !== false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveAddon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const title = formTitle.trim();
    if (!title) {
      setFormError("Add-on title is required");
      return;
    }

    const category = formCategory === "OTHER" ? formCustomCategory.trim() : formCategory.trim();
    if (!category) {
      setFormError("Category is required");
      return;
    }

    const price = Number(formPrice);
    if (isNaN(price) || price < 0) {
      setFormError("Price must be a valid positive number");
      return;
    }

    const image = formImage.trim();
    if (!image) {
      setFormError("Image path or URL is required");
      return;
    }

    setFormSubmitting(true);
    try {
      if (editingAddon) {
        // Update existing
        const res = await fetch(`/api/admin/addons/${editingAddon.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            category,
            price,
            image,
            isAvailable: formIsAvailable,
            isApproved: formIsApproved,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update add-on");

        setAddons((prev) =>
          prev.map((a) => (a.id === editingAddon.id ? data.addon : a))
        );
        showToast(`Add-on "${title}" updated successfully!`);
      } else {
        // Create new
        const res = await fetch("/api/admin/addons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            category,
            price,
            image,
            isAvailable: formIsAvailable,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create add-on");

        setAddons((prev) => [...prev, data.addon]);
        showToast(`New add-on "${title}" created successfully!`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Failed to save add-on");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleApproval = async (addon: AddonItem, approveState: boolean) => {
    setUpdatingId(addon.id);
    try {
      const res = await fetch(`/api/admin/addons/${addon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: approveState }),
      });
      if (!res.ok) throw new Error("Failed to update approval status");
      const data = await res.json();

      setAddons((prev) =>
        prev.map((a) => (a.id === addon.id ? (data.addon || { ...a, isApproved: approveState }) : a))
      );
      showToast(
        approveState
          ? `Approved "${addon.title}" (₹${addon.price}). Now live for customers!`
          : `Revoked approval for "${addon.title}". Item hidden from storefront.`
      );
    } catch (err) {
      console.error(err);
      showToast("Failed to update approval status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleAvailability = async (addon: AddonItem) => {
    setUpdatingId(addon.id);
    const nextState = !addon.isAvailable;
    try {
      const res = await fetch(`/api/admin/addons/${addon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: nextState }),
      });
      if (!res.ok) throw new Error("Failed to update availability");

      setAddons((prev) =>
        prev.map((a) => (a.id === addon.id ? { ...a, isAvailable: nextState } : a))
      );
      showToast(
        `"${addon.title}" marked as ${nextState ? "Available (In Stock)" : "Unavailable (Hidden from checkout)"}`
      );
    } catch (err) {
      console.error(err);
      showToast("Failed to toggle availability");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/addons/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete add-on");

      setAddons((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      showToast(`Add-on "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      showToast("Failed to delete add-on");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered addons list
  const filteredAddons = addons.filter((addon) => {
    if (selectedCategory !== "ALL" && addon.category !== selectedCategory) {
      return false;
    }
    if (availabilityFilter === "AVAILABLE" && !addon.isAvailable) return false;
    if (availabilityFilter === "UNAVAILABLE" && addon.isAvailable) return false;
    if (approvalFilter === "PENDING" && addon.isApproved) return false;
    if (approvalFilter === "APPROVED" && !addon.isApproved) return false;
    if (originFilter === "VENDOR" && !addon.vendorId) return false;
    if (originFilter === "GLOBAL" && addon.vendorId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const vName = addon.vendor?.name?.toLowerCase() || "";
      return (
        addon.title.toLowerCase().includes(q) ||
        addon.category.toLowerCase().includes(q) ||
        vName.includes(q)
      );
    }
    return true;
  });

  // Unique categories count & metrics
  const allCategories = Array.from(new Set(addons.map((a) => a.category)));
  const availableCount = addons.filter((a) => a.isAvailable && a.isApproved).length;
  const pendingCount = addons.filter((a) => !a.isApproved).length;
  const vendorAddedCount = addons.filter((a) => !!a.vendorId).length;

  return (
    <div className="space-y-6 text-foreground">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-3 text-sm text-foreground shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/admin" className="hover:text-foreground">
              Admin
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Add-ons Catalog</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Gift className="size-6 text-rose-500" />
            Celebration Add-ons & Upsells
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Review vendor-submitted add-ons, approve items & prices, manage platform global upsells, and control active/inactive visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAddons}
            disabled={loading}
            className="border-border bg-card text-card-foreground hover:bg-muted text-xs h-9"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={openAddModal}
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold h-9 shadow-xs"
          >
            <Plus className="size-4 mr-1.5" />
            Add Global Add-on
          </Button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card
          onClick={() => { setApprovalFilter("ALL"); setOriginFilter("ALL"); setAvailabilityFilter("ALL"); }}
          className="p-4 hover:border-border/80 transition-colors cursor-pointer"
        >
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Add-ons</p>
          <p className="mt-1 text-2xl font-bold text-foreground font-mono">{addons.length}</p>
        </Card>

        <Card
          onClick={() => setApprovalFilter("PENDING")}
          className={`p-4 transition-colors cursor-pointer border-amber-500/40 ${approvalFilter === "PENDING" ? "ring-2 ring-amber-500 bg-amber-500/5" : "hover:border-amber-500/60"
            }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pending Review</p>
            {pendingCount > 0 && (
              <span className="size-2 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </div>
          <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">{pendingCount}</p>
        </Card>

        <Card
          onClick={() => { setApprovalFilter("APPROVED"); setAvailabilityFilter("AVAILABLE"); }}
          className="p-4 hover:border-emerald-500/40 transition-colors cursor-pointer"
        >
          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Live on Storefront</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">{availableCount}</p>
        </Card>

        <Card
          onClick={() => setOriginFilter("VENDOR")}
          className={`p-4 transition-colors cursor-pointer ${originFilter === "VENDOR" ? "ring-2 ring-rose-500 bg-rose-500/5" : "hover:border-rose-500/40"
            }`}
        >
          <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wider">Vendor Added</p>
          <p className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono">{vendorAddedCount}</p>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, category, or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Origin Filter */}
            <Select value={originFilter} onValueChange={(val: any) => setOriginFilter(val)}>
              <SelectTrigger className="w-[140px] h-9 text-xs">
                <SelectValue placeholder="All Origins" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Origins</SelectItem>
                <SelectItem value="VENDOR">Vendor Items ({vendorAddedCount})</SelectItem>
                <SelectItem value="GLOBAL">Global Platform ({addons.length - vendorAddedCount})</SelectItem>
              </SelectContent>
            </Select>

            {/* Approval Filter */}
            <Select value={approvalFilter} onValueChange={(val: any) => setApprovalFilter(val)}>
              <SelectTrigger className="w-[150px] h-9 text-xs">
                <SelectValue placeholder="Approval Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Approvals</SelectItem>
                <SelectItem value="PENDING">Pending Review ({pendingCount})</SelectItem>
                <SelectItem value="APPROVED">Approved ({addons.length - pendingCount})</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px] h-9 text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories ({addons.length})</SelectItem>
                {allCategories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c} ({addons.filter((a) => a.category === c).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Availability Filter */}
            <Select
              value={availabilityFilter}
              onValueChange={(val: any) => setAvailabilityFilter(val)}
            >
              <SelectTrigger className="w-[130px] h-9 text-xs">
                <SelectValue placeholder="Active Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Active</SelectItem>
                <SelectItem value="AVAILABLE">Active (Live)</SelectItem>
                <SelectItem value="UNAVAILABLE">Inactive (Hidden)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Add-ons Data Table */}
      <Card className="overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <RefreshCw className="size-6 animate-spin text-rose-500" />
            <p className="mt-3 text-xs text-muted-foreground">Loading celebration add-ons...</p>
          </div>
        ) : filteredAddons.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Gift className="size-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-semibold text-foreground">No add-ons match your criteria</p>
            <p className="mt-1 text-xs text-muted-foreground">Try adjusting your search query, approval status, or category filters.</p>
            {addons.length === 0 && (
              <Button onClick={openAddModal} size="sm" className="mt-4 bg-rose-600 hover:bg-rose-500 text-xs">
                <Plus className="size-3.5 mr-1" /> Create Your First Add-on
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-16 text-muted-foreground text-xs">Image</TableHead>
                <TableHead className="text-muted-foreground text-xs">Title & Origin</TableHead>
                <TableHead className="text-muted-foreground text-xs">Category</TableHead>
                <TableHead className="text-muted-foreground text-xs">Price</TableHead>
                <TableHead className="text-muted-foreground text-xs">Approval & Review</TableHead>
                <TableHead className="text-muted-foreground text-xs">Active Status</TableHead>
                <TableHead className="text-right text-muted-foreground text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAddons.map((addon) => {
                const isUpdating = updatingId === addon.id;
                return (
                  <TableRow
                    key={addon.id}
                    className={`border-border hover:bg-muted/40 transition-colors ${!addon.isApproved ? "bg-amber-500/5 dark:bg-amber-950/20" : ""
                      }`}
                  >
                    {/* Thumbnail */}
                    <TableCell className="py-3">
                      <div className="relative size-12 overflow-hidden rounded-lg border border-border bg-muted shrink-0">
                        <img
                          src={addon.image}
                          alt={addon.title}
                          className="size-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "/images/categories/chocolates-sweets.jpg";
                          }}
                        />
                      </div>
                    </TableCell>

                    {/* Title & Origin */}
                    <TableCell className="py-3">
                      <div className="min-w-0 pr-2 space-y-1">
                        <p className="font-semibold text-foreground text-xs">{addon.title}</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {addon.vendor ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded-full">
                              <Store className="size-2.5" />
                              Vendor: {addon.vendor.name}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded-full">
                              Global Platform
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px]">
                            {addon.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className="border-border text-muted-foreground text-[10px] font-medium"
                      >
                        {addon.category}
                      </Badge>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="py-3 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">
                      {formatINR(addon.price)}
                    </TableCell>

                    {/* Approval & Review Status */}
                    <TableCell className="py-3">
                      {!addon.isApproved ? (
                        <div className="space-y-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                            <Clock className="size-2.5" />
                            Pending Review
                          </span>
                          <div>
                            <Button
                              size="sm"
                              onClick={() => handleToggleApproval(addon, true)}
                              disabled={isUpdating}
                              className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                            >
                              <CheckCircle2 className="size-3 mr-1" />
                              Approve Price & Item
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="size-2.5" />
                            Approved
                          </span>
                          {addon.vendorId && (
                            <button
                              type="button"
                              onClick={() => handleToggleApproval(addon, false)}
                              disabled={isUpdating}
                              className="text-[10px] text-muted-foreground hover:text-amber-600 underline ml-1 cursor-pointer"
                              title="Revoke approval to review again"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      )}
                    </TableCell>

                    {/* Active/Inactive Status Toggle (Admin control) */}
                    <TableCell className="py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(addon)}
                        disabled={isUpdating}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${addon.isAvailable
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-muted border border-border text-muted-foreground hover:bg-muted/80"
                          }`}
                      >
                        {isUpdating ? (
                          <RefreshCw className="size-3 animate-spin" />
                        ) : addon.isAvailable ? (
                          <Eye className="size-3" />
                        ) : (
                          <EyeOff className="size-3" />
                        )}
                        <span>{addon.isAvailable ? "Active (In Stock)" : "Inactive (Hidden)"}</span>
                      </button>
                    </TableCell>

                    {/* Actions (Admin Delete & Edit) */}
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(addon)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="Edit add-on"
                        >
                          <Edit3 className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(addon)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                          title="Delete add-on"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => !formSubmitting && setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-foreground"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Gift className="size-5 text-rose-500" />
                {editingAddon ? "Edit Add-on" : "Add New Celebration Add-on"}
              </h3>
              <button
                type="button"
                onClick={() => !formSubmitting && setIsModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle className="size-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAddon} className="mt-4 space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Add-on Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Ferrero Rocher - 200 GM"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="mt-1.5 text-xs"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-foreground">
                    Category <span className="text-rose-500">*</span>
                  </Label>
                  <Select value={formCategory} onValueChange={setFormCategory}>
                    <SelectTrigger className="mt-1.5 w-full h-9 text-xs">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRESET_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                      <SelectItem value="OTHER">Custom Category...</SelectItem>
                    </SelectContent>
                  </Select>
                  {formCategory === "OTHER" && (
                    <Input
                      placeholder="Enter custom category"
                      value={formCustomCategory}
                      onChange={(e) => setFormCustomCategory(e.target.value)}
                      className="mt-2 text-xs"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Price (INR ₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      required
                      type="number"
                      min="0"
                      step="1"
                      placeholder="499"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="pl-7 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Image Selection with Upload (ImageKit / Cloudinary) & Media Library */}
              <MediaImagePicker
                value={formImage}
                onChange={setFormImage}
                folder="/bloom-bakes/addons/admin"
              />

              {/* Vendor Ownership Badge (if vendor-added) */}
              {editingAddon?.vendor && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <Store className="size-4 shrink-0" />
                  <span>
                    Vendor-submitted add-on from: <strong>{editingAddon.vendor.name}</strong> ({editingAddon.vendor.email})
                  </span>
                </div>
              )}

              {/* Admin Approval Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-muted/20">
                <div className="space-y-0.5">
                  <Label htmlFor="form-is-approved" className="cursor-pointer text-xs font-semibold text-foreground">
                    Admin Approval (Item & Price)
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    When approved, item and price reflect on the customer-facing website.
                  </p>
                </div>
                <Switch
                  id="form-is-approved"
                  checked={formIsApproved}
                  onCheckedChange={setFormIsApproved}
                />
              </div>

              {/* Active / Inactive Status Toggle (Admin Control) */}
              <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-muted/20">
                <div className="space-y-0.5">
                  <Label htmlFor="form-is-available" className="cursor-pointer text-xs font-semibold text-foreground">
                    Active Status (In Stock)
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Admin can make this item active or inactive without deleting it.
                  </p>
                </div>
                <Switch
                  id="form-is-available"
                  checked={formIsAvailable}
                  onCheckedChange={setFormIsAvailable}
                />
              </div>

              {/* Modal Buttons */}
              <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={formSubmitting}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={formSubmitting}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs"
                >
                  {formSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="size-3.5 mr-1" />
                      {editingAddon ? "Update Add-on" : "Create Add-on"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => !isDeleting && setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-foreground"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 ring-8 ring-rose-500/5">
                <Trash2 className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-foreground">Delete Celebration Add-on?</h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">
                    &quot;{deleteTarget.title}&quot;
                  </span>
                  ?
                </p>
                <div className="mt-2.5 flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-2 text-xs">
                  <div className="size-10 shrink-0 overflow-hidden rounded bg-muted">
                    <img
                      src={deleteTarget.image}
                      alt={deleteTarget.title}
                      className="size-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/images/categories/chocolates-sweets.jpg";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{deleteTarget.title}</p>
                    <p className="text-rose-600 dark:text-rose-400 font-mono">{formatINR(deleteTarget.price)}</p>
                  </div>
                </div>
                <p className="mt-2.5 text-[11px] text-muted-foreground">
                  This item will immediately be removed from the checkout celebration gallery.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                {isDeleting ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash2 className="size-3.5 mr-1" />
                    Yes, Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
