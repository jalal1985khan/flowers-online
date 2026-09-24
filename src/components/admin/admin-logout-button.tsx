"use client";

import React from "react";
import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-900/40 hover:text-red-200 transition font-medium cursor-pointer"
      title="Sign Out from Super Admin"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span>Sign Out</span>
    </button>
  );
}
