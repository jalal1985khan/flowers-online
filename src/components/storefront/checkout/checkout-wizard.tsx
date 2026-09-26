"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useLocation } from "@/lib/location-context";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  MapPin,
  Sparkles,
  Gift,
  CreditCard,
  CheckCircle2,
  Lock,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Edit3,
  Bookmark,
  AlertTriangle,
} from "lucide-react";

export interface DeleteTarget {
  type: "sender" | "recipient";
  id: string;
  name: string;
  detail?: string;
}

export interface SavedSender {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface SavedRecipient {
  id: string;
  name: string;
  phone: string;
  address: string;
  landmark?: string;
  city?: string;
  pincode?: string;
  label?: string; // HOME, WORK, FRIEND, FAMILY, OTHER
}

export interface AvailableAddon {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
}

function getLabelIcon(label?: string) {
  switch (label?.toUpperCase()) {
    case "WORK":
    case "OFFICE":
      return "💼";
    case "FRIEND":
      return "🌸";
    case "FAMILY":
      return "🎂";
    case "HOME":
      return "🏠";
    default:
      return "📍";
  }
}

const STEPS = [
  { id: 1, title: "Recipient", icon: User },
  { id: 2, title: "Delivery", icon: MapPin },
  { id: 3, title: "Personalize", icon: Sparkles },
  { id: 4, title: "Add-ons", icon: Gift },
  { id: 5, title: "Payment", icon: CreditCard },
  { id: 6, title: "Confirm", icon: CheckCircle2 },
] as const;

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function getItemAttributes(item: {
  title: string;
  variantName?: string;
  isEggless?: boolean;
  messageOnCake?: string;
}) {
  const title = item.title.toLowerCase();
  const variant = (item.variantName || "").trim();
  const variantLower = variant.toLowerCase();

  const isCake =
    item.isEggless !== undefined ||
    item.messageOnCake !== undefined ||
    title.includes("cake") ||
    title.includes("pastry") ||
    title.includes("truffle") ||
    title.includes("bento") ||
    variantLower.includes("kg") ||
    variantLower.includes("gram") ||
    variantLower.includes("gm");

  const isFlower =
    title.includes("flower") ||
    title.includes("rose") ||
    title.includes("lily") ||
    title.includes("lilies") ||
    title.includes("carnation") ||
    title.includes("orchid") ||
    title.includes("bouquet") ||
    title.includes("bunch") ||
    title.includes("stem") ||
    variantLower.includes("rose") ||
    variantLower.includes("stem") ||
    variantLower.includes("bloom");

  // Determine cake weight / size
  let cakeWeight: string | null = null;
  if (isCake) {
    if (variant) {
      cakeWeight = variant;
    } else {
      const match = item.title.match(/(\d+(?:\.\d+)?\s*(?:kg|g|gm|pound))/i);
      cakeWeight = match ? match[0] : "0.5 kg (Standard)";
    }
  }

  // Determine flower count / stems
  let flowerCount: string | null = null;
  if (isFlower) {
    if (variant) {
      flowerCount = variant;
    } else {
      const match = item.title.match(/(\d+\s*(?:stems?|roses?|carnations?|lilies|orchids?|blooms?|flowers?))/i);
      flowerCount = match ? match[0] : "Standard Bouquet";
    }
  }

  return { isCake, isFlower, cakeWeight, flowerCount };
}

function normalizePhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
}

function isValidIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.trim());
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function CheckoutWizard() {
  const router = useRouter();
  const {
    items,
    subtotal,
    slotFeesTotal,
    appliedCoupon,
    discountTotal,
    total,
    clearCart,
    updateItemAddons,
  } = useCart();
  const { location } = useLocation();

  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);

  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [instructions, setInstructions] = useState("");

  // Current authenticated user session (if logged in)
  const [currentUser, setCurrentUser] = useState<{ id: string; name?: string; email?: string; phone?: string } | null>(null);

  // Saved Senders & Recipients management (like major delivery platforms)
  const [savedSenders, setSavedSenders] = useState<SavedSender[]>([]);
  const [selectedSenderId, setSelectedSenderId] = useState<string | "new">("new");
  const [saveSenderForLater, setSaveSenderForLater] = useState(true);

  const [savedRecipients, setSavedRecipients] = useState<SavedRecipient[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | "new">("new");
  const [saveRecipientForLater, setSaveRecipientForLater] = useState(true);
  const [recipientLabel, setRecipientLabel] = useState("HOME");
  const [step1Attempted, setStep1Attempted] = useState(false);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Available celebration add-ons gallery
  const [availableAddons, setAvailableAddons] = useState<AvailableAddon[]>([]);
  const [loadingAddons, setLoadingAddons] = useState(false);

  useEffect(() => {
    setLoadingAddons(true);
    fetch("/api/public/addons")
      .then((r) => r.json())
      .then((data) => {
        if (data.addons && Array.isArray(data.addons)) {
          setAvailableAddons(data.addons);
        }
      })
      .catch(() => { })
      .finally(() => setLoadingAddons(false));
  }, []);

  useEffect(() => {
    // Check logged-in user profile
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          const u = data.user;
          setCurrentUser(u);

          // 1. Authenticated member: load senders scoped to this user
          let userSenders: SavedSender[] = [];
          try {
            const stored = localStorage.getItem(`bloom_saved_senders_${u.id}`);
            if (stored) userSenders = JSON.parse(stored);
          } catch { }

          const exists = userSenders.some(
            (s) => s.email && u.email && s.email.toLowerCase() === u.email.toLowerCase()
          );
          if (!exists && (u.name || u.email)) {
            const authSender: SavedSender = {
              id: `s_auth_${u.id}`,
              name: u.name || "",
              email: u.email || "",
              phone: u.phone || "",
            };
            userSenders = [authSender, ...userSenders];
          }

          setSavedSenders(userSenders);
          if (userSenders.length > 0) {
            setSelectedSenderId(userSenders[0].id);
            setSenderName(userSenders[0].name || "");
            setSenderEmail(userSenders[0].email || "");
            setSenderPhone(userSenders[0].phone || "");
          } else {
            setSenderName(u.name || "");
            setSenderEmail(u.email || "");
            setSenderPhone(u.phone || "");
          }

          // 2. Authenticated member: Fetch saved addresses from server database
          fetch("/api/account/addresses")
            .then((r) => r.json())
            .then((addrData) => {
              const serverAddrs: SavedRecipient[] = (addrData.addresses || []).map((a: any) => ({
                id: a.id,
                name: a.name,
                phone: a.phone,
                address: a.address,
                landmark: a.landmark || "",
                city: a.city,
                pincode: a.pincode,
                label: a.label || "HOME",
              }));

              setSavedRecipients(serverAddrs);
              if (serverAddrs.length > 0) {
                setSelectedRecipientId(serverAddrs[0].id);
                setRecipientName(serverAddrs[0].name || "");
                setRecipientPhone(serverAddrs[0].phone || "");
                setAddress(serverAddrs[0].address || "");
                setLandmark(serverAddrs[0].landmark || "");
                setRecipientLabel(serverAddrs[0].label || "HOME");
              } else {
                setSelectedRecipientId("new");
              }
            })
            .catch(() => {
              setSavedRecipients([]);
              setSelectedRecipientId("new");
            });
        } else {
          // Guest user: NOT logged in - clear saved lists & ensure clean input mode
          setCurrentUser(null);
          setSavedSenders([]);
          setSelectedSenderId("new");
          setSavedRecipients([]);
          setSelectedRecipientId("new");
          try {
            localStorage.removeItem("bloom_saved_senders");
            localStorage.removeItem("bloom_saved_recipients");
          } catch { }
        }
      })
      .catch(() => {
        // Fallback for unauthenticated guests
        setCurrentUser(null);
        setSavedSenders([]);
        setSelectedSenderId("new");
        setSavedRecipients([]);
        setSelectedRecipientId("new");
      });
  }, []);

  const handleSelectSender = (id: string | "new") => {
    setSelectedSenderId(id);
    if (id === "new") {
      setSenderName("");
      setSenderEmail("");
      setSenderPhone("");
    } else {
      const found = savedSenders.find((s) => s.id === id);
      if (found) {
        setSenderName(found.name || "");
        setSenderEmail(found.email || "");
        setSenderPhone(found.phone || "");
      }
    }
  };

  const handleSelectRecipient = (id: string | "new") => {
    setSelectedRecipientId(id);
    if (id === "new") {
      setRecipientName("");
      setRecipientPhone("");
      setAddress("");
      setLandmark("");
      setRecipientLabel("HOME");
    } else {
      const found = savedRecipients.find((r) => r.id === id);
      if (found) {
        setRecipientName(found.name || "");
        setRecipientPhone(found.phone || "");
        setAddress(found.address || "");
        setLandmark(found.landmark || "");
        setRecipientLabel(found.label || "HOME");
      }
    }
  };

  const handleRequestDeleteSender = (sender: SavedSender, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget({
      type: "sender",
      id: sender.id,
      name: sender.name || "Sender Profile",
      detail: sender.phone ? `+91 ${sender.phone}` : sender.email,
    });
  };

  const handleRequestDeleteRecipient = (recipient: SavedRecipient, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget({
      type: "recipient",
      id: recipient.id,
      name: recipient.name || "Recipient",
      detail: `${recipient.address}${recipient.phone ? ` • +91 ${recipient.phone}` : ""}`,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const { type, id } = deleteTarget;

    try {
      if (type === "sender") {
        const updated = savedSenders.filter((s) => s.id !== id);
        setSavedSenders(updated);
        if (currentUser?.id) {
          try {
            localStorage.setItem(`bloom_saved_senders_${currentUser.id}`, JSON.stringify(updated));
          } catch { }
        }
        if (selectedSenderId === id) {
          if (updated.length > 0) {
            handleSelectSender(updated[0].id);
          } else {
            handleSelectSender("new");
          }
        }
      } else if (type === "recipient") {
        const updated = savedRecipients.filter((r) => r.id !== id);
        setSavedRecipients(updated);
        if (selectedRecipientId === id) {
          if (updated.length > 0) {
            handleSelectRecipient(updated[0].id);
          } else {
            handleSelectRecipient("new");
          }
        }
        await fetch(`/api/account/addresses?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        }).catch(() => { });
      }
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const persistSenderAndRecipient = () => {
    // Only persist saved profile/address book on user's account if authenticated
    if (!currentUser?.id) return;

    // 1. Save Sender if requested
    if (saveSenderForLater && senderName.trim() && senderPhone.trim()) {
      const updatedSenders = [...savedSenders];
      const existingIdx = updatedSenders.findIndex(
        (s) => s.phone === senderPhone || (senderEmail && s.email.toLowerCase() === senderEmail.trim().toLowerCase())
      );
      const senderObj: SavedSender = {
        id: existingIdx >= 0 ? updatedSenders[existingIdx].id : `s_${Date.now()}`,
        name: senderName.trim(),
        email: senderEmail.trim(),
        phone: senderPhone.trim(),
      };
      if (existingIdx >= 0) {
        updatedSenders[existingIdx] = senderObj;
      } else {
        updatedSenders.unshift(senderObj);
      }
      setSavedSenders(updatedSenders);
      setSelectedSenderId(senderObj.id);
      try {
        localStorage.setItem(`bloom_saved_senders_${currentUser.id}`, JSON.stringify(updatedSenders));
      } catch { }
    }

    // 2. Save Recipient if requested
    if (saveRecipientForLater && recipientName.trim() && recipientPhone.trim() && address.trim()) {
      const updatedRecipients = [...savedRecipients];
      const existingIdx = updatedRecipients.findIndex(
        (r) => r.phone === recipientPhone && r.address.toLowerCase() === address.trim().toLowerCase()
      );
      const newRecipientObj: SavedRecipient = {
        id: existingIdx >= 0 ? updatedRecipients[existingIdx].id : `r_${Date.now()}`,
        name: recipientName.trim(),
        phone: recipientPhone.trim(),
        address: address.trim(),
        landmark: landmark.trim() || undefined,
        city: location.city,
        pincode: location.pincode,
        label: recipientLabel || "HOME",
      };
      if (existingIdx >= 0) {
        updatedRecipients[existingIdx] = newRecipientObj;
      } else {
        updatedRecipients.unshift(newRecipientObj);
      }
      setSavedRecipients(updatedRecipients);
      setSelectedRecipientId(newRecipientObj.id);

      fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: recipientName.trim(),
          phone: recipientPhone.trim(),
          address: address.trim(),
          landmark: landmark.trim() || null,
          city: location.city,
          pincode: location.pincode,
          label: recipientLabel || "HOME",
        }),
      }).catch(() => { });
    }
  };

  if (items.length === 0 && !confirmedOrderNumber) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h2 className="font-display text-xl font-bold text-foreground">Your cart is empty</h2>
        <p className="mt-1 text-sm text-muted-foreground">Add items before checkout.</p>
        <Button onClick={() => router.push("/catalog")} className="mt-4">
          Browse Catalog
        </Button>
      </div>
    );
  }

  const firstItem = items[0];

  const handleToggleAddon = (addon: AvailableAddon, delta: number) => {
    if (!firstItem) return;
    const currentAddons = firstItem.addons ? [...firstItem.addons] : [];
    const idx = currentAddons.findIndex((a) => a.id === addon.id || a.title === addon.title);

    if (idx >= 0) {
      const newQty = currentAddons[idx].quantity + delta;
      if (newQty <= 0) {
        currentAddons.splice(idx, 1);
      } else {
        currentAddons[idx] = { ...currentAddons[idx], quantity: newQty };
      }
    } else if (delta > 0) {
      currentAddons.push({
        id: addon.id,
        title: addon.title,
        price: addon.price,
        quantity: 1,
      });
    }

    updateItemAddons(firstItem.id, currentAddons);
  };

  const getAddonQuantity = (addonId: string, addonTitle: string): number => {
    if (!firstItem || !firstItem.addons) return 0;
    const found = firstItem.addons.find((a) => a.id === addonId || a.title === addonTitle);
    return found ? found.quantity : 0;
  };

  const buildOrderPayload = () => ({
    customerName: senderName,
    customerEmail: senderEmail,
    customerPhone: senderPhone,
    recipientName,
    recipientPhone,
    deliveryAddress: address,
    deliveryCity: location.city,
    deliveryPincode: location.pincode,
    landmark,
    deliveryInstructions: instructions,
    deliveryDate: firstItem?.deliveryDate || new Date().toISOString(),
    deliverySlotId: firstItem?.deliverySlotId,
    messageOnCard: firstItem?.messageOnCard,
    messageOnCake: firstItem?.messageOnCake,
    isEggless: firstItem?.isEggless,
    subtotal,
    slotFee: slotFeesTotal,
    deliveryFee: 0,
    couponCode: appliedCoupon?.code || null,
    couponDiscount: discountTotal,
    total,
    items: items.map((i) => ({
      vendorId: i.vendorId,
      productId: i.productId,
      variantId: i.variantId,
      title: i.title,
      variantName: i.variantName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      messageOnCake: i.messageOnCake,
      isEggless: i.isEggless,
    })),
  });

  const validateStep = (s: number): boolean => {
    setError(null);
    if (s === 1) {
      setStep1Attempted(true);
      if (!senderName.trim()) {
        setError("Please enter your name (Sender).");
        return false;
      }
      if (!senderEmail.trim()) {
        setError("Please enter your email address (Sender).");
        return false;
      }
      if (!isValidEmail(senderEmail)) {
        setError("Please enter a valid email address (e.g. name@example.com).");
        return false;
      }
      if (!senderPhone.trim()) {
        setError("Please enter your 10-digit mobile number (Sender).");
        return false;
      }
      if (!isValidIndianPhone(senderPhone)) {
        setError("Sender mobile number must be 10 digits starting with 6, 7, 8, or 9.");
        return false;
      }
      if (!recipientName.trim()) {
        setError("Please enter the recipient's name.");
        return false;
      }
      if (!recipientPhone.trim()) {
        setError("Please enter the recipient's 10-digit mobile number.");
        return false;
      }
      if (!isValidIndianPhone(recipientPhone)) {
        setError("Recipient mobile number must be 10 digits starting with 6, 7, 8, or 9.");
        return false;
      }
      if (!address.trim()) {
        setError("Please enter the delivery address.");
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    if (step === 1) {
      persistSenderAndRecipient();
    }
    setStep((s) => Math.min(6, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const payWithRazorpay = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const orderPayload = buildOrderPayload();
      const rzRes = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, receipt: `bnb_${Date.now()}` }),
      });
      const rzData = await rzRes.json();

      if (!rzRes.ok) {
        const fallback = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...orderPayload, paymentMethod: "Pending" }),
        });
        const fallbackData = await fallback.json();
        if (!fallback.ok) throw new Error(fallbackData.error || rzData.error);
        clearCart();
        setConfirmedOrderNumber(fallbackData.orderNumber);
        setStep(6);
        return;
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay checkout failed to load.");
      }

      const options = {
        key: rzData.keyId,
        amount: rzData.amount,
        currency: rzData.currency,
        name: process.env.NEXT_PUBLIC_APP_NAME || "MyPetalsCart",
        description: "Flower & cake delivery order",
        order_id: rzData.orderId,
        prefill: {
          name: senderName,
          email: senderEmail,
          contact: senderPhone,
        },
        theme: { color: "#e11d48" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderPayload,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            setError(verifyData.error || "Payment verification failed");
            setIsSubmitting(false);
            return;
          }
          clearCart();
          setConfirmedOrderNumber(verifyData.orderNumber);
          setStep(6);
          setIsSubmitting(false);
        },
        modal: {
          ondismiss: () => setIsSubmitting(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setRazorpayReady(true)}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-left">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Secure Checkout
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Step {step} of 6 — {STEPS[step - 1].title}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${step === s.id
                ? "bg-primary text-primary-foreground"
                : step > s.id
                  ? "bg-success-soft text-success"
                  : "bg-card text-muted-foreground border border-border"
                }`}
            >
              <s.icon className="size-3.5" />
              <span>{s.title}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            {step === 1 && (
              <div className="flex flex-col gap-6">
                {/* 1. SENDER DETAILS */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                        <User className="size-4 text-primary" />
                        Sender Details (Who is sending?)
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Your contact details for order confirmation, delivery updates & invoice.
                      </p>
                    </div>
                    {savedSenders.length > 0 && selectedSenderId !== "new" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectSender("new")}
                        className="text-xs text-primary hover:text-primary hover:bg-primary-soft h-7 self-start sm:self-auto"
                      >
                        <Plus className="size-3.5 mr-1" />
                        New Sender Profile
                      </Button>
                    )}
                  </div>

                  {/* Saved Senders Quick Picker */}
                  {savedSenders.length > 0 && (
                    <div className="flex flex-wrap gap-2.5">
                      {savedSenders.map((s) => {
                        const isSelected = selectedSenderId === s.id;
                        return (
                          <div
                            key={s.id}
                            className={`group relative flex items-center justify-between gap-2.5 rounded-xl border pl-3 pr-2 py-2 text-left transition-all ${isSelected
                              ? "border-primary bg-primary-soft/30 ring-1 ring-primary/40 shadow-xs"
                              : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                              }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleSelectSender(s.id)}
                              className="flex items-center gap-2.5 text-left min-w-0"
                            >
                              <div
                                className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                  }`}
                              >
                                {s.name ? s.name.charAt(0).toUpperCase() : "S"}
                              </div>
                              <div className="min-w-0 pr-1">
                                <p className="text-xs font-bold text-foreground truncate">{s.name}</p>
                                <p className="text-[11px] text-muted-foreground truncate">
                                  {s.phone ? `+91 ${s.phone}` : s.email}
                                </p>
                              </div>
                              {isSelected && <CheckCircle2 className="size-4 text-primary shrink-0 ml-1" />}
                            </button>

                            <button
                              type="button"
                              title="Delete saved sender"
                              onClick={(e) => handleRequestDeleteSender(s, e)}
                              className="p-1 rounded-md text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => handleSelectSender("new")}
                        className={`flex items-center gap-2 rounded-xl border border-dashed px-3.5 py-2.5 text-xs font-medium transition-all ${selectedSenderId === "new"
                          ? "border-primary bg-primary-soft/30 text-primary"
                          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                          }`}
                      >
                        <Plus className="size-4" />
                        Add New Sender
                      </button>
                    </div>
                  )}

                  {/* Sender Input Fields */}
                  {(selectedSenderId === "new" || savedSenders.length === 0) ? (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                          <div className="flex h-5 items-center justify-between">
                            <label className="text-xs font-semibold text-foreground">Your name</label>
                          </div>
                          <Input
                            required
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className={`mt-1.5 ${step1Attempted && !senderName.trim()
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                              }`}
                            placeholder="Full name"
                          />
                          {step1Attempted && !senderName.trim() && (
                            <p className="mt-1 text-[11px] text-destructive">Sender name is required</p>
                          )}
                        </div>
                        <div>
                          <div className="flex h-5 items-center justify-between">
                            <label className="text-xs font-semibold text-foreground">Email</label>
                          </div>
                          <Input
                            required
                            type="email"
                            value={senderEmail}
                            onChange={(e) => setSenderEmail(e.target.value)}
                            className={`mt-1.5 ${(senderEmail && !isValidEmail(senderEmail)) || (step1Attempted && !senderEmail.trim())
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                              }`}
                            placeholder="name@example.com"
                          />
                          {step1Attempted && !senderEmail.trim() ? (
                            <p className="mt-1 text-[11px] text-destructive">Sender email is required</p>
                          ) : senderEmail && !isValidEmail(senderEmail) ? (
                            <p className="mt-1 text-[11px] text-destructive">Enter a valid email address</p>
                          ) : null}
                        </div>
                        <div>
                          <div className="flex h-5 items-center justify-between">
                            <label className="text-xs font-semibold text-foreground">Mobile number</label>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {senderPhone.length}/10
                            </span>
                          </div>
                          <div className="relative mt-1.5">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/80 select-none border-r border-border pr-2">
                              +91
                            </span>
                            <Input
                              required
                              type="tel"
                              maxLength={10}
                              placeholder="Enter 10-digit number"
                              value={senderPhone}
                              onChange={(e) => setSenderPhone(normalizePhoneInput(e.target.value))}
                              className={`pl-12 font-mono ${(senderPhone && !isValidIndianPhone(senderPhone)) || (step1Attempted && !senderPhone.trim())
                                ? "border-destructive focus-visible:ring-destructive"
                                : ""
                                }`}
                            />
                          </div>
                          {step1Attempted && !senderPhone.trim() ? (
                            <p className="mt-1 text-[11px] text-destructive">Sender mobile number is required</p>
                          ) : senderPhone && senderPhone.length > 0 && !isValidIndianPhone(senderPhone) ? (
                            <p className="mt-1 text-[11px] text-destructive">
                              {senderPhone.length < 10
                                ? `Enter ${10 - senderPhone.length} more digit${10 - senderPhone.length > 1 ? "s" : ""}`
                                : "Must start with 6, 7, 8, or 9"}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      {!currentUser ? (
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-1">
                          <span>💡</span>
                          <span>
                            Ordering frequently?{" "}
                            <a href="/login" className="text-primary font-medium hover:underline">
                              Log in
                            </a>{" "}
                            to auto-fill your contact details.
                          </span>
                        </p>
                      ) : (
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={saveSenderForLater}
                            onChange={(e) => setSaveSenderForLater(e.target.checked)}
                            className="rounded border-border text-primary focus:ring-primary size-3.5"
                          />
                          <span className="text-xs text-foreground font-medium">
                            Save sender details for fast checkout on my future celebration orders
                          </span>
                        </label>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl bg-muted/40 border border-border/80 px-4 py-3 text-xs">
                      <div>
                        <span className="font-semibold text-foreground">Sender: </span>
                        <span className="text-foreground">{senderName}</span>
                        <span className="text-muted-foreground"> • {senderEmail}</span>
                        {senderPhone && <span className="text-muted-foreground"> • +91 {senderPhone}</span>}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSenderId("new")}
                        className="text-xs h-7 ml-3 shrink-0"
                      >
                        <Edit3 className="size-3 mr-1" />
                        Edit Sender
                      </Button>
                    </div>
                  )}
                </div>

                {/* 2. RECIPIENT & DELIVERY ADDRESS */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                        <MapPin className="size-4 text-primary" />
                        Recipient & Delivery Address (Who is receiving?)
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {savedRecipients.length > 0
                          ? "Select a saved recipient from previous orders or enter a new celebration delivery address."
                          : "Enter the recipient's name and celebration delivery address."}
                      </p>
                    </div>
                    {savedRecipients.length > 0 && selectedRecipientId !== "new" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectRecipient("new")}
                        className="text-xs text-primary hover:text-primary hover:bg-primary-soft h-7 self-start sm:self-auto"
                      >
                        <Plus className="size-3.5 mr-1" />
                        Deliver to Someone New
                      </Button>
                    )}
                  </div>

                  {/* Saved Recipients Grid */}
                  {savedRecipients.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {savedRecipients.map((r) => {
                        const isSelected = selectedRecipientId === r.id;
                        return (
                          <div
                            key={r.id}
                            onClick={() => handleSelectRecipient(r.id)}
                            className={`group relative flex flex-col justify-between rounded-xl border p-3.5 text-left cursor-pointer transition-all ${isSelected
                              ? "border-primary bg-primary-soft/20 ring-1 ring-primary/40 shadow-xs"
                              : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                              }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                  {getLabelIcon(r.label)} {r.label || "HOME"}
                                </span>
                                <div className="flex items-center gap-2">
                                  {isSelected && (
                                    <span className="flex items-center gap-1 text-[11px] font-bold text-primary">
                                      <CheckCircle2 className="size-3.5" /> Selected
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    title="Delete saved recipient address"
                                    onClick={(e) => handleRequestDeleteRecipient(r, e)}
                                    className="p-1 rounded-md text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </div>
                              </div>
                              <p className="mt-2 text-xs font-bold text-foreground">{r.name}</p>
                              <p className="text-[11px] font-mono text-muted-foreground">+91 {r.phone}</p>
                              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{r.address}</p>
                              {r.landmark && (
                                <p className="text-[11px] text-muted-foreground/80 italic mt-0.5">
                                  Near {r.landmark}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Add New Recipient Card */}
                      <div
                        onClick={() => handleSelectRecipient("new")}
                        className={`flex flex-col items-center justify-center rounded-xl border border-dashed p-4 text-center cursor-pointer transition-all min-h-[110px] ${selectedRecipientId === "new"
                          ? "border-primary bg-primary-soft/30 text-primary"
                          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                          }`}
                      >
                        <div className="flex size-7 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10">
                          <Plus className="size-4" />
                        </div>
                        <p className="mt-2 text-xs font-semibold">Deliver to Someone New</p>
                        <p className="text-[10px] text-muted-foreground">Enter a new name & delivery address</p>
                      </div>
                    </div>
                  )}

                  {/* Recipient Form Fields */}
                  {(selectedRecipientId === "new" || savedRecipients.length === 0) ? (
                    <div className="flex flex-col gap-4 mt-1 pt-3 border-t border-dashed border-border">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {savedRecipients.length > 0 ? "Enter New Recipient Details" : "Recipient Information"}
                        </h4>
                        {/* Address tag selector */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] text-muted-foreground mr-1">Address tag:</span>
                          {["HOME", "WORK", "FRIEND", "FAMILY", "OTHER"].map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => setRecipientLabel(tag)}
                              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition-colors ${recipientLabel === tag
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                            >
                              {getLabelIcon(tag)} {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <div className="flex h-5 items-center justify-between">
                            <label className="text-xs font-semibold text-foreground">Recipient name</label>
                          </div>
                          <Input
                            required
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className={`mt-1.5 ${step1Attempted && !recipientName.trim()
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                              }`}
                            placeholder="Recipient full name"
                          />
                          {step1Attempted && !recipientName.trim() && (
                            <p className="mt-1 text-[11px] text-destructive">Recipient full name is required</p>
                          )}
                        </div>
                        <div>
                          <div className="flex h-5 items-center justify-between">
                            <label className="text-xs font-semibold text-foreground">Recipient mobile</label>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {recipientPhone.length}/10
                            </span>
                          </div>
                          <div className="relative mt-1.5">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground/80 select-none border-r border-border pr-2">
                              +91
                            </span>
                            <Input
                              required
                              type="tel"
                              maxLength={10}
                              placeholder="Enter 10-digit number"
                              value={recipientPhone}
                              onChange={(e) => setRecipientPhone(normalizePhoneInput(e.target.value))}
                              className={`pl-12 font-mono ${(recipientPhone && !isValidIndianPhone(recipientPhone)) || (step1Attempted && !recipientPhone.trim())
                                ? "border-destructive focus-visible:ring-destructive"
                                : ""
                                }`}
                            />
                          </div>
                          {step1Attempted && !recipientPhone.trim() ? (
                            <p className="mt-1 text-[11px] text-destructive">Recipient mobile number is required</p>
                          ) : recipientPhone && recipientPhone.length > 0 && !isValidIndianPhone(recipientPhone) ? (
                            <p className="mt-1 text-[11px] text-destructive">
                              {recipientPhone.length < 10
                                ? `Enter ${10 - recipientPhone.length} more digit${10 - recipientPhone.length > 1 ? "s" : ""}`
                                : "Must start with 6, 7, 8, or 9"}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                          <div className="flex h-5 items-center justify-between">
                            <label className="text-xs font-semibold text-foreground">Delivery address</label>
                          </div>
                          <Input
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={`mt-1.5 ${step1Attempted && !address.trim()
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                              }`}
                            placeholder="Flat, house no., building, apartment, street"
                          />
                          {step1Attempted && !address.trim() && (
                            <p className="mt-1 text-[11px] text-destructive">Delivery address is required</p>
                          )}
                        </div>
                        <div>
                          <div className="flex h-5 items-center justify-between">
                            <label className="text-xs font-semibold text-foreground">Landmark (Optional)</label>
                          </div>
                          <Input
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            className="mt-1.5"
                            placeholder="Near hospital, temple, etc."
                          />
                        </div>
                      </div>

                      {!currentUser ? (
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-1">
                          <span>💡</span>
                          <span>
                            Want to save addresses for 1-click checkout next time?{" "}
                            <a href="/login" className="text-primary font-medium hover:underline">
                              Log in or Sign up
                            </a>
                          </span>
                        </p>
                      ) : (
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={saveRecipientForLater}
                            onChange={(e) => setSaveRecipientForLater(e.target.checked)}
                            className="rounded border-border text-primary focus:ring-primary size-3.5"
                          />
                          <span className="text-xs text-foreground font-medium">
                            Save this recipient in my address book for 1-click checkout next time
                          </span>
                        </label>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl bg-muted/40 border border-border/80 px-4 py-3 text-xs">
                      <div>
                        <span className="font-semibold text-foreground">Delivering to: </span>
                        <span className="text-foreground">{recipientName}</span>
                        <span className="text-muted-foreground"> (+91 {recipientPhone})</span>
                        <p className="text-muted-foreground text-[11px] mt-0.5 line-clamp-1">
                          {address}
                          {landmark ? `, Near ${landmark}` : ""}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRecipientId("new")}
                        className="text-xs h-7 ml-3 shrink-0"
                      >
                        <Edit3 className="size-3 mr-1" />
                        Edit Address
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Delivery</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Landmark</label>
                    <Input value={landmark} onChange={(e) => setLandmark(e.target.value)} className="mt-1 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">City</label>
                    <Input readOnly value={location.city} className="mt-1 bg-primary-soft/40 text-sm font-semibold" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Pincode</label>
                    <Input readOnly value={location.pincode} className="mt-1 bg-primary-soft/40 font-mono text-sm font-semibold" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Instructions</label>
                  <Input value={instructions} onChange={(e) => setInstructions(e.target.value)} className="mt-1 text-sm" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Slot: {firstItem?.deliverySlotTitle || "Standard"} • Date: {firstItem?.deliveryDate || "Today"}
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Personalization</h3>
                  <span className="text-xs text-muted-foreground font-medium">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {items.map((item) => {
                    const specs = getItemAttributes(item);
                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-3.5 rounded-xl border border-border bg-background p-3.5 transition-colors hover:border-primary/20"
                      >
                        {/* Product Thumbnail */}
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-muted-foreground">
                              <Gift className="size-6 opacity-40" />
                            </div>
                          )}
                          {item.isEggless && (
                            <span
                              title="100% Eggless"
                              className="absolute bottom-1 right-1 flex size-3 items-center justify-center rounded-xs border border-emerald-600 bg-white shadow-xs"
                            >
                              <span className="size-1.5 rounded-full bg-emerald-600" />
                            </span>
                          )}
                        </div>

                        {/* Item Details & Personalization Info */}
                        <div className="flex flex-1 flex-col justify-center min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-foreground text-sm truncate">{item.title}</p>
                            <span className="shrink-0 text-xs font-mono font-medium text-foreground">
                              {formatINR(item.unitPrice * item.quantity)}
                            </span>
                          </div>

                          {/* Specification Badges: Quantity, Cake Weight, Flower Count */}
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                            {/* Order Quantity */}
                            <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 font-semibold text-zinc-700 dark:text-zinc-200">
                              Qty: <span className="font-bold text-foreground">{item.quantity}</span>
                            </span>

                            {/* Cake Weight */}
                            {specs.cakeWeight && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 font-medium text-amber-900 dark:text-amber-200">
                                <span>🎂 Cake Weight:</span>
                                <span className="font-bold">{specs.cakeWeight}</span>
                              </span>
                            )}

                            {/* Flower Count */}
                            {specs.flowerCount && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 font-medium text-rose-900 dark:text-rose-200">
                                <span>🌸 Flower Count:</span>
                                <span className="font-bold">{specs.flowerCount}</span>
                              </span>
                            )}

                            {/* Non-cake / non-flower general variant */}
                            {!specs.cakeWeight && !specs.flowerCount && item.variantName && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 font-medium text-zinc-700 dark:text-zinc-200">
                                Variant: <span className="font-bold">{item.variantName}</span>
                              </span>
                            )}

                            {/* Eggless badge */}
                            {item.isEggless && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-medium text-emerald-800 dark:text-emerald-300">
                                <span className="size-1.5 rounded-full bg-emerald-600" />
                                100% Eggless
                              </span>
                            )}
                          </div>

                          <div className="mt-2 space-y-1 text-xs">
                            {item.messageOnCake && (
                              <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-amber-900 dark:text-amber-300 font-medium">
                                <span>🎂 Cake Message:</span>
                                <span className="italic font-semibold">&ldquo;{item.messageOnCake}&rdquo;</span>
                              </div>
                            )}
                            {item.messageOnCard && (
                              <div className="inline-flex items-center gap-1.5 rounded-md bg-rose-500/10 px-2.5 py-1 text-rose-900 dark:text-rose-300 font-medium">
                                <span>💌 Card Message:</span>
                                <span className="italic font-semibold">&ldquo;{item.messageOnCard}&rdquo;</span>
                              </div>
                            )}
                            {!item.messageOnCake && !item.messageOnCard && (
                              <p className="text-xs text-muted-foreground">
                                No personalization added on this item.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Gift className="size-4 text-primary" />
                      Make it an Extra Special Celebration 🎉
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Pair your flowers & cakes with candles, greeting cards, chocolates, or cuddly teddy bears.
                    </p>
                  </div>
                  {firstItem?.addons && firstItem.addons.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                      <Sparkles className="size-3" />
                      {firstItem.addons.reduce((sum, a) => sum + a.quantity, 0)} Added
                    </span>
                  )}
                </div>

                {/* Add-ons Gallery Grid */}
                {loadingAddons && availableAddons.length === 0 ? (
                  <div className="py-12 text-center text-xs text-muted-foreground">
                    Loading celebration add-ons...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-3">
                    {availableAddons.map((addon) => {
                      const qty = getAddonQuantity(addon.id, addon.title);
                      const isAdded = qty > 0;
                      return (
                        <div
                          key={addon.id}
                          className={`group relative flex flex-col justify-between rounded-xl border p-3 transition-all ${isAdded
                            ? "border-primary bg-primary-soft/15 ring-1 ring-primary/40 shadow-xs"
                            : "border-border bg-background hover:border-primary/40 hover:shadow-xs"
                            }`}
                        >
                          <div>
                            {/* Image Container */}
                            <div className="relative mb-2.5 aspect-square w-full overflow-hidden rounded-lg bg-muted">
                              <img
                                src={addon.image}
                                alt={addon.title}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (addon.title.toLowerCase().includes("ferrero")) {
                                    target.src = "/16-peaces-chocolate.jpeg";
                                  } else if (addon.category === "Chocolates") {
                                    target.src = "/16-peaces-chocolate.jpeg";
                                  } else if (addon.category === "Soft Toys") {
                                    target.src = "/teddy.webp";
                                  } else if (addon.category === "Candles") {
                                    target.src = "/images/bento-cake-spotlight.jpg";
                                  } else {
                                    target.src = "/images/hero-flower-cake-bundle.jpg";
                                  }
                                }}
                              />
                              <span className="absolute left-1.5 top-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-white backdrop-blur-xs">
                                {addon.category}
                              </span>
                            </div>

                            {/* Title & Price */}
                            <h4 className="text-xs font-bold text-foreground line-clamp-2 leading-tight">
                              {addon.title}
                            </h4>
                            <p className="mt-1 text-xs font-bold font-mono text-primary">
                              {formatINR(addon.price)}
                            </p>
                          </div>

                          {/* Add / Quantity Button */}
                          <div className="mt-3">
                            {!isAdded ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleAddon(addon, 1)}
                                className="w-full text-xs font-semibold h-7 hover:border-primary hover:bg-primary hover:text-white transition-colors"
                              >
                                <Plus className="size-3 mr-1" />
                                Add
                              </Button>
                            ) : (
                              <div className="flex items-center justify-between rounded-lg border border-primary bg-primary-soft/40 px-2 py-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleAddon(addon, -1)}
                                  className="flex size-6 items-center justify-center rounded text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                                >
                                  -
                                </button>
                                <span className="font-mono text-xs font-bold text-primary">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleToggleAddon(addon, 1)}
                                  className="flex size-6 items-center justify-center rounded text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Footer hint */}
                <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
                  <span>Add-ons are optional. You can continue anytime.</span>
                  {firstItem?.addons && firstItem.addons.length > 0 && (
                    <span className="font-semibold text-foreground">
                      Add-ons subtotal:{" "}
                      {formatINR(
                        firstItem.addons.reduce((acc, a) => acc + a.price * a.quantity, 0)
                      )}
                    </span>
                  )}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Pay with Razorpay</h3>
                <p className="text-sm text-muted-foreground">
                  UPI, cards, netbanking, and wallets via Razorpay secure checkout.
                </p>
                {!razorpayReady && (
                  <p className="text-xs text-amber-700">Loading payment gateway…</p>
                )}
                <Button
                  type="button"
                  size="lg"
                  disabled={isSubmitting || !razorpayReady}
                  onClick={payWithRazorpay}
                  className="gap-2 font-bold"
                >
                  <Lock className="size-4" />
                  Pay {formatINR(total)} securely
                </Button>
              </div>
            )}

            {step === 6 && confirmedOrderNumber && (
              <div className="rounded-2xl border border-success/30 bg-success-soft p-8 text-center">
                <CheckCircle2 className="mx-auto size-10 text-success" />
                <h3 className="mt-3 font-display text-xl font-bold text-foreground">Order placed!</h3>
                <p className="mt-1 text-sm text-muted-foreground">Order #{confirmedOrderNumber}</p>
                <Button className="mt-4" onClick={() => router.push(`/order/${confirmedOrderNumber}`)}>
                  Track order
                </Button>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            {step < 6 && (
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goBack} disabled={step === 1}>
                  <ChevronLeft className="size-4" />
                  Back
                </Button>
                {step < 5 ? (
                  <Button type="button" onClick={goNext}>
                    Continue
                    <ChevronRight className="size-4" />
                  </Button>
                ) : null}
              </div>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Summary</h3>
              {items.map((item) => {
                const specs = getItemAttributes(item);
                return (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-9 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="size-full object-cover" />
                        ) : (
                          <div className="flex size-full items-center justify-center text-muted-foreground">
                            <Gift className="size-3.5 opacity-40" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-medium text-foreground">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Qty: {item.quantity}
                          {specs.cakeWeight ? ` • 🎂 ${specs.cakeWeight}` : ""}
                          {specs.flowerCount ? ` • 🌸 ${specs.flowerCount}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono shrink-0 font-medium">{formatINR(item.unitPrice * item.quantity)}</span>
                  </div>
                );
              })}
              <div className="border-t border-border pt-3 text-sm">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-xl font-bold text-primary tracking-tight tabular-nums">{formatINR(total)}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3.5 text-success" />
                Secure checkout
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => !isDeleting && setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
                <Trash2 className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 id="delete-modal-title" className="text-base font-bold text-foreground">
                  {deleteTarget.type === "sender"
                    ? "Delete Sender Profile?"
                    : "Delete Delivery Address?"}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">
                    &quot;{deleteTarget.name}&quot;
                  </span>
                  ?
                </p>
                {deleteTarget.detail && (
                  <div className="mt-2 rounded-lg bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground font-mono truncate">
                    {deleteTarget.detail}
                  </div>
                )}
                <p className="mt-2 text-[11px] text-muted-foreground">
                  This cannot be undone and will be removed from your saved checkout options.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="text-xs font-semibold"
              >
                {isDeleting ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash2 className="size-3.5 mr-1" />
                    Yes, Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
