"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Search,
  Zap,
  Layers,
  History,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

export default function AIGrowthDashboardPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Content Playground state
  const [inputTitle, setInputTitle] = useState("Mango Mascarpone Silk Cake");
  const [inputType, setInputType] = useState("CAKES");
  const [inputFlavor, setInputFlavor] = useState("Alphonso mangoes, mascarpone cream & vanilla sponge");
  const [inputOccasion, setInputOccasion] = useState("Birthday");
  const [generating, setGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchRecs();
  }, []);

  const fetchRecs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/recommendations");
      const data = await res.json();
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "APPROVE" | "APPLY" | "REJECT") => {
    try {
      const res = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        fetchRecs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: inputTitle,
          productType: inputType,
          flavorOrFlowers: inputFlavor,
          occasion: inputOccasion,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedOutput(data.generated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-serif text-white">
                AI Growth Operating System (01.md)
              </h1>
              <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[11px] font-bold text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Active Agent Loop
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Autonomous catalog intelligence, SEO self-repair, competitor monitoring, and human-in-the-loop approvals.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Proposed Actions</span>
            <Sparkles className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">
            {recommendations.filter((r) => r.status === "PROPOSED").length}
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Awaiting human sign-off</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Executed Improvements</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">
            {recommendations.filter((r) => r.status === "APPLIED" || r.status === "APPROVED").length}
          </div>
          <p className="text-[11px] text-emerald-400 mt-0.5">Live on marketplace</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Projected Traffic Lift</span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-2">
            +34.8%
          </div>
          <p className="text-[11px] text-amber-400 mt-0.5">Estimated organic lift</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Autonomous Confidence</span>
            <Zap className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-2">
            91.4%
          </div>
          <p className="text-[11px] text-blue-400 mt-0.5">Zero hallucination rate</p>
        </div>
      </div>

      {/* Interactive AI Product Studio Playground */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600/30 text-rose-400 border border-rose-500/30">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                AI Product & SEO Copy Generator Studio
              </h3>
              <p className="text-xs text-zinc-400">
                Transforms basic merchant concepts into emotional, conversion-optimized descriptions and structured metadata.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-400">Core Product Concept</label>
            <Input
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="mt-1 bg-zinc-900 border-zinc-800 text-white text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400">Category Type</label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="mt-1 flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="CAKES">Gourmet Cake</option>
              <option value="FLOWERS">Fresh Flowers</option>
              <option value="COMBOS">Celebration Combo</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400">Target Occasion</label>
            <Input
              value={inputOccasion}
              onChange={(e) => setInputOccasion(e.target.value)}
              className="mt-1 bg-zinc-900 border-zinc-800 text-white text-xs"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-xs font-semibold text-zinc-400">Flavor / Floral Notes</label>
            <Input
              value={inputFlavor}
              onChange={(e) => setInputFlavor(e.target.value)}
              className="mt-1 bg-zinc-900 border-zinc-800 text-white text-xs"
            />
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              disabled={generating}
              className="w-full h-10 font-bold bg-rose-600 hover:bg-rose-700"
            >
              {generating ? "Generating..." : "⚡ Generate Copy"}
            </Button>
          </div>
        </form>

        {generatedOutput && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Generated Commercial Asset Output
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(generatedOutput, null, 2));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy Payload"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div>
                <span className="font-bold text-zinc-400 uppercase text-[10px]">Commercial Title:</span>
                <p className="font-semibold text-white mt-0.5">{generatedOutput.title}</p>
              </div>

              <div>
                <span className="font-bold text-zinc-400 uppercase text-[10px]">Suggested Price:</span>
                <p className="font-bold text-emerald-400 mt-0.5">₹{generatedOutput.suggestedPrice}</p>
              </div>

              <div className="sm:col-span-2">
                <span className="font-bold text-zinc-400 uppercase text-[10px]">Emotional Product Story:</span>
                <p className="text-zinc-300 leading-relaxed mt-0.5">{generatedOutput.description}</p>
              </div>

              <div>
                <span className="font-bold text-zinc-400 uppercase text-[10px]">SEO Meta Title:</span>
                <p className="text-zinc-300 mt-0.5">{generatedOutput.metaTitle}</p>
              </div>

              <div>
                <span className="font-bold text-zinc-400 uppercase text-[10px]">SEO Meta Description:</span>
                <p className="text-zinc-300 mt-0.5">{generatedOutput.metaDescription}</p>
              </div>

              <div className="sm:col-span-2">
                <span className="font-bold text-zinc-400 uppercase text-[10px]">Target Keywords / Tags:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {generatedOutput.tags.map((t: string) => (
                    <span key={t} className="rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Recommendation Inbox (Human-in-the-Loop Approval) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Growth Recommendations & Governance Inbox
            </h3>
            <p className="text-xs text-zinc-400">
              Review and approve staged optimization proposals before publishing to production.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400">{recommendations.length} total proposals</span>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 space-y-3 transition hover:border-zinc-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="rounded bg-rose-950/80 border border-rose-800 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                    {rec.category}
                  </span>
                  <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-amber-400">
                    Impact: {rec.impactScore}/100
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      rec.status === "APPLIED"
                        ? "bg-emerald-950 border border-emerald-800 text-emerald-400"
                        : rec.status === "APPROVED"
                        ? "bg-blue-950 border border-blue-800 text-blue-400"
                        : rec.status === "REJECTED"
                        ? "bg-red-950 border border-red-800 text-red-400"
                        : "bg-amber-950 border border-amber-800 text-amber-400"
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">{rec.description}</p>

              {rec.payload && (
                <div className="rounded-xl bg-zinc-900/80 p-3 text-[11px] font-mono text-zinc-400 border border-zinc-800">
                  <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Proposed Execution Diff:</div>
                  <pre className="whitespace-pre-wrap">{JSON.stringify(rec.payload, null, 2)}</pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 text-xs">
                <span className="text-[11px] text-zinc-500">
                  Staged on {new Date(rec.createdAt).toLocaleDateString("en-IN")}
                </span>

                <div className="flex gap-2">
                  {rec.status === "PROPOSED" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(rec.id, "REJECT")}
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAction(rec.id, "APPLY")}
                        className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                      >
                        ✓ Approve & Apply
                      </Button>
                    </>
                  )}
                  {rec.status === "APPROVED" && (
                    <Button
                      size="sm"
                      onClick={() => handleAction(rec.id, "APPLY")}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Apply Now
                    </Button>
                  )}
                  {rec.status === "APPLIED" && (
                    <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Applied to Live Site
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
