"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Filter,
  Plus,
  RefreshCw,
  ExternalLink,
  Edit3,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  Sparkles,
  Save,
  X,
  AlertCircle,
  Tag,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  Leaf,
  Store,
  DollarSign,
  Clock,
  Eye,
  Check,
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
import { getProductImage } from "@/lib/product-images";

interface ProductOccasionRel {
  occasion: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductVariantItem {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isDefault: boolean;
}

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  productType: "FLOWERS" | "CAKES" | "COMBOS" | "GIFTS" | "ADDONS";
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  vendorId: string;
  vendor: {
    id: string;
    name: string;
    city: string;
  };
  basePrice: number;
  compareAtPrice: number | null;
  images: string[];
  isAvailable: boolean;
  isApproved: boolean;
  isEgglessAvailable: boolean;
  isCustomMessageSupported: boolean;
  isPhotoCake: boolean;
  prepTimeMinutes: number;
  tags: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  occasions: ProductOccasionRel[];
  variants: ProductVariantItem[];
  _count?: {
    orderItems: number;
  };
}

interface FilterOption {
  id: string;
  name: string;
  slug?: string;
  city?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [vendors, setVendors] = useState<FilterOption[]>([]);
  const [occasions, setOccasions] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Pagination & Filtering
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedProductType, setSelectedProductType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedEggless, setSelectedEggless] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    totalAvailable: 0,
    totalUnavailable: 0,
    totalEggless: 0,
  });

  // Notifications
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Edit / Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formProductType, setFormProductType] = useState<"FLOWERS" | "CAKES" | "COMBOS" | "GIFTS" | "ADDONS">("CAKES");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formVendorId, setFormVendorId] = useState("");
  const [formBasePrice, setFormBasePrice] = useState<number>(499);
  const [formCompareAtPrice, setFormCompareAtPrice] = useState<string>("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formIsEgglessAvailable, setFormIsEgglessAvailable] = useState(false);
  const [formIsCustomMessageSupported, setFormIsCustomMessageSupported] = useState(false);
  const [formIsPhotoCake, setFormIsPhotoCake] = useState(false);
  const [formPrepTimeMinutes, setFormPrepTimeMinutes] = useState<number>(60);
  const [formTags, setFormTags] = useState("");
  const [formMetaTitle, setFormMetaTitle] = useState("");
  const [formMetaDescription, setFormMetaDescription] = useState("");
  const [formOccasionIds, setFormOccasionIds] = useState<string[]>([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedVendor) params.set("vendor", selectedVendor);
      if (selectedProductType) params.set("productType", selectedProductType);
      if (selectedStatus !== "all") params.set("status", selectedStatus);
      if (selectedEggless !== "all") params.set("eggless", selectedEggless);
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();

      setProducts(data.products || []);
      setTotalCount(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
      if (data.categories) setCategories(data.categories);
      if (data.vendors) setVendors(data.vendors);
      if (data.occasions) setOccasions(data.occasions);
      if (data.stats) setStats(data.stats);
    } catch (err: unknown) {
      console.error(err);
      setNotification({
        type: "error",
        message: "Failed to fetch products. Check server logs.",
      });
    } finally {
      setLoading(false);
    }
  }, [
    search,
    selectedCategory,
    selectedVendor,
    selectedProductType,
    selectedStatus,
    selectedEggless,
    page,
    limit,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Auto-dismiss notification after 4s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Quick 1-Click Toggle for in-stock availability
  const toggleProductAvailability = async (product: ProductItem) => {
    const nextVal = !product.isAvailable;
    setUpdatingId(product.id);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: nextVal }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isAvailable: nextVal } : p))
      );

      setNotification({
        type: "success",
        message: `"${product.title}" is now ${nextVal ? "In Stock & Live" : "Marked Out of Stock"}.`,
      });
    } catch {
      setNotification({
        type: "error",
        message: "Failed to update stock status.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Open Edit Modal
  const openEditModal = (product: ProductItem) => {
    setIsEditing(true);
    setEditingId(product.id);
    setFormTitle(product.title);
    setFormSlug(product.slug);
    setFormDescription(product.description || "");
    setFormProductType(product.productType);
    setFormCategoryId(product.categoryId);
    setFormVendorId(product.vendorId);
    setFormBasePrice(product.basePrice);
    setFormCompareAtPrice(product.compareAtPrice ? product.compareAtPrice.toString() : "");
    setFormImageUrl(product.images?.[0] || "");
    setFormIsAvailable(product.isAvailable);
    setFormIsEgglessAvailable(product.isEgglessAvailable);
    setFormIsCustomMessageSupported(product.isCustomMessageSupported);
    setFormIsPhotoCake(product.isPhotoCake);
    setFormPrepTimeMinutes(product.prepTimeMinutes || 60);
    setFormTags(Array.isArray(product.tags) ? product.tags.join(", ") : "");
    setFormMetaTitle(product.metaTitle || "");
    setFormMetaDescription(product.metaDescription || "");
    setFormOccasionIds(product.occasions.map((o) => o.occasion.id));
    setIsModalOpen(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTitle("");
    setFormSlug("");
    setFormDescription("");
    setFormProductType("CAKES");
    setFormCategoryId(categories[0]?.id || "");
    setFormVendorId(vendors[0]?.id || "");
    setFormBasePrice(499);
    setFormCompareAtPrice("");
    setFormImageUrl("https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80");
    setFormIsAvailable(true);
    setFormIsEgglessAvailable(false);
    setFormIsCustomMessageSupported(true);
    setFormIsPhotoCake(false);
    setFormPrepTimeMinutes(60);
    setFormTags("Handcrafted, Fresh, Gift");
    setFormMetaTitle("");
    setFormMetaDescription("");
    setFormOccasionIds([]);
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formCategoryId || !formBasePrice) {
      setNotification({
        type: "error",
        message: "Title, Category, and Base Price are required.",
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formTitle.trim(),
        slug: formSlug.trim() || undefined,
        description: formDescription,
        productType: formProductType,
        categoryId: formCategoryId,
        vendorId: formVendorId || undefined,
        basePrice: Number(formBasePrice),
        compareAtPrice: formCompareAtPrice ? Number(formCompareAtPrice) : null,
        images: formImageUrl ? [formImageUrl.trim()] : undefined,
        isAvailable: formIsAvailable,
        isEgglessAvailable: formIsEgglessAvailable,
        isCustomMessageSupported: formIsCustomMessageSupported,
        isPhotoCake: formIsPhotoCake,
        prepTimeMinutes: Number(formPrepTimeMinutes),
        tags: formTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        metaTitle: formMetaTitle || undefined,
        metaDescription: formMetaDescription || undefined,
        occasionIds: formOccasionIds,
      };

      const url = isEditing
        ? `/api/admin/products/${editingId}`
        : "/api/admin/products";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      setNotification({
        type: "success",
        message: isEditing
          ? `Product "${formTitle}" updated successfully!`
          : `New product "${formTitle}" created successfully!`,
      });

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to save product. Check required fields.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Occasion selection toggle
  const toggleOccasion = (occId: string) => {
    setFormOccasionIds((prev) =>
      prev.includes(occId) ? prev.filter((id) => id !== occId) : [...prev, occId]
    );
  };

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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold font-serif text-foreground tracking-tight">
              Products & Inventory Manager
            </h1>
            <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-xs">
              {stats.total || totalCount} Live Products
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Search, filter, update pricing, edit metadata, and control inventory availability across all catalog items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProducts}
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
            <span>Add New Product</span>
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Catalog Items</span>
            <Package className="h-4 w-4 text-rose-500 dark:text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground font-mono">{stats.total || 701}</span>
            <span className="text-[10px] text-muted-foreground">total listed</span>
          </div>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">In Stock & Active</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {stats.totalAvailable || stats.total}
            </span>
            <span className="text-[10px] text-emerald-600/70 dark:text-emerald-500/70">orderable</span>
          </div>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Out of Stock</span>
            <XCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">
              {stats.totalUnavailable || 0}
            </span>
            <span className="text-[10px] text-amber-600/70 dark:text-amber-500/70">temporarily hidden</span>
          </div>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Eggless-Friendly</span>
            <Leaf className="h-4 w-4 text-teal-500 dark:text-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-teal-600 dark:text-teal-400 font-mono">
              {stats.totalEggless || 0}
            </span>
            <span className="text-[10px] text-teal-600/70 dark:text-teal-500/70">pure vegetarian</span>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2.5">
          {/* Search Input */}
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search product title, slug, or tag..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 text-xs"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <Select
              value={selectedCategory || "ALL"}
              onValueChange={(val) => {
                setSelectedCategory(val === "ALL" ? "" : val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Type Dropdown */}
          <div>
            <Select
              value={selectedProductType || "ALL"}
              onValueChange={(val) => {
                setSelectedProductType(val === "ALL" ? "" : val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="CAKES">Cakes</SelectItem>
                <SelectItem value="FLOWERS">Flowers</SelectItem>
                <SelectItem value="COMBOS">Combos</SelectItem>
                <SelectItem value="GIFTS">Gifts</SelectItem>
                <SelectItem value="ADDONS">Addons</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stock Status Dropdown */}
          <div>
            <Select
              value={selectedStatus}
              onValueChange={(val) => {
                setSelectedStatus(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Stock: All</SelectItem>
                <SelectItem value="available">In Stock Only</SelectItem>
                <SelectItem value="unavailable">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <Select
              value={`${sortBy}:${sortOrder}`}
              onValueChange={(val) => {
                const [sb, so] = val.split(":");
                setSortBy(sb);
                setSortOrder(so as "asc" | "desc");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs">
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt:desc">Newest First</SelectItem>
                <SelectItem value="createdAt:asc">Oldest First</SelectItem>
                <SelectItem value="basePrice:asc">Price: Low to High</SelectItem>
                <SelectItem value="basePrice:desc">Price: High to Low</SelectItem>
                <SelectItem value="title:asc">Name: A to Z</SelectItem>
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
            onClick={() => {
              setSelectedEggless(selectedEggless === "true" ? "all" : "true");
              setPage(1);
            }}
            className={`px-2 py-0.5 rounded-full border transition cursor-pointer ${
              selectedEggless === "true"
                ? "bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/40 font-semibold"
                : "bg-muted text-muted-foreground border-border hover:text-foreground hover:bg-muted/80"
            }`}
          >
            🌱 Eggless Only
          </button>
          <button
            onClick={() => {
              setSelectedStatus(selectedStatus === "unavailable" ? "all" : "unavailable");
              setPage(1);
            }}
            className={`px-2 py-0.5 rounded-full border transition cursor-pointer ${
              selectedStatus === "unavailable"
                ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 font-semibold"
                : "bg-muted text-muted-foreground border-border hover:text-foreground hover:bg-muted/80"
            }`}
          >
            ⚠️ Out of Stock ({stats.totalUnavailable || 0})
          </button>

          {(search || selectedCategory || selectedVendor || selectedProductType || selectedStatus !== "all" || selectedEggless !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
                setSelectedVendor("");
                setSelectedProductType("");
                setSelectedStatus("all");
                setSelectedEggless("all");
                setPage(1);
              }}
              className="text-rose-600 dark:text-rose-400 hover:underline font-medium ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </Card>

      {/* Main Products Table */}
      <Card className="overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider p-4 w-[280px]">
                  Product Details
                </TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider p-4">
                  Type & Category
                </TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider p-4">
                  Vendor
                </TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider p-4">
                  Base Price / MRP
                </TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider p-4">
                  Stock Status
                </TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider p-4">
                  Occasions & Tags
                </TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider p-4 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-rose-500 mb-2" />
                    <span>Loading marketplace products...</span>
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                    <Package className="h-10 w-10 mx-auto text-muted-foreground/60 mb-3" />
                    <p className="font-semibold text-foreground">No products found matching filters</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your search query or reset filters.</p>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => {
                  const discountPercent =
                    p.compareAtPrice && p.compareAtPrice > p.basePrice
                      ? Math.round(((p.compareAtPrice - p.basePrice) / p.compareAtPrice) * 100)
                      : null;

                  return (
                    <TableRow key={p.id} className="border-border hover:bg-muted/40 transition-colors">
                      {/* Product Details */}
                      <TableCell className="p-4">
                        <div className="flex items-start gap-3">
                          <img
                            src={getProductImage(p)}
                            alt={p.title}
                            className="h-12 w-12 rounded-lg object-cover bg-muted border border-border shrink-0"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-foreground text-xs line-clamp-1 hover:text-rose-600 dark:hover:text-rose-400 transition">
                              {p.title}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">
                              /{p.slug}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-zinc-400">
                              <span>⏱️ {p.prepTimeMinutes}m</span>
                              {p.isEgglessAvailable && (
                                <span className="text-teal-400 font-medium">🌱 Eggless</span>
                              )}
                              {p.isPhotoCake && (
                                <span className="text-amber-400 font-medium">📸 Photo</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Type & Category */}
                      <TableCell className="p-4">
                        <div className="space-y-1">
                          <Badge className="bg-rose-500/10 text-rose-300 border-rose-500/30 text-[10px] px-2 py-0.5">
                            {p.category?.name || "Uncategorized"}
                          </Badge>
                          <div className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                            {p.productType}
                          </div>
                        </div>
                      </TableCell>

                      {/* Vendor */}
                      <TableCell className="p-4">
                        <div className="text-xs font-semibold text-zinc-200">
                          {p.vendor?.name || "MyPetalsCart"}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {p.vendor?.city || "Nationwide"}
                        </div>
                      </TableCell>

                      {/* Base Price / MRP */}
                      <TableCell className="p-4">
                        <div className="flex items-baseline gap-1.5 font-mono">
                          <span className="font-bold text-sm text-white">
                            {formatINR(p.basePrice)}
                          </span>
                          {p.compareAtPrice && p.compareAtPrice > p.basePrice && (
                            <span className="text-[11px] text-zinc-500 line-through">
                              {formatINR(p.compareAtPrice)}
                            </span>
                          )}
                        </div>
                        {discountPercent && (
                          <span className="inline-block mt-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </TableCell>

                      {/* Stock Status with Instant 1-Click Toggle */}
                      <TableCell className="p-4">
                        <button
                          onClick={() => toggleProductAvailability(p)}
                          disabled={updatingId === p.id}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                            p.isAvailable
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                          }`}
                          title="Click to toggle In Stock / Out of Stock"
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              p.isAvailable ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                            }`}
                          />
                          <span>
                            {updatingId === p.id
                              ? "Updating..."
                              : p.isAvailable
                              ? "In Stock"
                              : "Out of Stock"}
                          </span>
                        </button>
                      </TableCell>

                      {/* Occasions & Tags */}
                      <TableCell className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {p.occasions && p.occasions.length > 0 ? (
                            p.occasions.slice(0, 2).map((rel) => (
                              <span
                                key={rel.occasion.id}
                                className="rounded bg-muted border border-border px-1.5 py-0.5 text-[10px] text-foreground"
                              >
                                {rel.occasion.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-muted-foreground italic">No occasion mapped</span>
                          )}
                          {p.occasions && p.occasions.length > 2 && (
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                              +{p.occasions.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition"
                            title="Preview on Storefront"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(p)}
                            className="h-7 w-7 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30"
                            title="Edit Product & Pricing"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
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

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-t border-border text-xs text-muted-foreground">
          <div>
            Showing{" "}
            <span className="font-semibold text-foreground">
              {totalCount === 0 ? 0 : (page - 1) * limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-foreground">
              {Math.min(page * limit, totalCount)}
            </span>{" "}
            of <span className="font-semibold text-foreground">{totalCount}</span> products
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">Rows per page:</span>
            <Select
              value={String(limit)}
              onValueChange={(val) => {
                setLimit(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-7 w-[70px] text-xs">
                <SelectValue placeholder="25" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="h-7 w-7 border-border bg-card text-foreground hover:bg-muted"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="px-2 font-mono text-[11px] text-foreground">
                {page} / {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="h-7 w-7 border-border bg-card text-foreground hover:bg-muted"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* COMPREHENSIVE EDIT / CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-2xl animate-in fade-in zoom-in-95 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-serif">
                <ShoppingBag className="h-5 w-5 text-rose-500" />
                <span>{isEditing ? "Edit Product" : "Create New Product"}</span>
                {isEditing && (
                  <span className="text-xs font-mono font-normal text-muted-foreground">
                    (ID: {editingId?.slice(-6)})
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
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto pr-1 py-4 space-y-4 text-xs">
              {/* General Info */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                  1. Basic Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-foreground font-semibold">Product Title *</label>
                    <Input
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Classic Red Roses Bouquet"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-foreground font-semibold">Slug (URL identifier)</label>
                    <Input
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="e.g. classic-red-roses-bouquet"
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-foreground font-semibold">Category *</Label>
                    <Select
                      value={formCategoryId}
                      onValueChange={setFormCategoryId}
                      required
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-foreground font-semibold">Product Type</Label>
                    <Select
                      value={formProductType}
                      onValueChange={(val: any) => setFormProductType(val)}
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Product Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CAKES">Cakes</SelectItem>
                        <SelectItem value="FLOWERS">Flowers</SelectItem>
                        <SelectItem value="COMBOS">Combos</SelectItem>
                        <SelectItem value="GIFTS">Gifts</SelectItem>
                        <SelectItem value="ADDONS">Addons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-foreground font-semibold">Prep Time (minutes)</label>
                    <Input
                      type="number"
                      value={formPrepTimeMinutes}
                      onChange={(e) => setFormPrepTimeMinutes(Number(e.target.value))}
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-foreground font-semibold">Description</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Rich description of the product, ingredients, freshness, and packaging..."
                    className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                  2. Pricing & Availability
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-foreground font-semibold">Base Price (₹) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formBasePrice}
                      onChange={(e) => setFormBasePrice(Number(e.target.value))}
                      className="font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-foreground font-semibold">Compare At / MRP (₹)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formCompareAtPrice}
                      onChange={(e) => setFormCompareAtPrice(e.target.value)}
                      placeholder="Optional crossed-out price"
                      className="font-mono"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card">
                    <Switch
                      id="form-is-available"
                      checked={formIsAvailable}
                      onCheckedChange={setFormIsAvailable}
                    />
                    <Label htmlFor="form-is-available" className="text-[11px] font-semibold text-foreground cursor-pointer">
                      In Stock
                    </Label>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card">
                    <Switch
                      id="form-is-eggless"
                      checked={formIsEgglessAvailable}
                      onCheckedChange={setFormIsEgglessAvailable}
                    />
                    <Label htmlFor="form-is-eggless" className="text-[11px] font-semibold text-foreground cursor-pointer">
                      Eggless 🌱
                    </Label>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card">
                    <Switch
                      id="form-is-custom-message"
                      checked={formIsCustomMessageSupported}
                      onCheckedChange={setFormIsCustomMessageSupported}
                    />
                    <Label htmlFor="form-is-custom-message" className="text-[11px] font-semibold text-foreground cursor-pointer">
                      Message ✉️
                    </Label>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card">
                    <Switch
                      id="form-is-photo-cake"
                      checked={formIsPhotoCake}
                      onCheckedChange={setFormIsPhotoCake}
                    />
                    <Label htmlFor="form-is-photo-cake" className="text-[11px] font-semibold text-foreground cursor-pointer">
                      Photo Cake 📸
                    </Label>
                  </div>
                </div>
              </div>

              {/* Image & Tags */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                  3. Media & Tagging
                </div>

                <div className="space-y-1">
                  <label className="text-foreground font-semibold">Primary Image URL</label>
                  <div className="flex gap-2">
                    <Input
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="font-mono text-[11px]"
                    />
                    {formImageUrl && (
                      <img
                        src={formImageUrl}
                        alt="Preview"
                        className="h-9 w-9 rounded object-cover bg-muted border border-border shrink-0"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-foreground font-semibold">Tags (comma-separated)</label>
                  <Input
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="e.g. Best Seller, Roses, Romantic, Midnight"
                  />
                </div>
              </div>

              {/* Occasions Mapping */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                    4. Occasion Tagging ({formOccasionIds.length} selected)
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Enables mega-menu & occasion landing pages
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-lg border border-border bg-muted/30">
                  {occasions.map((occ) => {
                    const isSelected = formOccasionIds.includes(occ.id);
                    return (
                      <button
                        type="button"
                        key={occ.id}
                        onClick={() => toggleOccasion(occ.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                          isSelected
                            ? "bg-rose-600 text-white border border-rose-500 shadow-xs"
                            : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-border"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        <span>{occ.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SEO Meta */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                  5. Search Engine Optimization (SEO)
                </div>

                <div className="space-y-1">
                  <label className="text-foreground font-semibold">Meta Title</label>
                  <Input
                    value={formMetaTitle}
                    onChange={(e) => setFormMetaTitle(e.target.value)}
                    placeholder="e.g. Send Classic Red Roses Bouquet Online | MyPetalsCart"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-foreground font-semibold">Meta Description</label>
                  <textarea
                    rows={2}
                    value={formMetaDescription}
                    onChange={(e) => setFormMetaDescription(e.target.value)}
                    placeholder="Short summary for Google search result snippet..."
                    className="w-full rounded-lg border border-input bg-background p-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                  />
                </div>
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
                  <span>{isEditing ? "Save Changes" : "Create Product"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
