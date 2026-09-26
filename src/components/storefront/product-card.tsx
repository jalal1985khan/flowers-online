import React from "react";
import Link from "next/link";
import Image from "next/image";
import { decodeHtmlEntities, formatINR } from "@/lib/utils";
import { Star, Clock, Sparkles } from "lucide-react";

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
  priority?: boolean;
}

export function ProductCard({
  slug,
  title,
  basePrice,
  compareAtPrice,
  image,
  categoryName,
  isEgglessAvailable,
  rating,
  reviewCount,
  tags = [],
  priority = false,
}: ProductCardProps) {
  const discountPercent =
    compareAtPrice && compareAtPrice > basePrice
      ? Math.round(((compareAtPrice - basePrice) / compareAtPrice) * 100)
      : null;

  const showRating =
    typeof rating === "number" && typeof reviewCount === "number" && reviewCount > 0;

  return (
    <Link
      href={`/product/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-xs transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-primary-soft">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}

        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1">
          {tags.includes("Bestseller") && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-primary-foreground shadow-sm">
              <Sparkles className="h-3 w-3" />
              Bestseller
            </span>
          )}
          {isEgglessAvailable && (
            <span className="inline-flex items-center rounded-full bg-success px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
              Eggless Available
            </span>
          )}
        </div>

        {discountPercent ? (
          <div className="absolute right-2.5 top-2.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
            {discountPercent}% OFF
          </div>
        ) : null}

        <div className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-lg bg-card/95 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-xs shadow-xs">
          <span className="flex items-center gap-1 font-semibold text-success">
            <Clock className="h-3 w-3" />
            Today or Midnight
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">Instant Slots</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {categoryName ? (
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            {categoryName}
          </span>
        ) : null}

        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground transition group-hover:text-primary">
          {decodeHtmlEntities(title)}
        </h3>

        {showRating ? (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-0.5 rounded bg-success-soft px-1.5 py-0.5 text-[11px] font-bold text-success">
              <span>{rating.toFixed(1)}</span>
              <Star className="h-3 w-3 fill-success text-success" />
            </div>
            <span>({reviewCount})</span>
          </div>
        ) : null}

        <div className="mt-3 flex items-baseline gap-2 border-t border-border pt-2">
          <span className="text-base font-bold text-foreground">{formatINR(basePrice)}</span>
          {compareAtPrice ? (
            <span className="text-xs text-muted-foreground line-through">
              {formatINR(compareAtPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
