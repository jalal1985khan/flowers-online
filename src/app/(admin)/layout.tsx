import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminOrderNotifier } from "@/components/admin/admin-order-notifier";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "OPERATIONS")) {
    redirect("/admin/login");
  }

  return (
    <div
      id="admin-root-container"
      className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row font-sans antialiased selection:bg-rose-500/20 selection:text-rose-200 transition-colors duration-150"
    >
      {/* Live Order Audio & Toast Notifier */}
      <AdminOrderNotifier />

      {/* Left Sidebar with static info & Sign Out pinned to bottom left */}
      <AdminSidebar session={session} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <main className="flex-1 w-full px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

