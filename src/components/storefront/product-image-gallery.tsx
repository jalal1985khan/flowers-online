"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
  isEgglessAvailable?: boolean;
}

export function ProductImageGallery({
  images,
  title,
  isEgglessAvailable,
}: ProductImageGalleryProps) {
  const safeImages = images && images.length > 0 ? images : ["/images/categories/chocolates-sweets.jpg"];
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keep index within bounds if images change
  const currentIndex = selectedIndex >= safeImages.length ? 0 : selectedIndex;
  const currentImage = safeImages[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Hero Product Image */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-zinc-200/80 bg-rose-50/20 shadow-xs">
        <Image
          key={currentImage}
          src={currentImage}
          alt={`${title} view ${currentIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
        />

        {/* Pure Veg / Eggless Badge */}
        {isEgglessAvailable && (
          <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-xs">
            🌱 Pure Vegetarian / Eggless Option
          </span>
        )}

        {/* Counter Badge */}
        {safeImages.length > 1 && (
          <span className="absolute bottom-4 right-4 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xs select-none">
            {currentIndex + 1} / {safeImages.length}
          </span>
        )}

        {/* Left / Right Navigation Controls */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous product image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow-md backdrop-blur-xs transition-all hover:bg-white hover:scale-110 active:scale-95 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next product image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow-md backdrop-blur-xs transition-all hover:bg-white hover:scale-110 active:scale-95 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {safeImages.map((img, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                onMouseEnter={() => setSelectedIndex(idx)}
                aria-label={`View image ${idx + 1} of ${title}`}
                className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/30 ring-offset-1 scale-[1.02] shadow-sm"
                    : "border-zinc-200/90 opacity-75 hover:opacity-100 hover:border-zinc-400"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="100px"
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
