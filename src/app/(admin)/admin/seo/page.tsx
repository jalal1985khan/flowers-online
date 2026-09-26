"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Search,
  Plus,
  RefreshCw,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MapPin,
  Tag,
  Eye,
  Save,
  X,
  AlertCircle,
  Sparkles,
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

interface FAQItem {
  q: string;
  a: string;
}

interface SeoPageItem {
  id: string;
  slug: string;
  title: string;
  heading: string;
  subheading: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  city: string;
  categorySlug: string | null;
  occasionSlug: string | null;
  flavorOrType: string | null;
  badgeText: string | null;
  introHtml: string | null;
  contentBody: string | null;
  deliveryAreas: string[];
  faqs: FAQItem[] | null;
  popularKeywords: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSeoPagesPage() {
  const [pages, setPages] = useState<SeoPageItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal / Editing state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Partial<SeoPageItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "content" | "faqs" | "localities">("general");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchPages();
  }, [searchQuery, selectedCategory, selectedStatus]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchPages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedStatus !== "all") params.append("status", selectedStatus);

      const res = await fetch(`/api/admin/seo-pages?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages || []);
        setTotalCount(data.totalCount || 0);
        setActiveCount(data.activeCount || 0);
      }
    } catch (e) {
      console.error(e);
      showNotification("error", "Failed to fetch SEO pages.");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncSeed = async () => {
    if (!confirm("This will synchronize/seed all 43 standard Guwahati landing pages. Continue?")) return;
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/seo-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed" }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("success", data.message || "All 43 pages synced successfully!");
        fetchPages();
      } else {
        showNotification("error", data.error || "Failed to sync pages.");
      }
    } catch (e: any) {
      showNotification("error", e.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleActive = async (page: SeoPageItem) => {
    try {
      const res = await fetch(`/api/admin/seo-pages/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !page.isActive }),
      });
      if (res.ok) {
        showNotification("success", `Page ${!page.isActive ? "Activated" : "Deactivated"}!`);
        fetchPages();
      }
    } catch (e) {
      showNotification("error", "Failed to update status.");
    }
  };

  const handleDeletePage = async (page: SeoPageItem) => {
    if (!confirm(`Are you sure you want to delete '${page.title}'? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/seo-pages/${page.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showNotification("success", "Page deleted successfully.");
        fetchPages();
      }
    } catch (e) {
      showNotification("error", "Failed to delete page.");
    }
  };

  const openNewPageModal = () => {
    setEditingPage({
      title: "",
      slug: "",
      heading: "",
      subheading: "",
      metaTitle: "",
      metaDescription: "",
      city: "Guwahati",
      categorySlug: "cakes",
      occasionSlug: "",
      flavorOrType: "",
      badgeText: "Same-Day & Midnight Delivery",
      introHtml: "",
      contentBody: "",
      deliveryAreas: [
        "Paltan Bazaar", "G S Road", "Zoo Road", "Six Mile", "Ganeshguri",
        "Beltola", "Dispur", "Chandmari", "Silpukhuri", "Maligaon"
      ],
      faqs: [
        { q: "Do you deliver cakes after midnight in Guwahati?", a: "Yes, our midnight slot delivers between 11:00 PM and 11:59 PM across Guwahati." },
        { q: "Is same-day delivery available?", a: "Yes, order before 5:00 PM for guaranteed same-day delivery." }
      ],
      popularKeywords: ["guwahati delivery", "fresh cakes", "flowers online"],
      isActive: true,
    });
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const openEditModal = (page: SeoPageItem) => {
    setEditingPage({
      ...page,
      deliveryAreas: page.deliveryAreas || [],
      faqs: page.faqs || [],
      popularKeywords: page.popularKeywords || [],
    });
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    if (!editingPage.title || !editingPage.slug) {
      showNotification("error", "Title and URL Slug are required.");
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingPage.id;
      const url = isNew ? "/api/admin/seo-pages" : `/api/admin/seo-pages/${editingPage.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPage),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification("success", isNew ? "SEO Page created successfully!" : "SEO Page updated successfully!");
        setIsModalOpen(false);
        setEditingPage(null);
        fetchPages();
      } else {
        showNotification("error", data.error || "Failed to save page.");
      }
    } catch (e: any) {
      showNotification("error", e.message);
    } finally {
      setSaving(false);
    }
  };

  // FAQ helpers
  const handleAddFaq = () => {
    if (!editingPage) return;
    const currentFaqs = [...(editingPage.faqs || [])];
    currentFaqs.push({ q: "", a: "" });
    setEditingPage({ ...editingPage, faqs: currentFaqs });
  };

  const handleUpdateFaq = (index: number, field: "q" | "a", value: string) => {
    if (!editingPage) return;
    const currentFaqs = [...(editingPage.faqs || [])];
    currentFaqs[index] = { ...currentFaqs[index], [field]: value };
    setEditingPage({ ...editingPage, faqs: currentFaqs });
  };

  const handleRemoveFaq = (index: number) => {
    if (!editingPage) return;
    const currentFaqs = (editingPage.faqs || []).filter((_, i) => i !== index);
    setEditingPage({ ...editingPage, faqs: currentFaqs });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-xl border ${
            notification.type === "success"
              ? "bg-emerald-950 text-emerald-200 border-emerald-800"
              : "bg-rose-950 text-rose-200 border-rose-800"
          }`}
        >
          {notification.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
              <Globe className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">SEO Landing Pages Manager</h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Control dynamic content, meta titles, SERP descriptions, local delivery coverage, and FAQs for high-ranking search keywords.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSyncSeed}
            disabled={syncing}
            variant="outline"
            className="border-border bg-card text-foreground hover:bg-muted text-xs"
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span>Sync All 43 Pages</span>
          </Button>

          <Button
            onClick={openNewPageModal}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            <span>New Landing Page</span>
          </Button>
        </div>
      </div>

      {/* Stat Cards - Shadcn UI */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total SEO Pages</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Globe className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">{totalCount}</p>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
            <Sparkles className="h-3 w-3" />
            <span>43 High-Intent Keywords</span>
          </div>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Live & Published</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">{activeCount}</p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Accessible by Google & Users</span>
          </div>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Target Region</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <MapPin className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-foreground tracking-tight">Guwahati</p>
          <p className="mt-1 text-[11px] text-muted-foreground">40+ Local Delivery Hubs</p>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Structured Data</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-amber-600 dark:text-amber-400 tracking-tight">Schema.org</p>
          <p className="mt-1 text-[11px] text-muted-foreground truncate">JSON-LD + FAQPage Snippet</p>
        </Card>
      </div>

      {/* Filter & Search Bar - Shadcn UI Style */}
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword, title, slug..."
            className="h-9 pl-9 text-xs"
          />
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2">
          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[160px] h-9 text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="cakes">Cakes</SelectItem>
              <SelectItem value="flowers">Flowers</SelectItem>
              <SelectItem value="combos">Combos</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[160px] h-9 text-xs">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Live & Published</SelectItem>
              <SelectItem value="inactive">Draft / Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Pages Table - Shadcn UI Table */}
      <Card className="overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 text-center text-xs text-muted-foreground space-y-2">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-blue-500" />
            <p className="font-medium text-foreground">Loading SEO landing pages...</p>
          </div>
        ) : pages.length === 0 ? (
          <div className="p-16 text-center text-xs text-muted-foreground space-y-2">
            <Globe className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <p className="font-semibold text-foreground text-sm">No SEO pages match your filters</p>
            <p className="text-muted-foreground max-w-sm mx-auto">Click &quot;Sync All 43 Pages&quot; to restore default pages or create a new landing page.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Page Title & Keyword</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Live URL Slug</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Category / Occasion</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Delivery Areas</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px]">FAQs</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px]">Status</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-[11px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {pages.map((page) => (
                <TableRow key={page.id} className="border-border hover:bg-muted/40 transition-colors">
                  <TableCell className="p-4">
                    <div className="font-bold text-foreground text-xs">{page.title}</div>
                    <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{page.heading}</div>
                  </TableCell>
                  <TableCell className="p-4">
                    <code className="inline-flex items-center rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-[11px] text-blue-600 dark:text-blue-300 font-medium">
                      /{page.slug}
                    </code>
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge variant="secondary" className="uppercase text-[10px] tracking-wider font-semibold">
                      {page.categorySlug || "All"}
                    </Badge>
                    {page.occasionSlug && (
                      <span className="ml-1.5 inline-block text-[10px] text-muted-foreground font-medium">
                        ({page.occasionSlug})
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="p-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
                      <span>{page.deliveryAreas?.length || 0} Areas</span>
                    </span>
                  </TableCell>
                  <TableCell className="p-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
                      <HelpCircle className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                      <span>{page.faqs?.length || 0} Q&As</span>
                    </span>
                  </TableCell>
                  <TableCell className="p-4">
                    <button
                      onClick={() => handleToggleActive(page)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                        page.isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-muted text-muted-foreground border border-border hover:bg-muted/80 hover:text-foreground"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${page.isActive ? "bg-emerald-500 dark:bg-emerald-400 animate-pulse" : "bg-muted-foreground"}`} />
                      <span>{page.isActive ? "Live" : "Draft"}</span>
                    </button>
                  </TableCell>
                  <TableCell className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition"
                        title="Preview Live Page"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(page)}
                        className="h-7 w-7 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30"
                        title="Edit Page Content"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePage(page)}
                        className="h-7 w-7 text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30"
                        title="Delete Page"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>


      {/* Edit / Create Page Modal */}
      {isModalOpen && editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {editingPage.id ? `Edit Landing Page: ${editingPage.title}` : "Create New SEO Landing Page"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Configure search engine optimization, content narrative, FAQs, and local delivery properties.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-border pt-3">
              {[
                { id: "general", label: "General & URL" },
                { id: "seo", label: "SEO Meta & SERP Preview" },
                { id: "content", label: "Headings & Content" },
                { id: "localities", label: "Delivery Areas" },
                { id: "faqs", label: "FAQs Manager" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`border-b-2 px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSavePage} className="mt-5 space-y-4">
              {/* Tab 1: General & URL */}
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Page Title (Primary Search Term) *
                      </label>
                      <Input
                        value={editingPage.title || ""}
                        onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                        placeholder="e.g. Anniversary Cake Delivery in Guwahati"
                        className="text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        URL Slug *
                      </label>
                      <div className="flex items-center rounded-lg border border-input bg-background px-3 text-xs text-muted-foreground">
                        <span>/</span>
                        <input
                          value={editingPage.slug || ""}
                          onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                          placeholder="anniversary-cake-delivery-in-guwahati"
                          className="w-full bg-transparent px-1 py-2 text-foreground outline-hidden font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Product Category
                      </label>
                      <Select
                        value={editingPage.categorySlug || "cakes"}
                        onValueChange={(val) => setEditingPage({ ...editingPage, categorySlug: val })}
                      >
                        <SelectTrigger className="w-full h-9 text-xs">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cakes">Cakes</SelectItem>
                          <SelectItem value="flowers">Flowers</SelectItem>
                          <SelectItem value="combos">Combos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Occasion Tag
                      </label>
                      <Select
                        value={editingPage.occasionSlug || "none"}
                        onValueChange={(val) => setEditingPage({ ...editingPage, occasionSlug: val === "none" ? null : val })}
                      >
                        <SelectTrigger className="w-full h-9 text-xs">
                          <SelectValue placeholder="Occasion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None / General</SelectItem>
                          <SelectItem value="birthday">Birthday</SelectItem>
                          <SelectItem value="anniversary">Anniversary</SelectItem>
                          <SelectItem value="love-and-romance">Love & Romance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Flavor / Type Highlight
                      </label>
                      <Input
                        value={editingPage.flavorOrType || ""}
                        onChange={(e) => setEditingPage({ ...editingPage, flavorOrType: e.target.value || null })}
                        placeholder="e.g. chocolate, photo, bento"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Hero Delivery Badge Text
                      </label>
                      <Input
                        value={editingPage.badgeText || ""}
                        onChange={(e) => setEditingPage({ ...editingPage, badgeText: e.target.value })}
                        placeholder="e.g. Same-Day & Midnight Delivery across Guwahati"
                        className="text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Target City
                      </label>
                      <Input
                        value={editingPage.city || "Guwahati"}
                        onChange={(e) => setEditingPage({ ...editingPage, city: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                      <input
                        type="checkbox"
                        checked={editingPage.isActive}
                        onChange={(e) => setEditingPage({ ...editingPage, isActive: e.target.checked })}
                        className="h-4 w-4 rounded border-border text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-semibold">Published & Active on Storefront</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Tab 2: SEO Meta & SERP Preview */}
              {activeTab === "seo" && (
                <div className="space-y-4">
                  {/* Google SERP Preview Card */}
                  <div className="rounded-xl border border-border bg-muted/40 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Google Search SERP Preview
                    </span>
                    <div className="mt-2 space-y-1 font-sans">
                      <div className="text-xs text-muted-foreground">
                        https://mypetalscart.com › {editingPage.slug || "example-slug"}
                      </div>
                      <div className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
                        {editingPage.metaTitle || editingPage.title || "Page Meta Title"}
                      </div>
                      <div className="text-xs text-foreground line-clamp-2">
                        {editingPage.metaDescription || "Order fresh cakes and flowers in Guwahati with same-day and midnight delivery. Handcrafted cakes delivered across Dispur, GS Road, and Beltola."}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-foreground">
                        Meta Title (SEO Title Tag)
                      </label>
                      <span className="text-[10px] text-muted-foreground">
                        {(editingPage.metaTitle || "").length} / 60 characters
                      </span>
                    </div>
                    <Input
                      value={editingPage.metaTitle || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                      placeholder="e.g. Anniversary Cake Delivery in Guwahati | Same-Day & Midnight Surprise"
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-foreground">
                        Meta Description (Search Snippet)
                      </label>
                      <span className="text-[10px] text-muted-foreground">
                        {(editingPage.metaDescription || "").length} / 160 characters
                      </span>
                    </div>
                    <textarea
                      value={editingPage.metaDescription || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                      rows={3}
                      placeholder="e.g. Order romantic anniversary cakes online in Guwahati. Fresh red velvet, Belgian chocolate, heart shapes & photo cakes delivered across GS Road, Zoo Road, Beltola & Dispur."
                      className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Popular Search Keywords (comma-separated tags)
                    </label>
                    <Input
                      value={(editingPage.popularKeywords || []).join(", ")}
                      onChange={(e) =>
                        setEditingPage({
                          ...editingPage,
                          popularKeywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="anniversary cake guwahati, red velvet heart, romantic cake"
                      className="text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Headings & Content */}
              {activeTab === "content" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Hero H1 Heading *
                    </label>
                    <Input
                      value={editingPage.heading || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, heading: e.target.value })}
                      placeholder="e.g. Handcrafted Anniversary Cakes Delivered Across Guwahati"
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Hero Subtitle Description
                    </label>
                    <textarea
                      value={editingPage.subheading || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, subheading: e.target.value })}
                      rows={2}
                      placeholder="e.g. Celebrate your love story with handcrafted heart-shaped red velvets..."
                      className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Introduction Narrative (Hero Intro Section)
                    </label>
                    <textarea
                      value={editingPage.introHtml || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, introHtml: e.target.value })}
                      rows={4}
                      placeholder="Write an engaging overview introducing this category/service in Guwahati..."
                      className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground outline-hidden font-mono focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Comprehensive Editorial Body Copy (SEO Informational Section)
                    </label>
                    <textarea
                      value={editingPage.contentBody || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, contentBody: e.target.value })}
                      rows={5}
                      placeholder="Detailed background regarding baking techniques, ingredient freshness, delivery guarantees..."
                      className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground outline-hidden font-mono focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Tab 4: Localities */}
              {activeTab === "localities" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-muted/40 p-4">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-foreground">
                      <MapPin className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                      <span>Guwahati Delivery Hubs & Localities</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      These areas will be rendered in the delivery coverage pills on the storefront page. Enter comma-separated neighborhoods:
                    </p>
                    <textarea
                      value={(editingPage.deliveryAreas || []).join(", ")}
                      onChange={(e) =>
                        setEditingPage({
                          ...editingPage,
                          deliveryAreas: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      rows={4}
                      className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground outline-hidden font-mono focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(editingPage.deliveryAreas || []).map((area, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] text-foreground"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: FAQs */}
              {activeTab === "faqs" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Frequently Asked Questions</h4>
                      <p className="text-[11px] text-muted-foreground">
                        Populates Schema.org FAQPage structured data and storefront FAQ accordion.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddFaq}
                      variant="outline"
                      className="border-border bg-card text-foreground hover:bg-muted text-xs"
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      <span>Add Question</span>
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {(editingPage.faqs || []).map((faq, index) => (
                      <div key={index} className="rounded-xl border border-border bg-muted/30 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Question #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(index)}
                            className="text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 text-xs"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <Input
                          value={faq.q}
                          onChange={(e) => handleUpdateFaq(index, "q", e.target.value)}
                          placeholder="e.g. Do you deliver cakes after midnight in Guwahati?"
                          className="text-xs"
                        />
                        <textarea
                          value={faq.a}
                          onChange={(e) => handleUpdateFaq(index, "a", e.target.value)}
                          rows={2}
                          placeholder="Answer details..."
                          className="w-full rounded-lg border border-input bg-background p-2 text-xs text-foreground outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between border-t border-border pt-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-border bg-card text-foreground hover:bg-muted text-xs"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 shadow-xs"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="mr-1.5 h-3.5 w-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
