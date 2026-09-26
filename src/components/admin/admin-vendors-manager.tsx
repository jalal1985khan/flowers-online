"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  MapPin,
  Package,
  Mail,
  Phone,
  Clock,
  Percent,
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/dialog";
import { AdminVendorToggle } from "@/components/admin/admin-vendor-toggle";

export interface VendorServiceAreaItem {
  id: string;
  pincode: string;
  city: string;
}

export interface AdminVendorData {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  commissionRate: number;
  prepTimeMinutes: number;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string | Date;
  serviceAreas: VendorServiceAreaItem[];
  _count: {
    products: number;
    orderItems?: number;
  };
}

interface AdminVendorsManagerProps {
  initialVendors: AdminVendorData[];
}

export function AdminVendorsManager({ initialVendors }: AdminVendorsManagerProps) {
  const router = useRouter();
  const [vendors, setVendors] = useState<AdminVendorData[]>(initialVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "APPROVED" | "PENDING" | "INACTIVE">("ALL");

  // Modals state
  const [editingVendor, setEditingVendor] = useState<AdminVendorData | null>(null);
  const [deletingVendor, setDeletingVendor] = useState<AdminVendorData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    address: "",
    commissionRate: 15,
    prepTimeMinutes: 60,
    isApproved: false,
    isActive: true,
    servicePincodesText: "",
  });

  // Add Form State
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    state: "Karnataka",
    address: "",
    commissionRate: 15,
    prepTimeMinutes: 60,
    servicePincodesText: "",
    isApproved: true,
  });

  // Open Edit Modal
  const handleOpenEdit = (vendor: AdminVendorData) => {
    setEditingVendor(vendor);
    setErrorMsg("");
    setSuccessMsg("");
    setEditForm({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      city: vendor.city,
      state: vendor.state,
      address: vendor.address,
      commissionRate: vendor.commissionRate,
      prepTimeMinutes: vendor.prepTimeMinutes,
      isApproved: vendor.isApproved,
      isActive: vendor.isActive,
      servicePincodesText: vendor.serviceAreas.map((sa) => sa.pincode).join(", "),
    });
  };

  // Open Delete / Deactivate Confirmation Modal
  const handleOpenDelete = (vendor: AdminVendorData) => {
    setDeletingVendor(vendor);
    setDeleteError(null);
  };

  // Execute Delete or Deactivate Action
  const handleExecuteDelete = async (mode: "permanent" | "deactivate") => {
    if (!deletingVendor) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/admin/vendors/${deletingVendor.id}?mode=${mode}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process vendor deletion");
      }

      if (data.action === "deleted" || mode === "permanent") {
        setVendors((prev) => prev.filter((v) => v.id !== deletingVendor.id));
        setSuccessMsg(data.message || `Vendor "${deletingVendor.name}" permanently deleted.`);
      } else {
        setVendors((prev) =>
          prev.map((v) =>
            v.id === deletingVendor.id
              ? { ...v, isActive: false, isApproved: false }
              : v
          )
        );
        setSuccessMsg(data.message || `Vendor "${deletingVendor.name}" deactivated and delisted.`);
      }

      setDeletingVendor(null);
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "Error deleting vendor");
    } finally {
      setIsDeleting(false);
    }
  };

  // Submit Edit Vendor
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendor) return;

    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const parsedPincodes = editForm.servicePincodesText
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      const res = await fetch(`/api/admin/vendors/${editingVendor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          city: editForm.city,
          state: editForm.state,
          address: editForm.address,
          commissionRate: Number(editForm.commissionRate),
          prepTimeMinutes: Number(editForm.prepTimeMinutes),
          isApproved: editForm.isApproved,
          isActive: editForm.isActive,
          servicePincodes: parsedPincodes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update vendor");
      }

      setSuccessMsg("Vendor details updated successfully!");
      setVendors((prev) =>
        prev.map((v) => (v.id === editingVendor.id ? { ...v, ...data } : v))
      );
      setTimeout(() => {
        setEditingVendor(null);
        router.refresh();
      }, 800);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error updating vendor");
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Add Vendor
  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const parsedPincodes = addForm.servicePincodesText
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      const res = await fetch("/api/admin/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addForm.name,
          email: addForm.email,
          password: addForm.password,
          phone: addForm.phone,
          city: addForm.city,
          state: addForm.state,
          address: addForm.address,
          commissionRate: Number(addForm.commissionRate),
          prepTimeMinutes: Number(addForm.prepTimeMinutes),
          isApproved: addForm.isApproved,
          servicePincodes: parsedPincodes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to onboard vendor");
      }

      setSuccessMsg("New vendor onboarded successfully!");
      setVendors((prev) => [data, ...prev]);
      setTimeout(() => {
        setIsAddModalOpen(false);
        setAddForm({
          name: "",
          email: "",
          password: "",
          phone: "",
          city: "",
          state: "Karnataka",
          address: "",
          commissionRate: 15,
          prepTimeMinutes: 60,
          servicePincodesText: "",
          isApproved: true,
        });
        router.refresh();
      }, 900);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error onboarding vendor");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter vendors
  const filteredVendors = vendors.filter((v) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      v.name.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q) ||
      v.phone.includes(q) ||
      v.serviceAreas.some((sa) => sa.pincode.includes(q));

    if (!matchesSearch) return false;

    if (statusFilter === "APPROVED") return v.isApproved && v.isActive;
    if (statusFilter === "PENDING") return !v.isApproved;
    if (statusFilter === "INACTIVE") return !v.isActive;
    return true;
  });

  const totalVendors = vendors.length;
  const approvedCount = vendors.filter((v) => v.isApproved && v.isActive).length;
  const pendingCount = vendors.filter((v) => !v.isApproved).length;
  const totalProducts = vendors.reduce((acc, v) => acc + (v._count?.products || 0), 0);

  return (
    <div className="space-y-6 text-foreground">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4 hover:border-border/80 transition-colors">
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Total Merchants</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalVendors}</p>
        </Card>
        <Card className="p-4 hover:border-emerald-500/40 transition-colors">
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">Active & Approved</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{approvedCount}</p>
        </Card>
        <Card className="p-4 hover:border-amber-500/40 transition-colors">
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wider">Pending Review</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</span>
            {pendingCount > 0 && (
              <Badge variant="warning" className="text-[10px] animate-pulse">Needs Action</Badge>
            )}
          </div>
        </Card>
        <Card className="p-4 hover:border-border/80 transition-colors">
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Catalog Listings</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalProducts}</p>
        </Card>
      </div>

      {/* Control Bar: Search, Filters & Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by vendor name, city, email, phone, or pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border text-xs">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${statusFilter === "ALL" ? "bg-card text-foreground shadow-xs border border-border" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              All ({totalVendors})
            </button>
            <button
              onClick={() => setStatusFilter("APPROVED")}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${statusFilter === "APPROVED" ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-xs border border-border" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${statusFilter === "PENDING" ? "bg-card text-amber-600 dark:text-amber-400 shadow-xs border border-border" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter("INACTIVE")}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${statusFilter === "INACTIVE" ? "bg-card text-rose-600 dark:text-rose-400 shadow-xs border border-border" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Inactive
            </button>
          </div>
        </div>

        <Button
          onClick={() => {
            setErrorMsg("");
            setSuccessMsg("");
            setIsAddModalOpen(true);
          }}
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1.5 font-medium shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Vendor</span>
        </Button>
      </div>

      {/* Vendors Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredVendors.map((vendor) => (
          <Card
            key={vendor.id}
            className="p-5 shadow-xs hover:border-border transition flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-foreground text-base leading-tight">{vendor.name}</h3>
                  <p className="text-[11px] font-mono text-muted-foreground mt-0.5">slug: {vendor.slug}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant={vendor.isApproved ? "success" : "warning"} className="text-[10px]">
                    {vendor.isApproved ? "Approved" : "Pending Approval"}
                  </Badge>
                  {!vendor.isActive && (
                    <Badge variant="destructive" className="text-[10px]">Suspended</Badge>
                  )}
                </div>
              </div>

              {/* Vendor Specs */}
              <div className="mt-3.5 space-y-1.5 text-xs text-muted-foreground border-t border-border pt-3">
                <p className="flex items-center gap-2 text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  <span className="font-medium text-foreground">{vendor.city}, {vendor.state}</span>
                  <span className="text-muted-foreground font-mono text-[11px]">({vendor.address})</span>
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="truncate">{vendor.email}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span>{vendor.phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Percent className="h-3 w-3 text-amber-500 shrink-0" />
                    <span>Commission: <strong className="text-foreground">{vendor.commissionRate}%</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3 w-3 text-blue-500 shrink-0" />
                    <span>Prep: <strong className="text-foreground">{vendor.prepTimeMinutes}m</strong></span>
                  </p>
                </div>

                <p className="flex items-center gap-1.5 text-muted-foreground pt-1">
                  <Package className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span><strong className="text-foreground">{vendor._count?.products || 0}</strong> products listed</span>
                </p>

                {/* Delivery Pincodes */}
                <div className="pt-2">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                    Coverage Areas ({vendor.serviceAreas?.length || 0} pincodes):
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pr-1">
                    {vendor.serviceAreas && vendor.serviceAreas.length > 0 ? (
                      vendor.serviceAreas.map((sa) => (
                        <span
                          key={sa.id}
                          className="font-mono text-[10px] bg-muted border border-border text-foreground px-1.5 py-0.5 rounded"
                        >
                          {sa.pincode}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">No delivery pincodes configured</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-3">
                <AdminVendorToggle vendorId={vendor.id} field="isApproved" value={vendor.isApproved} label="Approved" />
                <AdminVendorToggle vendorId={vendor.id} field="isActive" value={vendor.isActive} label="Active" />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(vendor)}
                  className="text-xs gap-1.5 border-border bg-card hover:bg-muted text-card-foreground"
                >
                  <Edit2 className="h-3.5 w-3.5 text-rose-500" />
                  <span>Edit Details</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDelete(vendor)}
                  className="text-xs gap-1.5 border-red-200 dark:border-red-900/50 bg-card hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400"
                  title="Delete or Deactivate Vendor"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredVendors.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border p-12 text-center">
            <Store className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-semibold text-foreground">No partner merchants found</p>
            <p className="text-xs text-muted-foreground mt-1">Try changing your search terms or filter selection.</p>
          </div>
        )}
      </div>

      {/* EDIT VENDOR DETAILS MODAL */}
      <Modal
        isOpen={!!editingVendor}
        onClose={() => setEditingVendor(null)}
        title={`Edit Vendor: ${editingVendor?.name}`}
        description="Update partner merchant profiles, commission, prep time, and delivery coverage pincodes."
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">Merchant / Shop Name *</label>
              <Input
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Phone Number *</label>
              <Input
                required
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">Email Address *</label>
              <Input
                required
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-foreground">Commission % *</label>
                <Input
                  required
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={editForm.commissionRate}
                  onChange={(e) => setEditForm({ ...editForm, commissionRate: Number(e.target.value) })}
                  className="mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Prep (Mins) *</label>
                <Input
                  required
                  type="number"
                  min="10"
                  max="720"
                  value={editForm.prepTimeMinutes}
                  onChange={(e) => setEditForm({ ...editForm, prepTimeMinutes: Number(e.target.value) })}
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">City *</label>
              <Input
                required
                value={editForm.city}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">State *</label>
              <Input
                required
                value={editForm.state}
                onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Physical Kitchen / Shop Address *</label>
            <Input
              required
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              className="mt-1 text-xs"
            />
          </div>

          {/* Delivery Pincodes */}
          <div>
            <label className="text-xs font-semibold text-foreground">
              Service Delivery Pincodes (Comma separated)
            </label>
            <textarea
              rows={3}
              value={editForm.servicePincodesText}
              onChange={(e) => setEditForm({ ...editForm, servicePincodesText: e.target.value })}
              placeholder="e.g. 560001, 560038, 560043, 560078"
              className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Separate each 6-digit postal code with a comma. Orders matching these pincodes can route to this vendor.
            </p>
          </div>

          {/* Status Switches */}
          <div className="flex items-center gap-6 rounded-lg bg-muted/50 border border-border p-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
              <input
                type="checkbox"
                checked={editForm.isApproved}
                onChange={(e) => setEditForm({ ...editForm, isApproved: e.target.checked })}
                className="rounded border-input text-rose-600 focus:ring-rose-500"
              />
              <span>Approved by Admin</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
              <input
                type="checkbox"
                checked={editForm.isActive}
                onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                className="rounded border-input text-rose-600 focus:ring-rose-500"
              />
              <span>Active Status</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const v = editingVendor;
                setEditingVendor(null);
                if (v) handleOpenDelete(v);
              }}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1.5 px-2"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete / Deactivate</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingVendor(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                size="sm"
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1.5"
              >
                {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Save Changes</span>
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* ADD NEW VENDOR MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard New Partner Vendor"
        description="Register a florist or bakery merchant, configure initial credentials, and allocate service delivery pincodes."
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">Shop / Kitchen Name *</label>
              <Input
                required
                placeholder="e.g. Indiranagar Artisanal Bakes"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Contact Phone Number *</label>
              <Input
                required
                placeholder="e.g. +91 98765 43210"
                value={addForm.phone}
                onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">Owner Login Email *</label>
              <Input
                required
                type="email"
                placeholder="vendor@example.com"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Initial Login Password *</label>
              <Input
                required
                type="password"
                placeholder="Minimum 6 characters"
                value={addForm.password}
                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">City *</label>
              <Input
                required
                placeholder="e.g. Bangalore"
                value={addForm.city}
                onChange={(e) => setAddForm({ ...addForm, city: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">State *</label>
              <Input
                required
                value={addForm.state}
                onChange={(e) => setAddForm({ ...addForm, state: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Full Physical Address *</label>
            <Input
              required
              placeholder="e.g. 100ft Road, 2nd Stage, Indiranagar"
              value={addForm.address}
              onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
              className="mt-1 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">Commission Rate (%)</label>
              <Input
                required
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={addForm.commissionRate}
                onChange={(e) => setAddForm({ ...addForm, commissionRate: Number(e.target.value) })}
                className="mt-1 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Prep Time (Minutes)</label>
              <Input
                required
                type="number"
                min="10"
                max="720"
                value={addForm.prepTimeMinutes}
                onChange={(e) => setAddForm({ ...addForm, prepTimeMinutes: Number(e.target.value) })}
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Initial Delivery Pincodes</label>
            <textarea
              rows={2}
              value={addForm.servicePincodesText}
              onChange={(e) => setAddForm({ ...addForm, servicePincodesText: e.target.value })}
              placeholder="e.g. 560001, 560038, 560075"
              className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="rounded-lg bg-muted/50 border border-border p-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
              <input
                type="checkbox"
                checked={addForm.isApproved}
                onChange={(e) => setAddForm({ ...addForm, isApproved: e.target.checked })}
                className="rounded border-input text-rose-600 focus:ring-rose-500"
              />
              <span>Immediately Approve Vendor for Order Allocation</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1.5"
            >
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Onboard Merchant</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE / DEACTIVATE VENDOR MODAL */}
      <Modal
        isOpen={!!deletingVendor}
        onClose={() => !isDeleting && setDeletingVendor(null)}
        title=""
        className="max-w-lg"
      >
        {deletingVendor && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {(deletingVendor._count?.orderItems || 0) > 0
                    ? `Deactivate Vendor: ${deletingVendor.name}`
                    : `Delete Vendor: ${deletingVendor.name}`}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Confirm merchant removal or storefront delisting.
                </p>
              </div>
            </div>

            {/* Merchant Snapshot Card */}
            <div className="rounded-xl border border-border bg-muted/40 p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">{deletingVendor.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground">slug: {deletingVendor.slug}</span>
              </div>
              <div className="text-muted-foreground">
                Location: {deletingVendor.city}, {deletingVendor.state}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border">
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <Package className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{deletingVendor._count?.products || 0} products listed</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <Store className="h-3.5 w-3.5 text-blue-500" />
                  <span>{deletingVendor._count?.orderItems || 0} order items</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {deleteError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-2.5 text-xs text-red-600 dark:text-red-400">
                {deleteError}
              </div>
            )}

            {/* Conditional Explanation based on transaction history */}
            {(deletingVendor._count?.orderItems || 0) > 0 ? (
              <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3.5 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>Protected Historic Merchant</span>
                </div>
                <p className="text-amber-900 dark:text-amber-200 leading-relaxed">
                  This vendor has <strong>{deletingVendor._count?.orderItems} customer order records</strong> on file. For financial audit and customer invoice integrity, vendors with transaction history cannot be hard-deleted.
                </p>
                <div className="text-[11px] text-amber-800 dark:text-amber-300 space-y-1 pt-1 border-t border-amber-200 dark:border-amber-900/50">
                  <p>✓ Merchant will be marked <strong>Inactive</strong> & <strong>Unapproved</strong>.</p>
                  <p>✓ All <strong>{deletingVendor._count?.products || 0} products</strong> will be hidden from the storefront.</p>
                  <p>✓ Delivery pincodes will be unlinked so no new orders can be placed.</p>
                  <p>✓ Past orders and receipts will remain 100% safe.</p>
                </div>
              </div>
            ) : (deletingVendor._count?.products || 0) > 0 ? (
              <div className="rounded-xl bg-muted/60 border border-border p-3 text-xs space-y-2">
                <p className="text-foreground leading-relaxed">
                  This merchant has <strong>{deletingVendor._count?.products} products listed</strong>, but has <strong>0 customer orders</strong>.
                </p>
                <p className="text-muted-foreground text-[11px]">
                  You can either permanently delete the vendor and their products, or deactivate them to keep the products archived in the database.
                </p>
              </div>
            ) : (
              <div className="rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 p-3 text-xs text-red-800 dark:text-red-300">
                This merchant has no products and no customer orders. Permanent deletion will completely remove this vendor profile from the system.
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={() => setDeletingVendor(null)}
                className="text-xs order-last sm:order-first"
              >
                Cancel
              </Button>

              {(deletingVendor._count?.orderItems || 0) > 0 ? (
                <Button
                  type="button"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => handleExecuteDelete("deactivate")}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1.5 font-semibold"
                >
                  {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Deactivate & Delist Vendor</span>
                </Button>
              ) : (deletingVendor._count?.products || 0) > 0 ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isDeleting}
                    onClick={() => handleExecuteDelete("deactivate")}
                    className="text-xs"
                  >
                    Deactivate Only
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={isDeleting}
                    onClick={() => handleExecuteDelete("permanent")}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs gap-1.5 font-semibold"
                  >
                    {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>Delete Permanently</span>
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => handleExecuteDelete("permanent")}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs gap-1.5 font-semibold"
                >
                  {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Delete Vendor Permanently</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
