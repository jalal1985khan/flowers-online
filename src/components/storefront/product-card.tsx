import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/utils";
import { Star, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ProductCardProps {
  id: string;
  slug: string;
  title: string;
  productType: string;
  basePrice: number;
  compareAtPrice?: number | null;
  image: string;
  categoryName?: string;
  isEgglessAvailable?: boolean;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
}

export function ProductCard({
  slug,
  title,
  productType,
  basePrice,
  compareAtPrice,
  image,
  categoryName,
  isEgglessAvailable,
  rating = 4.9,
  reviewCount = 42,
  tags = [],
}: ProductCardProps) {
  const discountPercent =
    compareAtPrice && compareAtPrice > basePrice
      ? Math.round(((compareAtPrice - basePrice) / compareAtPrice) * 100)
      : null;

  return (
    <Link
      href={`/product/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-rose-50/50">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {tags.includes("Bestseller") && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-sm">
              <Sparkles className="h-3 w-3" />
              Bestseller
            </span>
          )}
          {isEgglessAvailable && (
            <span className="inline-flex items-center rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-xs">
              🌱 Eggless Available
            </span>
          )}
        </div>

        {discountPercent && (
          <div className="absolute top-2.5 right-2.5 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Delivery pill */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-medium text-zinc-700 backdrop-blur-xs shadow-xs">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <Clock className="h-3 w-3" />
            Today or Midnight
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">Instant Slots</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {categoryName && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
            {categoryName}
          </span>
        )}

        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-rose-600 transition">
          {title}
        </h3>

        {/* Ratings */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
          <div className="flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-700 text-[11px]">
            <span>{rating}</span>
            <Star className="h-3 w-3 fill-emerald-600 text-emerald-600" />
          </div>
          <span>({reviewCount})</span>
        </div>

        {/* Pricing */}
        <div className="mt-3 flex items-baseline gap-2 pt-2 border-t border-zinc-100">
          <span className="text-base font-bold text-zinc-900">
            {formatINR(basePrice)}
          </span>
          {compareAtPrice && (
            <span className="text-xs text-zinc-400 line-through">
              {formatINR(compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
