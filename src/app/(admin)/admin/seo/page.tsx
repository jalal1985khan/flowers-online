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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
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
            className="border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 text-xs"
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span>Sync All 43 Pages</span>
          </Button>

          <Button
            onClick={openNewPageModal}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            <span>New Landing Page</span>
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-xs text-zinc-400">Total SEO Pages</p>
          <p className="mt-1 text-2xl font-bold font-mono text-white">{totalCount}</p>
          <p className="text-[11px] text-blue-400">43 High-Intent Keywords</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-xs text-zinc-400">Live & Published</p>
          <p className="mt-1 text-2xl font-bold font-mono text-emerald-400">{activeCount}</p>
          <p className="text-[11px] text-emerald-500">Accessible by Google & users</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-xs text-zinc-400">Target Region</p>
          <p className="mt-1 text-lg font-bold text-white">Guwahati</p>
          <p className="text-[11px] text-zinc-400">40+ Local Delivery Hubs</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-xs text-zinc-400">Structured Data</p>
          <p className="mt-1 text-lg font-bold text-amber-400">Schema.org</p>
          <p className="text-[11px] text-zinc-400">JSON-LD + FAQPage Rich Snippet</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword, title, slug..."
            className="border-zinc-800 bg-zinc-900/90 pl-9 text-xs text-zinc-100 placeholder:text-zinc-500"
          />
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="cakes">Cakes</option>
            <option value="flowers">Flowers</option>
            <option value="combos">Combos</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 outline-hidden"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Draft / Inactive</option>
          </select>
        </div>
      </div>

      {/* Pages Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-xs text-zinc-400">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-blue-400 mb-2" />
            Loading SEO landing pages...
          </div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-400">
            <Globe className="mx-auto h-8 w-8 text-zinc-600 mb-2" />
            <p className="font-semibold text-zinc-300">No SEO pages match your filters.</p>
            <p className="mt-1 text-zinc-500">Click &quot;Sync All 43 Pages&quot; to restore default pages or create a new one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Page Title & Keyword</th>
                  <th className="px-4 py-3">Live URL Slug</th>
                  <th className="px-4 py-3">Category / Occasion</th>
                  <th className="px-4 py-3">Delivery Areas</th>
                  <th className="px-4 py-3">FAQs</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-zinc-900/50 transition">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white">{page.title}</div>
                      <div className="text-[11px] text-zinc-400 line-clamp-1">{page.heading}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <code className="rounded bg-zinc-800/80 px-2 py-0.5 font-mono text-[11px] text-blue-300">
                        /{page.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold uppercase text-zinc-300">
                        {page.categorySlug || "All"}
                      </span>
                      {page.occasionSlug && (
                        <span className="ml-1.5 inline-block text-[10px] text-zinc-400">
                          ({page.occasionSlug})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-rose-400" />
                        <span>{page.deliveryAreas?.length || 0} Areas</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400">
                      <span className="flex items-center gap-1">
                        <HelpCircle className="h-3 w-3 text-amber-400" />
                        <span>{page.faqs?.length || 0} Q&As</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleToggleActive(page)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition ${
                          page.isActive
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700"
                        }`}
                      >
                        {page.isActive ? (
                          <>
                            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-2.5 w-2.5 text-zinc-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-zinc-700 bg-zinc-800 p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
                          title="Preview Live Page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => openEditModal(page)}
                          className="rounded-lg border border-blue-600/40 bg-blue-950/60 p-1.5 text-blue-300 hover:text-white hover:bg-blue-600 transition"
                          title="Edit Page Content"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePage(page)}
                          className="rounded-lg border border-zinc-800 p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                          title="Delete Page"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Create Page Modal */}
      {isModalOpen && editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl border border-zinc-700 bg-zinc-950 p-6 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingPage.id ? `Edit Landing Page: ${editingPage.title}` : "Create New SEO Landing Page"}
                </h3>
                <p className="text-xs text-zinc-400">
                  Configure search engine optimization, content narrative, FAQs, and local delivery properties.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-zinc-800 pt-3">
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
                  className={`border-b-2 px-3.5 py-2 text-xs font-semibold transition ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
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
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Page Title (Primary Search Term) *
                      </label>
                      <Input
                        value={editingPage.title || ""}
                        onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                        placeholder="e.g. Anniversary Cake Delivery in Guwahati"
                        className="border-zinc-800 bg-zinc-900 text-xs text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        URL Slug *
                      </label>
                      <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-400">
                        <span>/</span>
                        <input
                          value={editingPage.slug || ""}
                          onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                          placeholder="anniversary-cake-delivery-in-guwahati"
                          className="w-full bg-transparent px-1 py-2 text-white outline-hidden font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Product Category
                      </label>
                      <select
                        value={editingPage.categorySlug || "cakes"}
                        onChange={(e) => setEditingPage({ ...editingPage, categorySlug: e.target.value })}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-xs text-white"
                      >
                        <option value="cakes">Cakes</option>
                        <option value="flowers">Flowers</option>
                        <option value="combos">Combos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Occasion Tag
                      </label>
                      <select
                        value={editingPage.occasionSlug || ""}
                        onChange={(e) => setEditingPage({ ...editingPage, occasionSlug: e.target.value || null })}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-xs text-white"
                      >
                        <option value="">None / General</option>
                        <option value="birthday">Birthday</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="love-and-romance">Love & Romance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Flavor / Type Highlight
                      </label>
                      <Input
                        value={editingPage.flavorOrType || ""}
                        onChange={(e) => setEditingPage({ ...editingPage, flavorOrType: e.target.value || null })}
                        placeholder="e.g. chocolate, photo, bento"
                        className="border-zinc-800 bg-zinc-900 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Hero Delivery Badge Text
                      </label>
                      <Input
                        value={editingPage.badgeText || ""}
                        onChange={(e) => setEditingPage({ ...editingPage, badgeText: e.target.value })}
                        placeholder="e.g. Same-Day & Midnight Delivery across Guwahati"
                        className="border-zinc-800 bg-zinc-900 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Target City
                      </label>
                      <Input
                        value={editingPage.city || "Guwahati"}
                        onChange={(e) => setEditingPage({ ...editingPage, city: e.target.value })}
                        className="border-zinc-800 bg-zinc-900 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
                      <input
                        type="checkbox"
                        checked={editingPage.isActive}
                        onChange={(e) => setEditingPage({ ...editingPage, isActive: e.target.checked })}
                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500"
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
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Google Search SERP Preview
                    </span>
                    <div className="mt-2 space-y-1 font-sans">
                      <div className="text-xs text-zinc-400">
                        https://bloomandbakes.com › {editingPage.slug || "example-slug"}
                      </div>
                      <div className="text-base font-medium text-blue-400 hover:underline cursor-pointer line-clamp-1">
                        {editingPage.metaTitle || editingPage.title || "Page Meta Title"}
                      </div>
                      <div className="text-xs text-zinc-300 line-clamp-2">
                        {editingPage.metaDescription || "Order fresh cakes and flowers in Guwahati with same-day and midnight delivery. Handcrafted cakes delivered across Dispur, GS Road, and Beltola."}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-zinc-300">
                        Meta Title (SEO Title Tag)
                      </label>
                      <span className="text-[10px] text-zinc-500">
                        {(editingPage.metaTitle || "").length} / 60 characters
                      </span>
                    </div>
                    <Input
                      value={editingPage.metaTitle || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                      placeholder="e.g. Anniversary Cake Delivery in Guwahati | Same-Day & Midnight Surprise"
                      className="border-zinc-800 bg-zinc-900 text-xs text-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-zinc-300">
                        Meta Description (Search Snippet)
                      </label>
                      <span className="text-[10px] text-zinc-500">
                        {(editingPage.metaDescription || "").length} / 160 characters
                      </span>
                    </div>
                    <textarea
                      value={editingPage.metaDescription || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                      rows={3}
                      placeholder="e.g. Order romantic anniversary cakes online in Guwahati. Fresh red velvet, Belgian chocolate, heart shapes & photo cakes delivered across GS Road, Zoo Road, Beltola & Dispur."
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-white outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
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
                      className="border-zinc-800 bg-zinc-900 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Headings & Content */}
              {activeTab === "content" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Hero H1 Heading *
                    </label>
                    <Input
                      value={editingPage.heading || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, heading: e.target.value })}
                      placeholder="e.g. Handcrafted Anniversary Cakes Delivered Across Guwahati"
                      className="border-zinc-800 bg-zinc-900 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Hero Subtitle Description
                    </label>
                    <textarea
                      value={editingPage.subheading || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, subheading: e.target.value })}
                      rows={2}
                      placeholder="e.g. Celebrate your love story with handcrafted heart-shaped red velvets..."
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-white outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Introduction Narrative (Hero Intro Section)
                    </label>
                    <textarea
                      value={editingPage.introHtml || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, introHtml: e.target.value })}
                      rows={4}
                      placeholder="Write an engaging overview introducing this category/service in Guwahati..."
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-white outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Comprehensive Editorial Body Copy (SEO Informational Section)
                    </label>
                    <textarea
                      value={editingPage.contentBody || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, contentBody: e.target.value })}
                      rows={5}
                      placeholder="Detailed background regarding baking techniques, ingredient freshness, delivery guarantees..."
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-white outline-hidden font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Tab 4: Localities */}
              {activeTab === "localities" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-white">
                      <MapPin className="h-4 w-4 text-rose-400" />
                      <span>Guwahati Delivery Hubs & Localities</span>
                    </div>
                    <p className="text-xs text-zinc-400 mb-3">
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
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-white outline-hidden font-mono"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(editingPage.deliveryAreas || []).map((area, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-[11px] text-zinc-300"
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
                      <h4 className="text-xs font-bold text-white">Frequently Asked Questions</h4>
                      <p className="text-[11px] text-zinc-400">
                        Populates Schema.org FAQPage structured data and storefront FAQ accordion.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddFaq}
                      variant="outline"
                      className="border-zinc-700 bg-zinc-800 text-xs text-zinc-200 hover:bg-zinc-700"
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      <span>Add Question</span>
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {(editingPage.faqs || []).map((faq, index) => (
                      <div key={index} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-400">Question #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(index)}
                            className="text-zinc-500 hover:text-rose-400 text-xs"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <Input
                          value={faq.q}
                          onChange={(e) => handleUpdateFaq(index, "q", e.target.value)}
                          placeholder="e.g. Do you deliver cakes after midnight in Guwahati?"
                          className="border-zinc-800 bg-zinc-950 text-xs text-white"
                        />
                        <textarea
                          value={faq.a}
                          onChange={(e) => handleUpdateFaq(index, "a", e.target.value)}
                          rows={2}
                          placeholder="Answer details..."
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-200 outline-hidden"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5"
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
