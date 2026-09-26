"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminLogoutButton({ className }: { className?: string }) {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <button
      onClick={handleLogout}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-600 dark:hover:text-rose-400 px-3 py-2 text-xs font-semibold text-muted-foreground transition cursor-pointer",
        className
      )}
      title="Sign Out from Super Admin"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span>Sign Out</span>
    </button>
  );
}
