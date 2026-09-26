"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Store, Check, Loader2 } from "lucide-react";

interface VendorOption {
  id: string;
  name: string;
  city: string;
}

interface AdminOrderVendorSelectProps {
  orderId: string;
  currentVendorId: string | null;
  currentVendorName?: string;
  vendors: VendorOption[];
}

export function AdminOrderVendorSelect({
  orderId,
  currentVendorId,
  currentVendorName,
  vendors,
}: AdminOrderVendorSelectProps) {
  const router = useRouter();
  const [selectedVendorId, setSelectedVendorId] = useState(currentVendorId || "");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  const onVendorChange = async (nextVendorId: string) => {
    if (!nextVendorId || nextVendorId === selectedVendorId) return;

    setSelectedVendorId(nextVendorId);
    setBusy(true);
    setSuccess(false);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId: nextVendorId }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to route order to vendor");
        setSelectedVendorId(currentVendorId || "");
      } else {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 2500);
      }
    } catch (err: any) {
      alert(err.message || "Network error while routing order");
      setSelectedVendorId(currentVendorId || "");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedVendorId}
        onValueChange={onVendorChange}
        disabled={busy}
      >
        <SelectTrigger className="h-8 w-[210px] text-xs font-medium">
          <div className="flex items-center gap-1.5 truncate">
            <Store className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <SelectValue placeholder="Select Vendor Partner..." />
          </div>
        </SelectTrigger>
        <SelectContent align="start">
          {vendors.map((v) => (
            <SelectItem key={v.id} value={v.id} className="text-xs">
              <span className="font-semibold">{v.name}</span>{" "}
              <span className="text-muted-foreground">({v.city})</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {busy && <Loader2 className="h-3 w-3 animate-spin text-primary shrink-0" />}
      {success && (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
          <Check className="h-3 w-3" />
          Routed
        </span>
      )}
    </div>
  );
}
