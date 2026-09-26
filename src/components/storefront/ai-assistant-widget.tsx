"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  X,
  Send,
  ShoppingBag,
  Check,
  ArrowRight,
  User,
  CreditCard,
  RefreshCw,
  MessageCircle,
  ChevronDown,
  Gift,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/utils";

interface ProductItem {
  id: string;
  slug: string;
  title: string;
  basePrice: number;
  compareAtPrice: number | null;
  image: string;
  categoryName: string;
  isEgglessAvailable: boolean;
  vendorId: string;
}

interface ActionChip {
  label: string;
  type: "query" | "checkout" | "login" | "cart";
  payload?: string;
  variant?: "primary" | "cart" | "default";
}

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  products?: ProductItem[];
  actions?: ActionChip[];
  timestamp: string;
  authPrompt?: boolean;
  checkoutPrompt?: boolean;
}

export function AIAssistantWidget() {
  const router = useRouter();
  const { addItem, items, total, itemCount } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadPulse, setHasUnreadPulse] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string; name?: string; email?: string } | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      sender: "ai",
      text: "👋 Hi there! I'm Petals AI, your personal gifting assistant for MyPetalsCart.\n\nWhat are you celebrating today? I can help you pick the perfect flowers, cakes, or combos, add them straight to your bag, and guide you through payment!",
      actions: [
        { label: "🎂 Birthday Cake under ₹999", type: "query", payload: "Show me birthday cakes under 999" },
        { label: "🌹 Romantic Roses & Cake", type: "query", payload: "I need flowers and cake for anniversary" },
        { label: "🍰 Trendy Bento Mini Cake", type: "query", payload: "Show me trending bento cakes" },
        { label: "🌱 Indoor Plant & Chocolates", type: "query", payload: "Show live plants and chocolates gift" },
      ],
      timestamp: "Just now",
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch logged-in user details
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => { });
  }, []);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasUnreadPulse(false);
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isTyping) return;

    setInputVal("");

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          user: currentUser,
          cartCount: itemCount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process message");

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.reply,
        products: data.products,
        actions: data.suggestedActions,
        authPrompt: data.authPrompt,
        checkoutPrompt: data.checkoutPrompt,
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "I'm having a slight trouble connecting to our catalog right now. Please try again or browse our categories directly!",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddToCart = (product: ProductItem) => {
    const titleLower = product.title.toLowerCase();
    const isCake = titleLower.includes("cake") || titleLower.includes("pastry") || titleLower.includes("bento") || product.isEgglessAvailable;
    const isFlower = titleLower.includes("flower") || titleLower.includes("rose") || titleLower.includes("lily") || titleLower.includes("bouquet") || titleLower.includes("carnation") || titleLower.includes("orchid");
    const defaultVariant = isCake ? "0.5 kg (Standard)" : isFlower ? "10-12 Stems (Standard Bouquet)" : "Standard";

    addItem({
      productId: product.id,
      vendorId: product.vendorId || "default-vendor",
      title: product.title,
      image: product.image,
      variantName: defaultVariant,
      unitPrice: product.basePrice,
      quantity: 1,
      isEggless: product.isEgglessAvailable,
    });

    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));

    // Compute updated cart totals
    const nextCount = itemCount + 1;
    const nextTotal = total + product.basePrice;

    // Send confirmation in-chat
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          sender: "ai",
          text: `🎉 Added **${product.title}** (${formatINR(product.basePrice)}) to your bag!`,
          actions: [
            {
              label: `🛍️ ${nextCount} ${nextCount === 1 ? "Product" : "Products"} in Bag • ${formatINR(nextTotal)}`,
              type: "cart",
              payload: "/cart",
              variant: "cart",
            },
            {
              label: "💳 Proceed to Payment",
              type: "checkout",
              payload: "/checkout",
              variant: "primary",
            },
            {
              label: "🌹 Add More Flowers",
              type: "query",
              payload: "Show me fresh flower bouquets",
            },
          ],
          timestamp: "Just now",
        },
      ]);
    }, 400);
  };

  const handleActionClick = (action: ActionChip) => {
    if (action.type === "checkout") {
      router.push(action.payload || "/checkout");
      setIsOpen(false);
    } else if (action.type === "login") {
      router.push(action.payload || "/login?redirect=/checkout");
      setIsOpen(false);
    } else if (action.type === "cart") {
      router.push("/cart");
      setIsOpen(false);
    } else if (action.type === "query" && action.payload) {
      handleSend(action.payload);
    }
  };

  return (
    <>
      {/* 1. FLOATING BOTTOM-RIGHT TRIGGER BUTTON */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5">
          {/* Gentle Attention Pill */}
          {hasUnreadPulse && (
            <div
              onClick={handleOpen}
              className="hidden sm:flex items-center gap-2 rounded-full bg-white border border-rose-200 px-4 py-2 text-xs font-bold text-rose-700 shadow-xl cursor-pointer hover:border-rose-400 hover:shadow-2xl transition-all"
              style={{
                boxShadow: "0 6px 20px -2px rgba(225, 29, 72, 0.25)",
              }}
            >
              <Sparkles className="h-4 w-4 text-rose-600 fill-rose-500 animate-pulse" />
              <span>Need gift advice? Chat with AI</span>
            </div>
          )}

          <button
            onClick={handleOpen}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #e11d48 0%, #be123c 60%, #9f1239 100%)",
              boxShadow: "0 10px 25px -4px rgba(225, 29, 72, 0.55), 0 4px 10px -2px rgba(225, 29, 72, 0.4)",
              border: "2.5px solid #ffffff",
            }}
            aria-label="Open Bloomie AI Assistant"
          >
            <div className="relative flex items-center justify-center">
              <MessageCircle className="h-7 w-7 text-white fill-white/20" />
              <Sparkles className="absolute -top-1.5 -right-2 h-4 w-4 text-amber-300 fill-amber-300 animate-pulse" />
            </div>

            {/* Active Online Status Badge */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-xs" />
            </span>
          </button>
        </div>
      )}

      {/* 2. CHATGPT-STYLE EXPANDED CONVERSATION MODAL */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white sm:inset-y-auto sm:bottom-5 sm:right-5 sm:h-[620px] sm:max-h-[85vh] sm:rounded-3xl sm:border sm:border-zinc-200 sm:shadow-2xl overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-6">
          {/* Header */}
          <div
            className="flex items-center justify-between border-b border-rose-700 px-4 py-3.5 text-white shadow-xs"
            style={{
              background: "linear-gradient(135deg, #e11d48 0%, #be123c 60%, #9f1239 100%)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white">
                <Sparkles className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-rose-600" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight leading-tight">Petals AI</h3>
                  <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider">
                    Concierge
                  </span>
                </div>
                <p className="text-[10px] text-rose-100">MyPetalsCart Gifting Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition"
                title="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* User Auth Banner in Chat */}
          <div className="flex items-center justify-between bg-zinc-50 border-b border-zinc-150 px-4 py-1.5 text-[11px] text-zinc-600">
            {currentUser ? (
              <div className="flex items-center gap-1.5 truncate">
                <User className="h-3 w-3 text-emerald-600 shrink-0" />
                <span>Signed in as <strong className="text-zinc-800">{currentUser.name || currentUser.email}</strong></span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-zinc-500">
                <span>Guest Shopper</span>
                <Link
                  href="/login?redirect=/checkout"
                  onClick={() => setIsOpen(false)}
                  className="font-semibold text-rose-600 hover:underline"
                >
                  Sign In to Save Profile
                </Link>
              </div>
            )}

            {itemCount > 0 && (
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1 font-semibold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-md text-[10px] hover:bg-rose-200 transition"
              >
                <ShoppingBag className="h-3 w-3" />
                <span>{itemCount} in bag ({formatINR(total)})</span>
              </Link>
            )}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-zinc-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"
                  }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs leading-relaxed ${msg.sender === "user"
                    ? "bg-rose-600 text-white rounded-br-none"
                    : "bg-white text-zinc-800 border border-zinc-200/80 rounded-bl-none"
                    }`}
                >
                  <p className="whitespace-pre-line">
                    {msg.text.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return (
                          <strong key={idx} className="font-bold text-zinc-950">
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      return part;
                    })}
                  </p>

                  {/* Auth Notification Card inside AI message */}
                  {msg.authPrompt && !currentUser && (
                    <div className="mt-2.5 rounded-xl border border-rose-200 bg-rose-50/70 p-2.5 text-[11px] text-rose-900">
                      <p className="font-semibold">Save your delivery addresses & order history</p>
                      <p className="text-zinc-600 mt-0.5 text-[10px]">
                        Sign in now so you can track your surprise live and redeem points.
                      </p>
                      <Link
                        href="/login?redirect=/checkout"
                        onClick={() => setIsOpen(false)}
                        className="mt-2 inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1 font-bold text-white shadow-xs hover:bg-rose-700 transition"
                      >
                        <User className="h-3 w-3" />
                        <span>Sign In / Register</span>
                      </Link>
                    </div>
                  )}

                  {/* Checkout Notification Card inside AI message */}
                  {msg.checkoutPrompt && itemCount > 0 && (
                    <div className="mt-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-2.5 text-[11px] text-emerald-950">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Total: {formatINR(total)}</span>
                        <span className="text-[10px] text-emerald-800">({itemCount} items in cart)</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push("/checkout");
                        }}
                        className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 py-1.5 font-bold text-white shadow-xs transition"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        <span>Pay Now via Razorpay</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Interactive Product Recommendation Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-full">
                    {msg.products.map((p) => {
                      const isAdded = !!addedItemIds[p.id];
                      return (
                        <div
                          key={p.id}
                          className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-2 shadow-xs hover:border-rose-200 transition"
                        >
                          <div>
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 mb-1.5">
                              <Image
                                src={p.image}
                                alt={p.title}
                                fill
                                sizes="160px"
                                className="object-cover"
                              />
                              {p.isEgglessAvailable && (
                                <span className="absolute top-1 left-1 rounded bg-white/90 px-1 py-0.2 text-[8px] font-bold text-emerald-700 border border-emerald-300">
                                  🌱 Veg
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-[11px] text-zinc-900 line-clamp-1">
                              {p.title}
                            </h4>
                            <div className="flex items-center justify-between mt-1 text-[11px]">
                              <span className="font-bold font-mono text-zinc-900">
                                {formatINR(p.basePrice)}
                              </span>
                              {p.compareAtPrice && (
                                <span className="line-through text-zinc-400 text-[10px]">
                                  {formatINR(p.compareAtPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(p)}
                            className={`mt-2 flex items-center justify-center gap-1 w-full rounded-lg py-1.5 text-[10px] font-bold transition ${isAdded
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                              }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="h-3 w-3" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="h-3 w-3" />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Suggested Action Chips */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-full">
                    {msg.actions.map((act, i) => {
                      let chipClass = "rounded-full border border-rose-200 bg-white hover:bg-rose-50/80 px-2.5 py-1 text-[10px] font-semibold text-rose-800 shadow-2xs transition active:scale-95 text-left";
                      if (act.variant === "cart") {
                        chipClass = "rounded-full border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-3 py-1 text-[10px] font-bold shadow-2xs transition active:scale-95 flex items-center gap-1";
                      } else if (act.variant === "primary") {
                        chipClass = "rounded-full bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 text-[10px] font-bold shadow-2xs transition active:scale-95";
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act)}
                          className={chipClass}
                        >
                          {act.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-zinc-200 w-fit px-3 py-2 rounded-2xl rounded-bl-none shadow-xs text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse delay-150" />
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse delay-300" />
                <span className="text-[10px] text-zinc-400 ml-1">Petals AI is searching catalog...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Input Form */}
          <div className="border-t border-zinc-200 bg-white p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask Petals AI (e.g. chocolate cake under 800)..."
                className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs hover:bg-rose-700 disabled:opacity-40 transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-zinc-400 px-1 pt-1.5">
              <span><Link href="https://www.socialhive.pro" target="_blank" className="text-rose-600 font-semibold hover:underline">Powered by SocialHive AI</Link></span>
              {itemCount > 0 && (
                <Link href="/checkout" onClick={() => setIsOpen(false)} className="text-rose-600 font-semibold hover:underline">
                  Checkout ({itemCount}) →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
