"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Gift,
  Plus,
  RefreshCw,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Lock,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Sparkles,
  Info,
  ShieldAlert,
  Layers,
  Store,
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
import { MediaImagePicker } from "@/components/ui/media-image-picker";

interface VendorAddonItem {
  id: string;
  vendorId?: string | null;
  title: string;
  category: string;
  price: number;
  image: string;
  isAvailable: boolean;
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  { label: "Ferrero Rocher 16 Pcs", path: "/16-peaces-chocolate.jpeg" },
  { label: "Ferrero Rocher 200 GM", path: "/200gm-chocolate.jpg" },
  { label: "Cuddly Teddy Bear", path: "/teddy.webp" },
  { label: "Celebration Party Balloons", path: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80" },
  { label: "Birthday Greeting Card", path: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80" },
  { label: "Celebration Candle", path: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80" },
  { label: "Single Red Rose Sleeve", path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80" },
];

export default function VendorAddonsPage() {
  const [addons, setAddons] = useState<VendorAddonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "INACTIVE">("ALL");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<VendorAddonItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Chocolates");
  const [formCustomCategory, setFormCustomCategory] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Toast banner
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchVendorAddons = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/vendor/addons");
      if (!res.ok) throw new Error("Failed to fetch store add-on items");
      const data = await res.json();
      setAddons(data.addons || []);
    } catch {
      showToast("Unable to load add-on items. Please refresh.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendorAddons();
  }, [fetchVendorAddons]);

  const openCreateModal = () => {
    setEditingAddon(null);
    setFormTitle("");
    setFormCategory("Chocolates");
    setFormCustomCategory("");
    setFormPrice("");
    setFormImage(PRESET_IMAGES[0].path);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: VendorAddonItem) => {
    setEditingAddon(item);
    setFormTitle(item.title);
    if (PRESET_CATEGORIES.includes(item.category)) {
      setFormCategory(item.category);
      setFormCustomCategory("");
    } else {
      setFormCategory("CUSTOM");
      setFormCustomCategory(item.category);
    }
    setFormPrice(String(item.price));
    setFormImage(item.image);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const title = formTitle.trim();
    const finalCategory = formCategory === "CUSTOM" ? formCustomCategory.trim() : formCategory;
    const priceNum = parseFloat(formPrice);
    const image = formImage.trim();

    if (!title) {
      setFormError("Add-on title is required.");
      return;
    }
    if (!finalCategory) {
      setFormError("Category is required.");
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("Price must be greater than ₹0.");
      return;
    }
    if (!image) {
      setFormError("Image is required.");
      return;
    }

    setFormSubmitting(true);
    try {
      if (editingAddon) {
        // Update existing addon
        const res = await fetch(`/api/vendor/addons/${editingAddon.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            category: finalCategory,
            price: priceNum,
            image,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update add-on");

        setAddons((prev) =>
          prev.map((a) => (a.id === editingAddon.id ? data.addon : a))
        );
        showToast("Add-on updated! Awaiting admin review for the updated price before going live.");
      } else {
        // Create new addon
        const res = await fetch("/api/vendor/addons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            category: finalCategory,
            price: priceNum,
            image,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create add-on");

        setAddons((prev) => [data.addon, ...prev]);
        showToast("New add-on submitted! Marketplace admin will review the item & price before it reflects on the website.");
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save add-on item";
      setFormError(msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Filtered addons
  const filteredAddons = addons.filter((a) => {
    if (statusFilter === "PENDING" && a.isApproved) return false;
    if (statusFilter === "APPROVED" && (!a.isApproved || !a.isAvailable)) return false;
    if (statusFilter === "INACTIVE" && (a.isAvailable || !a.isApproved)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCount = addons.length;
  const pendingCount = addons.filter((a) => !a.isApproved).length;
  const liveCount = addons.filter((a) => a.isApproved && a.isAvailable).length;
  const inactiveCount = addons.filter((a) => a.isApproved && !a.isAvailable).length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`rounded-xl p-4 text-xs font-semibold shadow-md flex items-center justify-between transition-all ${
            toastMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-zinc-400 hover:text-zinc-600 ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Gift className="h-5 w-5 text-rose-600" />
              <span>My Add-on Items</span>
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
              <Lock className="h-2.5 w-2.5" />
              Store Isolated
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Add custom greeting cards, candles, chocolates, or celebration items. Added items are strictly isolated to your store and will reflect on your product pages once approved by admin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchVendorAddons}
            disabled={loading}
            className="text-xs text-zinc-600 hover:text-zinc-900 border-zinc-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={openCreateModal}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add New Add-on
          </Button>
        </div>
      </div>

      {/* Informational Isolation & Approval Callout */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 space-y-2">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-950">
              Merchant Verification & Approval Policy
            </p>
            <p className="text-amber-800 leading-relaxed">
              • <strong>Store Isolated:</strong> You can only view and manage add-on items created by your store. Other vendors cannot see or use your inventory.
            </p>
            <p className="text-amber-800 leading-relaxed">
              • <strong>Admin Approval Required:</strong> All newly added items and price changes are reviewed by marketplace administration before reflecting on customer-facing product pages.
            </p>
            <p className="text-amber-800 leading-relaxed">
              • <strong>Protected Deletions:</strong> In order to maintain order records and customer delivery integrity, vendors can update item details and prices, while deletions and suspensions are managed directly by administration.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-zinc-200 bg-white">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">My Added Items</span>
            <Layers className="h-4 w-4 text-zinc-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900 font-mono">{totalCount}</p>
        </Card>

        <Card className="p-4 border-amber-200 bg-amber-50/40">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-medium">Pending Review</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-700 font-mono">{pendingCount}</p>
        </Card>

        <Card className="p-4 border-emerald-200 bg-emerald-50/40">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-medium">Live on Storefront</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-700 font-mono">{liveCount}</p>
        </Card>

        <Card className="p-4 border-zinc-200 bg-zinc-50/50">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Admin Inactive</span>
            <ShieldAlert className="h-4 w-4 text-zinc-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-600 font-mono">{inactiveCount}</p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search my add-ons..."
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(val: "ALL" | "PENDING" | "APPROVED" | "INACTIVE") => setStatusFilter(val)}
          >
            <SelectTrigger className="text-xs h-9 w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Items ({totalCount})</SelectItem>
              <SelectItem value="PENDING">Pending Review ({pendingCount})</SelectItem>
              <SelectItem value="APPROVED">Live on Storefront ({liveCount})</SelectItem>
              <SelectItem value="INACTIVE">Admin Inactive ({inactiveCount})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Add-ons List */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-zinc-400 space-y-2">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-rose-500" />
            <p>Loading your store add-ons...</p>
          </div>
        ) : filteredAddons.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
              <Gift className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-900">
                {addons.length === 0 ? "No add-on items added yet" : "No items matching filter"}
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {addons.length === 0
                  ? "Offer greeting cards, designer chocolates, celebration candles, or plush toys to boost order values on your products."
                  : "Try clearing your search query or selecting a different status filter."}
              </p>
            </div>
            {addons.length === 0 && (
              <Button
                onClick={openCreateModal}
                size="sm"
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Your First Add-on
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50/80">
                <TableRow className="border-zinc-100 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Item Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Approval & Storefront Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAddons.map((item) => (
                  <TableRow key={item.id} className="border-zinc-100 hover:bg-zinc-50/50">
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-zinc-900">{item.title}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">ID: {item.id}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="text-[11px] font-medium text-zinc-700 border-zinc-200">
                        {item.category}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-bold text-zinc-900 font-mono">
                        {formatINR(item.price)}
                      </span>
                    </TableCell>

                    <TableCell>
                      {!item.isApproved ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                            <Clock className="h-3 w-3" />
                            Pending Admin Review
                          </span>
                          <p className="text-[10px] text-amber-700/80">
                            Awaiting admin approval of item & price
                          </p>
                        </div>
                      ) : item.isAvailable ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            Approved & Live
                          </span>
                          <p className="text-[10px] text-emerald-700/80">
                            Visible to customers on your products
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200 px-2 py-0.5 rounded-full">
                            <ShieldAlert className="h-3 w-3" />
                            Admin Inactive
                          </span>
                          <p className="text-[10px] text-zinc-500">
                            Temporarily paused by marketplace admin
                          </p>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(item)}
                        className="text-xs text-zinc-700 hover:text-zinc-900 border-zinc-200 h-8"
                      >
                        <Edit3 className="h-3.5 w-3.5 mr-1" />
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Add / Edit Addon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                  <Gift className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    {editingAddon ? "Update Add-on Item" : "Add New Add-on Item"}
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    {editingAddon
                      ? "Modifying price or item details will require re-approval from admin."
                      : "Items will be submitted for marketplace administration review."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Add-on Item Title *</label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Ferrero Rocher Box (16 Pcs) or Handwritten Card"
                  required
                  className="text-xs h-9"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Category *</label>
                  <Select value={formCategory} onValueChange={(val) => setFormCategory(val)}>
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRESET_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="CUSTOM">+ Custom Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Price (₹) *</label>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 199"
                    required
                    className="text-xs h-9"
                  />
                </div>
              </div>

              {formCategory === "CUSTOM" && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Custom Category Name *</label>
                  <Input
                    value={formCustomCategory}
                    onChange={(e) => setFormCustomCategory(e.target.value)}
                    placeholder="e.g. Party Sprinkles"
                    className="text-xs h-9"
                  />
                </div>
              )}

              {/* Image Selection with Upload (ImageKit / Cloudinary) & Media Library */}
              <MediaImagePicker
                value={formImage}
                onChange={setFormImage}
                folder="/bloom-bakes/addons/vendor"
              />

              {/* Approval Notice */}
              <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-3 text-[11px] text-zinc-600 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-800">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  <span>Admin Review Notice</span>
                </div>
                <p>
                  Once submitted, this item and its price will be reviewed by admin. It will go live on your store&apos;s product pages as soon as approved.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-zinc-100 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  disabled={formSubmitting}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={formSubmitting}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
                >
                  {formSubmitting
                    ? "Saving..."
                    : editingAddon
                    ? "Update Add-on"
                    : "Submit for Approval"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
