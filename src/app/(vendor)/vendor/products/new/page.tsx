"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  Package,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";

const PRESET_IMAGES = [
  { label: "Pink Rose Bouquet", url: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80" },
  { label: "Red Roses Arrangement", url: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80" },
  { label: "Chocolate Ganache Cake", url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80" },
  { label: "Velvet Heart Cake", url: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80" },
  { label: "Celebration Combo", url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80" },
];

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [occasions, setOccasions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productType, setProductType] = useState("CAKES");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("799");
  const [compareAtPrice, setCompareAtPrice] = useState("999");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState("60");
  const [isEgglessAvailable, setIsEgglessAvailable] = useState(true);
  const [isCustomMessageSupported, setIsCustomMessageSupported] = useState(true);
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[2].url);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);

  // Variants state
  const [variants, setVariants] = useState([
    { name: "0.5 kg (Regular)", price: "799", compareAtPrice: "999", stock: "30" },
    { name: "1.0 kg (Grand)", price: "1449", compareAtPrice: "1699", stock: "20" },
  ]);

  useEffect(() => {
    // Fetch categories and occasions
    fetch("/api/catalog/meta")
      .then((r) => r.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories[0]) setCategoryId(data.categories[0].id);
        }
        if (data.occasions) {
          setOccasions(data.occasions);
        }
      })
      .catch(() => {});
  }, []);

  const addVariant = () => {
    setVariants([...variants, { name: "Custom Size", price: "999", compareAtPrice: "", stock: "20" }]);
  };

  const removeVariant = (idx: number) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const updateVariant = (idx: number, field: string, val: string) => {
    const copy = [...variants];
    copy[idx] = { ...copy[idx], [field]: val };
    setVariants(copy);
  };

  const toggleOccasion = (id: string) => {
    if (selectedOccasions.includes(id)) {
      setSelectedOccasions(selectedOccasions.filter((x) => x !== id));
    } else {
      setSelectedOccasions([...selectedOccasions, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const finalImage = customImageUrl.trim() || selectedImage;
      const payload = {
        title,
        description,
        productType,
        categoryId: categoryId || (categories[0]?.id ?? ""),
        basePrice: Number(basePrice),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        prepTimeMinutes: Number(prepTimeMinutes),
        isEgglessAvailable,
        isCustomMessageSupported,
        images: [finalImage],
        occasionIds: selectedOccasions,
        variants: variants.map((v) => ({
          name: v.name,
          price: Number(v.price),
          compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
          stock: Number(v.stock) || 50,
        })),
      };

      const res = await fetch("/api/vendor/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/vendor/products");
    } catch (err: any) {
      setError(err.message || "Failed to submit product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/vendor/products"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-serif text-zinc-900">
            Publish New Artisan Product
          </h1>
          <p className="text-xs text-zinc-500">
            Add flowers, gourmet cakes, or combos to the marketplace catalog.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
            1. Product Specifications
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-700">Product Title *</label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pistachio Raspberry Mousse Cake"
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700">Product Type</label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="mt-1 flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="CAKES">🎂 Gourmet Cake</option>
                <option value="FLOWERS">🌹 Fresh Flowers</option>
                <option value="COMBOS">🎁 Flower + Cake Combo</option>
                <option value="GIFTS">✨ Personalized Gift</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-700">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe flavor notes, ingredients, floral stem quality..."
                className="mt-1 flex w-full rounded-lg border border-zinc-200 bg-white p-3 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Operations */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
            2. Pricing & Kitchen Preparation
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700">Base Price (₹) *</label>
              <Input
                required
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="mt-1 text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700">Original / Compare Price (₹)</label>
              <Input
                type="number"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="Strike-through price"
                className="mt-1 text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700">Prep Time (Minutes)</label>
              <Input
                type="number"
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(e.target.value)}
                className="mt-1 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
            <label className="flex items-center gap-2 rounded-xl border border-zinc-200 p-3 cursor-pointer hover:bg-zinc-50">
              <input
                type="checkbox"
                checked={isEgglessAvailable}
                onChange={(e) => setIsEgglessAvailable(e.target.checked)}
                className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-zinc-900">
                🌱 100% Eggless Option Available (+₹100)
              </span>
            </label>

            <label className="flex items-center gap-2 rounded-xl border border-zinc-200 p-3 cursor-pointer hover:bg-zinc-50">
              <input
                type="checkbox"
                checked={isCustomMessageSupported}
                onChange={(e) => setIsCustomMessageSupported(e.target.checked)}
                className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="text-xs font-semibold text-zinc-900">
                🎂 Custom Piping Message on Cake Allowed
              </span>
            </label>
          </div>
        </div>

        {/* Product Variants */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
              3. Size / Weight Variants
            </h3>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Variant</span>
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-zinc-100 p-3 bg-zinc-50/60">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Variant Name</label>
                  <Input
                    value={v.name}
                    onChange={(e) => updateVariant(i, "name", e.target.value)}
                    className="mt-0.5 text-xs bg-white"
                  />
                </div>
                <div className="w-28">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Price (₹)</label>
                  <Input
                    type="number"
                    value={v.price}
                    onChange={(e) => updateVariant(i, "price", e.target.value)}
                    className="mt-0.5 text-xs bg-white font-mono"
                  />
                </div>
                <div className="w-24">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Stock</label>
                  <Input
                    type="number"
                    value={v.stock}
                    onChange={(e) => updateVariant(i, "stock", e.target.value)}
                    className="mt-0.5 text-xs bg-white font-mono"
                  />
                </div>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="mt-4 p-1 text-zinc-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Photography */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-rose-600" />
            <span>4. Product Image Selection</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {PRESET_IMAGES.map((img) => (
              <div
                key={img.url}
                onClick={() => {
                  setSelectedImage(img.url);
                  setCustomImageUrl("");
                }}
                className={`relative aspect-square rounded-xl overflow-hidden border cursor-pointer transition ${
                  selectedImage === img.url && !customImageUrl
                    ? "border-rose-600 ring-2 ring-rose-500"
                    : "border-zinc-200 hover:opacity-90"
                }`}
              >
                <img src={img.url} alt={img.label} className="h-full w-full object-cover" />
                <span className="absolute bottom-1 left-1 right-1 rounded bg-black/60 px-1 py-0.5 text-[9px] text-white text-center truncate">
                  {img.label}
                </span>
              </div>
            ))}
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700">Or Paste Custom Image URL</label>
            <Input
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="mt-1 text-xs"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/vendor/products">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading} size="lg" className="px-8 font-bold">
            {loading ? "Publishing..." : "Publish Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
