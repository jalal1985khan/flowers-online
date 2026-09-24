"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Sparkles, ArrowRight } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface SearchResult {
  products: Array<{
    id: string;
    title: string;
    slug: string;
    basePrice: number;
    image: string;
    categoryName: string;
  }>;
  categories: Array<{ id: string; name: string; slug: string }>;
  occasions: Array<{ id: string; name: string; slug: string }>;
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const hasAnyResults =
    results &&
    (results.products.length > 0 ||
      results.categories.length > 0 ||
      results.occasions.length > 0);

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (hasAnyResults) setIsOpen(true);
          }}
          placeholder="Search flowers, cakes, combos..."
          className="w-full rounded-full border border-zinc-200 bg-zinc-50/70 pl-9 pr-9 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults(null);
              setIsOpen(false);
            }}
            className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && results && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-zinc-200 bg-white p-3 shadow-2xl space-y-3">
          {/* Quick Categories/Occasions pills */}
          {(results.categories.length > 0 || results.occasions.length > 0) && (
            <div className="flex flex-wrap gap-1.5 pb-2 border-b border-zinc-100">
              {results.categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/catalog?category=${c.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-800 hover:bg-rose-100"
                >
                  Category: {c.name}
                </Link>
              ))}
              {results.occasions.map((o) => (
                <Link
                  key={o.id}
                  href={`/catalog?occasion=${o.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-100"
                >
                  Occasion: {o.name}
                </Link>
              ))}
            </div>
          )}

          {/* Products list */}
          {results.products.length > 0 ? (
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2">
                Matching Blooms & Bakes
              </div>
              {results.products.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl p-2 hover:bg-rose-50/50 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-10 w-10 rounded-lg object-cover bg-zinc-100"
                    />
                    <div>
                      <div className="text-xs font-bold text-zinc-900 group-hover:text-rose-600 transition line-clamp-1">
                        {p.title}
                      </div>
                      <div className="text-[10px] text-zinc-400">{p.categoryName}</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-900">
                    {formatINR(p.basePrice)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-zinc-400">
              No matching products found for "{query}"
            </div>
          )}

          {/* View all link */}
          <div className="border-t border-zinc-100 pt-2 text-center">
            <Link
              href={`/search?q=${encodeURIComponent(query.trim())}`}
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              <span>View all results for "{query}"</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
