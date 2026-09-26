"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FolderOpen,
  RefreshCw,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Search,
  Cloud,
  AlertTriangle,
  CheckCircle2,
  Layers,
  HardDrive,
  Filter,
  Eye,
  LayoutGrid,
  List,
  Sparkles,
  Info,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  cdn: "imagekit" | "cloudinary";
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
  isUsed: boolean;
  usedIn: string[];
  publicId?: string;
}

interface MediaStats {
  totalCount: number;
  usedCount: number;
  unusedCount: number;
  totalBytes: number;
  unusedBytes: number;
  imagekitCount: number;
  cloudinaryCount: number;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function AdminMediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UNUSED" | "USED">("ALL");
  const [cdnFilter, setCdnFilter] = useState<"ALL" | "IMAGEKIT" | "CLOUDINARY">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Batch deletion of unused
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  // Toast banner
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("filter", statusFilter);
      if (cdnFilter !== "ALL") params.set("cdn", cdnFilter);
      if (searchQuery.trim()) params.set("q", searchQuery.trim());

      const res = await fetch(`/api/admin/media?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load media assets");
      const data = await res.json();
      setItems(data.items || []);
      setStats(data.stats || null);
    } catch {
      showToast("Unable to load cloud media files. Please refresh.", "error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, cdnFilter, searchQuery]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleConfirmSingleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              id: deleteTarget.id,
              cdn: deleteTarget.cdn,
              publicId: deleteTarget.publicId,
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete file");

      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      showToast(`Deleted "${deleteTarget.name}" from ${deleteTarget.cdn === "cloudinary" ? "Cloudinary" : "ImageKit"} storage.`);
      setDeleteTarget(null);
      // Refresh stats
      fetchMedia();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Deletion failed";
      showToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBatchDeleteUnused = async () => {
    const targetItems = items.filter((i) => !i.isUsed && (selectedIds.length === 0 || selectedIds.includes(i.id)));
    if (targetItems.length === 0) return;

    setIsBatchDeleting(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: targetItems.map((i) => ({
            id: i.id,
            cdn: i.cdn,
            publicId: i.publicId,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Batch deletion failed");

      showToast(`Cleaned up ${data.deletedCount} unused images from cloud storage!`);
      setSelectedIds([]);
      setIsBatchModalOpen(false);
      fetchMedia();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Batch cleanup failed";
      showToast(msg, "error");
    } finally {
      setIsBatchDeleting(false);
    }
  };

  const toggleSelectAllUnused = () => {
    const unusedItems = items.filter((i) => !i.isUsed);
    if (selectedIds.length === unusedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(unusedItems.map((i) => i.id));
    }
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-5 ${
            toastMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="size-4 text-rose-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
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
            <span className="text-foreground font-medium">Cloud Media Library</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <FolderOpen className="size-6 text-rose-500" />
            Cloud Media Library & Space Cleanup
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Inspect all assets hosted on ImageKit & Cloudinary. Identify orphaned images not linked to any catalog product or add-on, and delete them to free up cloud storage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMedia}
            disabled={loading}
            className="border-border bg-card text-card-foreground hover:bg-muted text-xs h-9"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Scan Cloud
          </Button>

          {stats && stats.unusedCount > 0 && (
            <Button
              size="sm"
              onClick={() => setIsBatchModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold h-9 shadow-xs"
            >
              <Trash2 className="size-3.5 mr-1.5" />
              Clean Up Unused ({stats.unusedCount})
            </Button>
          )}
        </div>
      </div>

      {/* Quick Metrics Bar */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Total Assets */}
          <Card
            onClick={() => { setStatusFilter("ALL"); setCdnFilter("ALL"); }}
            className={`p-4 transition-colors cursor-pointer ${
              statusFilter === "ALL" && cdnFilter === "ALL"
                ? "ring-2 ring-zinc-500 bg-zinc-500/5"
                : "hover:border-border/80"
            }`}
          >
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium uppercase tracking-wider">Total Cloud Files</span>
              <HardDrive className="size-4 text-zinc-400" />
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground font-mono">{stats.totalCount}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
              Total Storage: {formatBytes(stats.totalBytes)}
            </p>
          </Card>

          {/* Unused / Orphaned Assets (Cleanup Target) */}
          <Card
            onClick={() => setStatusFilter("UNUSED")}
            className={`p-4 transition-colors cursor-pointer border-amber-500/40 ${
              statusFilter === "UNUSED"
                ? "ring-2 ring-amber-500 bg-amber-500/10"
                : "bg-amber-500/5 hover:border-amber-500/80"
            }`}
          >
            <div className="flex items-center justify-between text-amber-700 dark:text-amber-400">
              <span className="text-[11px] font-medium uppercase tracking-wider">Unused (Safe to Clean)</span>
              <AlertTriangle className="size-4 text-amber-600" />
            </div>
            <p className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-400 font-mono">
              {stats.unusedCount}
            </p>
            <p className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold mt-0.5">
              Reclaimable: {formatBytes(stats.unusedBytes)}
            </p>
          </Card>

          {/* In-Use Assets */}
          <Card
            onClick={() => setStatusFilter("USED")}
            className={`p-4 transition-colors cursor-pointer border-emerald-500/40 ${
              statusFilter === "USED"
                ? "ring-2 ring-emerald-500 bg-emerald-500/10"
                : "hover:border-emerald-500/60"
            }`}
          >
            <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
              <span className="text-[11px] font-medium uppercase tracking-wider">In-Use (Catalog)</span>
              <CheckCircle2 className="size-4 text-emerald-600" />
            </div>
            <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">
              {stats.usedCount}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Linked to Products & Add-ons
            </p>
          </Card>

          {/* CDN Provider Distribution */}
          <Card className="p-4">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium uppercase tracking-wider">CDN Providers</span>
              <Cloud className="size-4 text-zinc-400" />
            </div>
            <div className="mt-2 space-y-1 text-xs">
              <div
                onClick={() => setCdnFilter("IMAGEKIT")}
                className="flex items-center justify-between cursor-pointer hover:text-sky-600"
              >
                <span className="flex items-center gap-1 text-[11px]">
                  <span className="size-2 rounded-full bg-sky-500"></span>
                  ImageKit:
                </span>
                <span className="font-mono font-bold">{stats.imagekitCount}</span>
              </div>
              <div
                onClick={() => setCdnFilter("CLOUDINARY")}
                className="flex items-center justify-between cursor-pointer hover:text-indigo-600"
              >
                <span className="flex items-center gap-1 text-[11px]">
                  <span className="size-2 rounded-full bg-indigo-500"></span>
                  Cloudinary:
                </span>
                <span className="font-mono font-bold">{stats.cloudinaryCount}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filter, Search & View Controls */}
      <Card className="p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by filename, URL, or linked product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
              <SelectTrigger className="w-[170px] h-9 text-xs">
                <SelectValue placeholder="Usage Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Files ({stats?.totalCount || 0})</SelectItem>
                <SelectItem value="UNUSED">⚠️ Unused Only ({stats?.unusedCount || 0})</SelectItem>
                <SelectItem value="USED">✅ In-Use Only ({stats?.usedCount || 0})</SelectItem>
              </SelectContent>
            </Select>

            {/* CDN Filter */}
            <Select value={cdnFilter} onValueChange={(val: any) => setCdnFilter(val)}>
              <SelectTrigger className="w-[150px] h-9 text-xs">
                <SelectValue placeholder="All Providers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All CDNs</SelectItem>
                <SelectItem value="IMAGEKIT">ImageKit Only</SelectItem>
                <SelectItem value="CLOUDINARY">Cloudinary Only</SelectItem>
              </SelectContent>
            </Select>

            {/* View Switcher */}
            <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/30">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition ${
                  viewMode === "grid" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid Gallery"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition ${
                  viewMode === "table" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Table View"
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Media Items Display */}
      {loading ? (
        <Card className="p-16 flex flex-col items-center justify-center text-center">
          <RefreshCw className="size-7 animate-spin text-rose-500 mb-3" />
          <p className="text-sm font-semibold text-foreground">Scanning ImageKit & Cloudinary storage...</p>
          <p className="text-xs text-muted-foreground mt-1">Cross-referencing database products, add-ons, and categories.</p>
        </Card>
      ) : items.length === 0 ? (
        <Card className="p-16 text-center space-y-3">
          <div className="size-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
            <FolderOpen className="size-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">No media assets found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try clearing your search query or selecting a different status/CDN filter.
          </p>
        </Card>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {items.map((item) => (
            <Card
              key={item.id}
              className={`group overflow-hidden flex flex-col border transition-all ${
                !item.isUsed
                  ? "border-amber-300 dark:border-amber-900 bg-amber-500/5 hover:border-amber-500"
                  : "border-border hover:border-zinc-400 bg-card"
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-square w-full bg-muted/40 overflow-hidden border-b border-border/50">
                <Image
                  src={item.thumbnail || item.url}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  unoptimized
                />

                {/* CDN Provider Tag */}
                <div className="absolute top-2 left-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs ${
                      item.cdn === "cloudinary"
                        ? "bg-indigo-600 text-white"
                        : "bg-sky-600 text-white"
                    }`}
                  >
                    {item.cdn === "cloudinary" ? "Cloudinary" : "ImageKit"}
                  </span>
                </div>

                {/* Usage Status Pill */}
                <div className="absolute top-2 right-2">
                  {!item.isUsed ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-xs">
                      <AlertTriangle className="size-2.5" />
                      Unused
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-semibold bg-emerald-600 text-white px-1.5 py-0.5 rounded shadow-xs">
                      <Check className="size-2.5" />
                      In Use
                    </span>
                  )}
                </div>

                {/* Hover overlay quick buttons */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url)}
                    className="size-8 rounded-full bg-white text-zinc-800 flex items-center justify-center hover:bg-zinc-100 shadow-md"
                    title="Copy URL"
                  >
                    {copiedUrl === item.url ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-8 rounded-full bg-white text-zinc-800 flex items-center justify-center hover:bg-zinc-100 shadow-md"
                    title="View Full Size"
                  >
                    <ExternalLink className="size-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="size-8 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shadow-md"
                    title="Delete File from CDN"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              {/* Card Meta Details */}
              <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {formatBytes(item.size)} {item.width && item.height ? `• ${item.width}×${item.height}` : ""}
                  </p>
                </div>

                {/* Where it is used */}
                <div className="pt-1 border-t border-border/40 text-[10px]">
                  {item.isUsed ? (
                    <div className="text-emerald-700 dark:text-emerald-400 font-medium truncate" title={item.usedIn.join(", ")}>
                      {item.usedIn[0]}
                      {item.usedIn.length > 1 && ` (+${item.usedIn.length - 1} more)`}
                    </div>
                  ) : (
                    <div className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="size-2.5 shrink-0" />
                      <span>Orphaned (Safe to delete)</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <Card className="overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              <TableRow className="border-border">
                <TableHead className="w-14">Image</TableHead>
                <TableHead>Filename & CDN</TableHead>
                <TableHead>Size & Resolution</TableHead>
                <TableHead>Usage in Catalog</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow
                  key={item.id}
                  className={`border-border hover:bg-muted/40 transition-colors ${
                    !item.isUsed ? "bg-amber-500/5 dark:bg-amber-950/20" : ""
                  }`}
                >
                  <TableCell>
                    <div className="relative size-12 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                      <Image
                        src={item.thumbnail || item.url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-foreground">{item.name}</p>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            item.cdn === "cloudinary"
                              ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                              : "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                          }`}
                        >
                          {item.cdn === "cloudinary" ? "Cloudinary" : "ImageKit"}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono truncate max-w-xs">
                          {item.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-mono">
                      <p className="font-semibold text-foreground">{formatBytes(item.size)}</p>
                      {item.width && item.height && (
                        <p className="text-[10px] text-muted-foreground">{item.width} × {item.height}px</p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {item.isUsed ? (
                      <div className="space-y-0.5 max-w-xs">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                          <Check className="size-2.5" />
                          In Use
                        </span>
                        <p className="text-[11px] text-muted-foreground truncate" title={item.usedIn.join(", ")}>
                          {item.usedIn.join(", ")}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="size-2.5" />
                          Unused (Orphan)
                        </span>
                        <p className="text-[10px] text-amber-700 dark:text-amber-400">
                          Reclaim {formatBytes(item.size)}
                        </p>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(item.url)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        title="Copy URL"
                      >
                        {copiedUrl === item.url ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                      </Button>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                        title="Open image"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(item)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                        title="Delete from cloud"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Single File Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Permanently Delete from {deleteTarget.cdn === "cloudinary" ? "Cloudinary" : "ImageKit"}?
                </h3>
                <p className="text-xs text-muted-foreground">
                  This action removes the file from cloud storage immediately.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border p-3 bg-muted/40 flex items-center gap-3">
              <div className="relative size-12 rounded-lg overflow-hidden border border-border bg-card shrink-0">
                <Image
                  src={deleteTarget.thumbnail || deleteTarget.url}
                  alt={deleteTarget.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{deleteTarget.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">
                  {formatBytes(deleteTarget.size)} • {deleteTarget.cdn.toUpperCase()}
                </p>
              </div>
            </div>

            {deleteTarget.isUsed && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-rose-900">
                  <AlertTriangle className="size-3.5 text-rose-600" />
                  Warning: File is currently in use!
                </p>
                <p>
                  This image is actively referenced in: <strong>{deleteTarget.usedIn.join(", ")}</strong>. Deleting it may cause a broken image on the storefront.
                </p>
              </div>
            )}

            {!deleteTarget.isUsed && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>This file is orphaned and not used anywhere in the store. Safe to delete!</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmSingleDelete}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                {isDeleting ? "Deleting from Cloud..." : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Cleanup Modal */}
      {isBatchModalOpen && stats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Clean Up All Unused Cloud Media</h3>
                <p className="text-xs text-muted-foreground">
                  Free up storage by deleting orphaned assets that are not referenced in the catalog.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-500/10 p-4 space-y-2 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex justify-between items-center font-bold">
                <span>Orphaned Files Detected:</span>
                <span className="font-mono text-base">{stats.unusedCount} Files</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span>Total Space to Reclaim:</span>
                <span className="font-mono text-base text-emerald-600 dark:text-emerald-400">
                  {formatBytes(stats.unusedBytes)}
                </span>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300/80 pt-1 border-t border-amber-200/60">
                These files were found in ImageKit or Cloudinary but are not linked to any active product, add-on, or category in your store.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBatchModalOpen(false)}
                disabled={isBatchDeleting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleBatchDeleteUnused}
                disabled={isBatchDeleting || stats.unusedCount === 0}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
              >
                {isBatchDeleting
                  ? "Cleaning up Storage..."
                  : `Delete ${stats.unusedCount} Unused Files (${formatBytes(stats.unusedBytes)})`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
