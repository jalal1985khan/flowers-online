"use client";

import React from "react";
import { LogOut } from "lucide-react";

export function VendorLogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/vendor/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 hover:bg-red-100 hover:text-red-900 transition font-medium cursor-pointer"
      title="Sign Out from Vendor Partner Portal"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span>Sign Out</span>
    </button>
  );
}
