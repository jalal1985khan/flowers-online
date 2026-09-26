"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function AdminVendorToggle({
  vendorId,
  field,
  value,
  label,
}: {
  vendorId: string;
  field: "isApproved" | "isActive";
  value: boolean;
  label: string;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(value);
  const [busy, setBusy] = useState(false);

  const toggle = async (next: boolean) => {
    setChecked(next);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: next }),
      });
      if (!res.ok) {
        setChecked(checked);
        alert("Failed to update vendor");
      } else {
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  };

  const id = `vendor-${vendorId}-${field}`;

  return (
    <div className="flex items-center gap-2">
      <Switch
        id={id}
        checked={checked}
        disabled={busy}
        onCheckedChange={toggle}
      />
      <Label htmlFor={id} className="cursor-pointer text-xs font-medium text-foreground">
        {label}
      </Label>
    </div>
  );
}
