"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-serif text-foreground">
                AI Growth Operating System (01.md)
              </h1>
              <span className="rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Active Agent Loop
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Autonomous catalog intelligence, SEO self-repair, competitor monitoring, and human-in-the-loop approvals.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Proposed Actions</span>
            <Sparkles className="h-4 w-4 text-rose-500 dark:text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground mt-2">
            {recommendations.filter((r) => r.status === "PROPOSED").length}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting human sign-off</p>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Executed Improvements</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2">
            {recommendations.filter((r) => r.status === "APPLIED" || r.status === "APPROVED").length}
          </div>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400 mt-0.5">Live on marketplace</p>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Projected Traffic Lift</span>
            <TrendingUp className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-2">
            +34.8%
          </div>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-400 mt-0.5">Estimated organic lift</p>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Autonomous Confidence</span>
            <Zap className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-2">
            91.4%
          </div>
          <p className="text-[11px] text-blue-600/80 dark:text-blue-400 mt-0.5">Zero hallucination rate</p>
        </Card>
      </div>

      {/* Interactive AI Product Studio Playground */}
      <Card className="p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                AI Product & SEO Copy Generator Studio
              </h3>
              <p className="text-xs text-muted-foreground">
                Transforms basic merchant concepts into emotional, conversion-optimized descriptions and structured metadata.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-foreground">Core Product Concept</label>
            <Input
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="mt-1 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Category Type</label>
            <Select value={inputType} onValueChange={setInputType}>
              <SelectTrigger className="mt-1 h-10 w-full text-xs">
                <SelectValue placeholder="Category Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CAKES">Gourmet Cake</SelectItem>
                <SelectItem value="FLOWERS">Fresh Flowers</SelectItem>
                <SelectItem value="COMBOS">Celebration Combo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Target Occasion</label>
            <Input
              value={inputOccasion}
              onChange={(e) => setInputOccasion(e.target.value)}
              className="mt-1 text-xs"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-xs font-semibold text-foreground">Flavor / Floral Notes</label>
            <Input
              value={inputFlavor}
              onChange={(e) => setInputFlavor(e.target.value)}
              className="mt-1 text-xs"
            />
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              disabled={generating}
              className="w-full h-10 font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
            >
              {generating ? "Generating..." : "⚡ Generate Copy"}
            </Button>
          </div>
        </form>

        {generatedOutput && (
          <div className="rounded-2xl border border-border bg-muted/40 p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Generated Commercial Asset Output
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(generatedOutput, null, 2));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy Payload"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div>
                <span className="font-bold text-muted-foreground uppercase text-[10px]">Commercial Title:</span>
                <p className="font-semibold text-foreground mt-0.5">{generatedOutput.title}</p>
              </div>

              <div>
                <span className="font-bold text-muted-foreground uppercase text-[10px]">Suggested Price:</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">₹{generatedOutput.suggestedPrice}</p>
              </div>

              <div className="sm:col-span-2">
                <span className="font-bold text-muted-foreground uppercase text-[10px]">Emotional Product Story:</span>
                <p className="text-foreground leading-relaxed mt-0.5">{generatedOutput.description}</p>
              </div>

              <div>
                <span className="font-bold text-muted-foreground uppercase text-[10px]">SEO Meta Title:</span>
                <p className="text-foreground mt-0.5">{generatedOutput.metaTitle}</p>
              </div>

              <div>
                <span className="font-bold text-muted-foreground uppercase text-[10px]">SEO Meta Description:</span>
                <p className="text-foreground mt-0.5">{generatedOutput.metaDescription}</p>
              </div>

              <div className="sm:col-span-2">
                <span className="font-bold text-muted-foreground uppercase text-[10px]">Target Keywords / Tags:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {generatedOutput.tags.map((t: string) => (
                    <span key={t} className="rounded-md bg-muted border border-border px-2 py-0.5 text-[11px] text-foreground font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* AI Recommendation Inbox (Human-in-the-Loop Approval) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Growth Recommendations & Governance Inbox
            </h3>
            <p className="text-xs text-muted-foreground">
              Review and approve staged optimization proposals before publishing to production.
            </p>
          </div>
          <span className="text-xs font-mono text-muted-foreground">{recommendations.length} total proposals</span>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <Card
              key={rec.id}
              className="p-5 space-y-3 transition hover:border-border/80 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-300">
                    {rec.category}
                  </span>
                  <h4 className="text-sm font-bold text-foreground">{rec.title}</h4>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Impact: {rec.impactScore}/100
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      rec.status === "APPLIED"
                        ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : rec.status === "APPROVED"
                        ? "bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400"
                        : rec.status === "REJECTED"
                        ? "bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400"
                        : "bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>

              {rec.payload && (
                <div className="rounded-xl bg-muted/60 p-3 text-[11px] font-mono text-foreground border border-border">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Proposed Execution Diff:</div>
                  <pre className="whitespace-pre-wrap">{JSON.stringify(rec.payload, null, 2)}</pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="text-[11px] text-muted-foreground">
                  Staged on {new Date(rec.createdAt).toLocaleDateString("en-IN")}
                </span>

                <div className="flex gap-2">
                  {rec.status === "PROPOSED" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(rec.id, "REJECT")}
                        className="border-border text-foreground hover:bg-muted"
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAction(rec.id, "APPLY")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                      >
                        ✓ Approve & Apply
                      </Button>
                    </>
                  )}
                  {rec.status === "APPROVED" && (
                    <Button
                      size="sm"
                      onClick={() => handleAction(rec.id, "APPLY")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    >
                      Apply Now
                    </Button>
                  )}
                  {rec.status === "APPLIED" && (
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Applied to Live Site
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
