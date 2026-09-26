"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tag,
  Calendar,
  Plus,
  RefreshCw,
  ExternalLink,
  Edit3,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  Save,
  X,
  Sparkles,
  ArrowRight,
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

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

interface OccasionItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  bannerImage: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

export default function AdminCategoriesAndOccasionsPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "occasions">("categories");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [occasions, setOccasions] = useState<OccasionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"category" | "occasion">("category");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formSortOrder, setFormSortOrder] = useState<number>(0);
  const [formIsActive, setFormIsActive] = useState(true);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, occRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/occasions"),
      ]);

      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
      if (occRes.ok) {
        const occData = await occRes.json();
        setOccasions(occData.occasions || []);
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to load catalog data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = (mode: "category" | "occasion") => {
    setModalMode(mode);
    setIsEditing(false);
    setEditingId(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormImage("");
    setFormSortOrder(mode === "category" ? categories.length + 1 : occasions.length + 1);
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: CategoryItem | OccasionItem, mode: "category" | "occasion") => {
    setModalMode(mode);
    setIsEditing(true);
    setEditingId(item.id);
    setFormName(item.name);
    setFormSlug(item.slug);
    setFormDescription(item.description || "");
    setFormImage(mode === "category" ? (item as CategoryItem).image || "" : (item as OccasionItem).bannerImage || "");
    setFormSortOrder(item.sortOrder);
    setFormIsActive(item.isActive);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!isEditing) {
      setFormSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) {
      showNotification("error", "Name and slug are required");
      return;
    }

    setSaving(true);
    try {
      const endpoint = modalMode === "category" ? "/api/admin/categories" : "/api/admin/occasions";
      const url = isEditing && editingId ? `${endpoint}/${editingId}` : endpoint;
      const method = isEditing ? "PUT" : "POST";

      const payload = {
        name: formName.trim(),
        slug: formSlug.trim(),
        description: formDescription.trim() || null,
        sortOrder: Number(formSortOrder) || 0,
        isActive: formIsActive,
        ...(modalMode === "category" ? { image: formImage.trim() || null } : { bannerImage: formImage.trim() || null }),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Operation failed");
      }

      showNotification("success", `${modalMode === "category" ? "Category" : "Occasion"} saved successfully!`);
      setIsModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      console.error(err);
      showNotification("error", err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (item: CategoryItem | OccasionItem, mode: "category" | "occasion") => {
    try {
      const endpoint = mode === "category" ? `/api/admin/categories/${item.id}` : `/api/admin/occasions/${item.id}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (res.ok) {
        showNotification("success", `Updated status for ${item.name}`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to update status");
    }
  };

  const totalProductsMapped = categories.reduce((sum, c) => sum + (c._count?.products || 0), 0);

  return (
    <div className="space-y-6 text-foreground">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 rounded-xl px-4 py-3 text-xs font-semibold shadow-xl border flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
              : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
          }`}
        >
          {notification.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="h-3.5 w-3.5" />
            <span>Marketplace Catalog Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground tracking-tight mt-1">
            Categories & Occasions Hub
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            Manage your store&apos;s product categories, gifting occasions, banner images, and relational links across all 700+ catalog products.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchData}
            variant="outline"
            size="sm"
            className="border-border bg-card hover:bg-muted text-card-foreground"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={() => openCreateModal(activeTab === "categories" ? "category" : "occasion")}
            size="sm"
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add {activeTab === "categories" ? "Category" : "Occasion"}
          </Button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 hover:border-rose-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Live Categories</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <Tag className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-foreground mt-2">{categories.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Cakes, Flowers, Combos, Plants, Chocolates</p>
        </Card>

        <Card className="p-4 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Gifting Occasions</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Calendar className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-foreground mt-2">{occasions.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Birthdays, Anniversaries, Festivals, Weddings</p>
        </Card>

        <Card className="p-4 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Active Inventory</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Package className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-foreground mt-2">{totalProductsMapped}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Total products indexed deliverable</p>
        </Card>
      </div>

      {/* Tabs Switcher - Pill Bar */}
      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border max-w-fit">
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "categories"
              ? "bg-card text-foreground shadow-xs border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Tag className="h-3.5 w-3.5 text-rose-500" />
          <span>Product Categories</span>
          <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 font-mono">
            {categories.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("occasions")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "occasions"
              ? "bg-card text-foreground shadow-xs border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Calendar className="h-3.5 w-3.5 text-amber-500" />
          <span>Celebration Occasions</span>
          <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 font-mono">
            {occasions.length}
          </Badge>
        </button>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="py-20 text-center text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-rose-500" />
          <p className="text-xs">Loading catalog collections...</p>
        </div>
      ) : activeTab === "categories" ? (
        /* CATEGORIES TABLE */
        <Card className="overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Order</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Category Name & Slug</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Thumbnail</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Description</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Products</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Status</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {categories.map((c) => (
                <TableRow key={c.id} className="border-border hover:bg-muted/40 transition-colors">
                  <TableCell className="p-4 font-mono text-muted-foreground text-xs">#{c.sortOrder}</TableCell>
                  <TableCell className="p-4">
                    <div className="font-bold text-foreground text-xs">{c.name}</div>
                    <div className="font-mono text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">/{c.slug}</div>
                  </TableCell>
                  <TableCell className="p-4">
                    {c.image ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={c.image}
                          alt={c.name}
                          className="h-8 w-8 object-cover rounded-full border border-border shadow-xs"
                        />
                        <span className="text-[10px] text-muted-foreground max-w-[120px] truncate font-mono">{c.image}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-[11px]">No image</span>
                    )}
                  </TableCell>
                  <TableCell className="p-4 text-muted-foreground text-xs max-w-xs truncate">
                    {c.description || "—"}
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge variant="secondary" className="gap-1 font-medium text-xs">
                      <Package className="h-3 w-3 text-rose-500" />
                      {c._count?.products || 0} items
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4">
                    <button
                      onClick={() => toggleStatus(c, "category")}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                        c.isActive
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${c.isActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`} />
                      <span>{c.isActive ? "Active" : "Hidden"}</span>
                    </button>
                  </TableCell>
                  <TableCell className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/catalog?category=${c.slug}`}
                        target="_blank"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition"
                        title="View on Storefront"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(c, "category")}
                        className="h-7 w-7 text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-500/10"
                        title="Edit Category"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        /* OCCASIONS TABLE */
        <Card className="overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Order</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Occasion & Slug</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Banner Image</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Tagged Products</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Status</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {occasions.map((o) => (
                <TableRow key={o.id} className="border-border hover:bg-muted/40 transition-colors">
                  <TableCell className="p-4 font-mono text-muted-foreground text-xs">#{o.sortOrder}</TableCell>
                  <TableCell className="p-4">
                    <div className="font-bold text-foreground text-xs">{o.name}</div>
                    <div className="font-mono text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">/{o.slug}</div>
                  </TableCell>
                  <TableCell className="p-4">
                    {o.bannerImage ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={o.bannerImage}
                          alt={o.name}
                          className="h-7 w-11 object-cover rounded-md border border-border"
                        />
                        <span className="text-[10px] text-muted-foreground max-w-[120px] truncate">{o.bannerImage}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-[11px]">No image</span>
                    )}
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge variant="secondary" className="gap-1 font-medium text-xs">
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      {o._count?.products || 0} items
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4">
                    <button
                      onClick={() => toggleStatus(o, "occasion")}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                        o.isActive
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${o.isActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`} />
                      <span>{o.isActive ? "Active" : "Hidden"}</span>
                    </button>
                  </TableCell>
                  <TableCell className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/catalog?occasion=${o.slug}`}
                        target="_blank"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition"
                        title="View on Storefront"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(o, "occasion")}
                        className="h-7 w-7 text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-500/10"
                        title="Edit Occasion"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 text-foreground">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-serif">
                {modalMode === "category" ? <Tag className="h-5 w-5 text-rose-500" /> : <Calendar className="h-5 w-5 text-amber-500" />}
                <span>
                  {isEditing ? "Edit" : "Create"} {modalMode === "category" ? "Category" : "Occasion"}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-foreground font-semibold">Name *</label>
                <Input
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={modalMode === "category" ? "e.g. Gourmet Cakes" : "e.g. Raksha Bandhan"}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground font-semibold">URL Slug *</label>
                <Input
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  placeholder={modalMode === "category" ? "e.g. cakes" : "e.g. raksha-bandhan"}
                  className="font-mono"
                  required
                />
                <p className="text-[10px] text-muted-foreground">Live URL: /catalog?{modalMode === "category" ? "category" : "occasion"}={formSlug || "..."}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground font-semibold">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short merchandising description displayed in banners and SEO tags..."
                  rows={3}
                  className="w-full rounded-xl bg-background border border-input p-2.5 text-xs text-foreground focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground font-semibold">
                  {modalMode === "category" ? "Category Image Path / URL" : "Banner Image Path / URL"}
                </label>
                <Input
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="/images/occasions/birthday.jpg"
                  className="font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-foreground font-semibold">Sort Order</label>
                  <Input
                    type="number"
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground font-semibold">Visibility</label>
                  <div className="pt-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-foreground">
                      <input
                        type="checkbox"
                        checked={formIsActive}
                        onChange={(e) => setFormIsActive(e.target.checked)}
                        className="rounded border-input bg-background text-rose-600 focus:ring-rose-500"
                      />
                      <span>Active on Storefront</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={saving}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Now"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
