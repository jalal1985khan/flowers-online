"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Store,
  ExternalLink,
  Menu,
  X,
  Radio,
} from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { AdminThemeToggle } from "@/components/admin/admin-theme-toggle";
import { AdminSoundControl } from "@/components/admin/admin-order-notifier";

interface AdminSidebarProps {
  session: {
    name: string;
    role: string;
    email?: string;
  };
}

export function AdminSidebar({ session }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar (Only visible on screens < lg) */}
      <div className="lg:hidden sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-md">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-muted border border-border p-1 shadow-xs shrink-0">
            <Image
              src="/favicon.png"
              alt="MyPetalsCart Emblem"
              width={32}
              height={32}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-xs font-bold text-foreground tracking-tight">MyPetalsCart</span>
            <span className="rounded bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase text-rose-600 dark:text-rose-300">
              Admin
            </span>
          </div>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Overlay Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-border bg-card text-card-foreground transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:h-screen lg:sticky lg:top-0 shrink-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Top: Brand Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 group"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-muted border border-border p-1 shadow-xs group-hover:border-primary/40 transition-all shrink-0">
                <Image
                  src="/favicon.png"
                  alt="MyPetalsCart Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain transition-transform group-hover:scale-105"
                  priority
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xs font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    MyPetalsCart
                  </span>
                  <span className="rounded bg-rose-500/15 border border-rose-500/30 px-1 py-0.5 text-[8px] font-mono font-semibold uppercase text-rose-600 dark:text-rose-300">
                    Admin
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-none">
                  Marketplace Console
                </p>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden rounded-lg p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <AdminNav orientation="vertical" onItemClick={() => setMobileOpen(false)} />

          {/* Quick Shortcuts Section */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Quick Portals
            </div>
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span>Storefront</span>
              </span>
              <span className="text-[10px] text-muted-foreground">Live</span>
            </Link>

            <Link
              href="/vendor"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <span className="flex items-center gap-2.5">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span>Vendor Portal</span>
              </span>
              <span className="text-[10px] text-muted-foreground">Merchant</span>
            </Link>
          </div>
        </div>

        {/* Bottom Left: Static Info, Theme Toggle & Sign Out */}
        <div className="border-t border-border p-4 space-y-3 bg-card/60 backdrop-blur-xs">
          {/* Static User Identity Card */}
          <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/50 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-300 font-bold text-xs border border-rose-500/20 shrink-0">
              {session.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-foreground truncate leading-tight">
                {session.name}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="text-[9px] font-mono uppercase bg-rose-500/15 text-rose-700 dark:text-rose-300 px-1.5 py-0.2 rounded border border-rose-500/30 font-semibold leading-none">
                  {session.role}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">Super Admin</span>
              </div>
            </div>
          </div>

          {/* System Status Pill */}
          <div className="flex items-center justify-between px-1 text-[10px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1">
              <Radio className="h-3 w-3 text-rose-500" />
              <span>Guwahati Hub</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Operational</span>
            </span>
          </div>

          {/* Theme Toggle Button */}
          <AdminThemeToggle />

          {/* New Order Sound Alert Toggle & Test Button */}
          <AdminSoundControl />

          {/* Sign Out Button (Left side bottom) */}
          <AdminLogoutButton />
        </div>
      </aside>
    </>
  );
}
