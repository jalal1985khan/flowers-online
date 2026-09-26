"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Cloud,
  Layers,
  FolderOpen,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MediaItem {
  url: string;
  title: string;
  category: string;
  source: "preset" | "addon" | "product";
}

interface MediaImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export function MediaImagePicker({
  value,
  onChange,
  folder = "/bloom-bakes/addons",
}: MediaImagePickerProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "library" | "presets">("upload");
  const [targetCdn, setTargetCdn] = useState<"imagekit" | "cloudinary">("imagekit");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Library state
  const [libraryImages, setLibraryImages] = useState<MediaItem[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [libraryCategories, setLibraryCategories] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detect image CDN origin for badge
  const getCdnBadge = (url: string) => {
    if (!url) return null;
    if (url.includes("ik.imagekit.io")) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full">
          <Cloud className="size-2.5" />
          ImageKit CDN
        </span>
      );
    }
    if (url.includes("res.cloudinary.com")) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
          <Cloud className="size-2.5" />
          Cloudinary CDN
        </span>
      );
    }
    if (url.startsWith("/")) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200 px-2 py-0.5 rounded-full">
          Catalog Preset
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
        External URL
      </span>
    );
  };

  // Fetch library images when library tab is opened
  useEffect(() => {
    if (activeTab === "library" && libraryImages.length === 0) {
      setLoadingLibrary(true);
      fetch("/api/media/library")
        .then((res) => res.json())
        .then((data) => {
          if (data.images) {
            setLibraryImages(data.images);
            if (data.categories) {
              setLibraryCategories(data.categories);
            }
          }
        })
        .catch((err) => console.error("Failed to load media library:", err))
        .finally(() => setLoadingLibrary(false));
    }
  }, [activeTab, libraryImages.length]);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("cdn", targetCdn);
      formData.append("folder", folder);

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image");

      onChange(data.url);
      setUploadSuccess(
        `Uploaded successfully to ${data.cdn === "cloudinary" ? "Cloudinary" : "ImageKit"}!`
      );
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      setUploadError(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file);
    }
  };

  // Filter library items
  const filteredLibrary = libraryImages.filter((item) => {
    if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
      return false;
    }
    if (librarySearch.trim()) {
      const q = librarySearch.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-3">
      {/* Current Image Preview & Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
          <span>Add-on Image</span>
          <span className="text-rose-500">*</span>
        </label>
        {value && getCdnBadge(value)}
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50/80 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-semibold transition ${
            activeTab === "upload"
              ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/80"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <Upload className="size-3.5 text-rose-600" />
          <span>Upload Image</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("library")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-semibold transition ${
            activeTab === "library"
              ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/80"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <FolderOpen className="size-3.5 text-rose-600" />
          <span>Image Library</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("presets")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-semibold transition ${
            activeTab === "presets"
              ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/80"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <LinkIcon className="size-3.5 text-rose-600" />
          <span>Presets & URL</span>
        </button>
      </div>

      {/* Tab 1: Upload to ImageKit or Cloudinary */}
      {activeTab === "upload" && (
        <div className="space-y-3 animate-in fade-in duration-150">
          {/* CDN Destination Picker */}
          <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200/80 rounded-lg p-2.5">
            <span className="text-[11px] font-medium text-zinc-600 flex items-center gap-1">
              <Cloud className="size-3 text-zinc-500" />
              Upload Destination:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setTargetCdn("imagekit")}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition ${
                  targetCdn === "imagekit"
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                ImageKit CDN
              </button>
              <button
                type="button"
                onClick={() => setTargetCdn("cloudinary")}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition ${
                  targetCdn === "cloudinary"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                Cloudinary CDN
              </button>
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition text-center ${
              uploading
                ? "border-rose-400 bg-rose-50/30 pointer-events-none"
                : "border-zinc-300 hover:border-rose-500 bg-zinc-50/50 hover:bg-rose-50/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
              className="hidden"
            />

            {uploading ? (
              <div className="space-y-2">
                <RefreshCw className="size-7 animate-spin mx-auto text-rose-600" />
                <p className="text-xs font-semibold text-zinc-800">
                  Uploading to {targetCdn === "cloudinary" ? "Cloudinary" : "ImageKit"}...
                </p>
                <p className="text-[10px] text-zinc-500">Optimizing and generating CDN asset</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="size-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
                  <Upload className="size-5" />
                </div>
                <p className="text-xs font-semibold text-zinc-800">
                  Click to browse or drag & drop image
                </p>
                <p className="text-[10px] text-zinc-500">
                  JPG, PNG, WebP up to 10MB • Uploads directly to{" "}
                  <strong className="text-zinc-700">
                    {targetCdn === "cloudinary" ? "Cloudinary CDN" : "ImageKit CDN"}
                  </strong>
                </p>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <span>{uploadSuccess}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Existing Image Library */}
      {activeTab === "library" && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
              <Input
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                placeholder="Search images by name or category..."
                className="pl-8 text-xs h-8"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`px-2.5 py-1 rounded-full shrink-0 font-medium transition ${
                selectedCategory === "ALL"
                  ? "bg-rose-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              All ({libraryImages.length})
            </button>
            {libraryCategories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full shrink-0 font-medium transition ${
                  selectedCategory === cat
                    ? "bg-rose-600 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Library Grid */}
          <div className="max-h-56 overflow-y-auto border border-zinc-200 rounded-xl p-2 bg-zinc-50/50">
            {loadingLibrary ? (
              <div className="p-8 text-center text-xs text-zinc-400 space-y-2">
                <RefreshCw className="size-5 animate-spin mx-auto text-rose-500" />
                <p>Loading image library...</p>
              </div>
            ) : filteredLibrary.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500">
                No images matching your search criteria.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {filteredLibrary.map((item, idx) => {
                  const isSelected = value === item.url;
                  return (
                    <button
                      key={`${item.url}-${idx}`}
                      type="button"
                      onClick={() => onChange(item.url)}
                      className={`group relative aspect-square rounded-lg border overflow-hidden text-left transition-all ${
                        isSelected
                          ? "border-rose-600 ring-2 ring-rose-600/40"
                          : "border-zinc-200 hover:border-zinc-400 bg-white"
                      }`}
                      title={item.title}
                    >
                      <Image
                        src={item.url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        unoptimized
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1">
                        <p className="text-[10px] font-semibold text-white truncate leading-tight">
                          {item.title}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 size-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
                          <CheckCircle2 className="size-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Presets & Direct URL */}
      {activeTab === "presets" && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="space-y-1">
            <span className="text-[11px] text-zinc-500">Quick Catalog Presets:</span>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {[
                { label: "Ferrero Rocher 16 Pcs", path: "/16-peaces-chocolate.jpeg" },
                { label: "Ferrero Rocher 200 GM", path: "/200gm-chocolate.jpg" },
                { label: "Cuddly Teddy Bear", path: "/teddy.webp" },
                {
                  label: "Party Balloons",
                  path: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
                },
                {
                  label: "Greeting Card",
                  path: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80",
                },
                {
                  label: "Birthday Candle",
                  path: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80",
                },
                {
                  label: "Red Rose Sleeve",
                  path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
                },
              ].map((p) => (
                <button
                  type="button"
                  key={p.path}
                  onClick={() => onChange(p.path)}
                  className={`relative aspect-square rounded-lg border overflow-hidden transition-all ${
                    value === p.path
                      ? "border-rose-600 ring-2 ring-rose-600/30"
                      : "border-zinc-200 hover:border-zinc-400 opacity-70 hover:opacity-100"
                  }`}
                  title={p.label}
                >
                  <Image
                    src={p.path}
                    alt={p.label}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-zinc-500">Custom Image Web URL:</span>
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://... or /preset.jpg"
              className="text-xs h-9 font-mono"
            />
          </div>
        </div>
      )}

      {/* Selected Image Preview Pill */}
      {value && (
        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-2.5">
          <div className="relative size-12 shrink-0 rounded-lg overflow-hidden border border-zinc-200 bg-white">
            <Image
              src={value}
              alt="Selected Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5 truncate">
              <span>Active Image Selected</span>
            </p>
            <p className="text-[10px] text-zinc-500 font-mono truncate">{value}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-zinc-400 hover:text-zinc-600 p-1"
            title="Clear image"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
