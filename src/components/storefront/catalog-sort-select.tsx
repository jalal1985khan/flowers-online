"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

interface CatalogSortSelectProps {
  currentSort?: string;
  totalCount: number;
}

export function CatalogSortSelect({ currentSort = "newest", totalCount }: CatalogSortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "newest") {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-zinc-200/90 rounded-2xl px-4 py-3 shadow-xs mb-6">
      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-700">
        <span className="font-bold text-zinc-900">{totalCount}</span>
        <span>{totalCount === 1 ? "Product found" : "Products available"}</span>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <label htmlFor="catalog-sort" className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 whitespace-nowrap">
          <ArrowUpDown className="h-3.5 w-3.5 text-rose-600" />
          <span>Sort by:</span>
        </label>
        <select
          id="catalog-sort"
          value={currentSort || "newest"}
          onChange={handleSortChange}
          className="rounded-xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-900 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 transition cursor-pointer"
        >
          <option value="newest">Featured / Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title-asc">Name: A to Z</option>
        </select>
      </div>
    </div>
  );
}
