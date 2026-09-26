import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Store, ArrowLeft } from "lucide-react";
import { AdminVendorsManager } from "@/components/admin/admin-vendors-manager";

export const dynamic = "force-dynamic";

export default async function AdminVendorsPage() {
  const vendors = await prisma.vendor.findMany({
    include: {
      _count: { select: { products: true, orderItems: true } },
      serviceAreas: {
        select: {
          id: true,
          pincode: true,
          city: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-5 gap-3">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-foreground tracking-tight">
            <Store className="h-5 w-5 text-amber-500" />
            <span>Partner Vendors</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Approve regional bakeries & florists, modify commission rates, and manage service pincode radii.
          </p>
        </div>
      </div>

      {/* Interactive Vendor Manager */}
      <AdminVendorsManager initialVendors={JSON.parse(JSON.stringify(vendors))} />
    </div>
  );
}
