"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminCouponForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountValue, setDiscountValue] = useState("10");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FLAT">("PERCENTAGE");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          description,
          discountType,
          discountValue: Number(discountValue),
          minOrderValue: 499,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create coupon");
        return;
      }
      setCode("");
      setDescription("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-5 text-foreground">
      <Input
        placeholder="CODE"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="text-sm font-mono"
        required
      />
      <Input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="text-sm sm:col-span-2"
        required
      />
      <select
        value={discountType}
        onChange={(e) => setDiscountType(e.target.value as "PERCENTAGE" | "FLAT")}
        className="rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-hidden"
      >
        <option value="PERCENTAGE">%</option>
        <option value="FLAT">₹ flat</option>
      </select>
      <div className="flex gap-2">
        <Input
          type="number"
          value={discountValue}
          onChange={(e) => setDiscountValue(e.target.value)}
          className="text-sm font-mono"
          required
        />
        <Button type="submit" disabled={busy} size="sm">
          Add
        </Button>
      </div>
    </form>
  );
}
