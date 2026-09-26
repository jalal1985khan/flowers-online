"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import {
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VendorNewOrderNotification {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  recipientName: string;
  recipientPhone: string;
  total: number;
  deliverySlot: string;
  createdAt: string;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
  }>;
}

export function VendorOrderNotifier() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeAlerts, setActiveAlerts] = useState<VendorNewOrderNotification[]>([]);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const lastTimestampRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const titleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const originalTitleRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    originalTitleRef.current = document.title;

    const savedPref = localStorage.getItem("vendor_order_sound_enabled");
    if (savedPref !== null) {
      setSoundEnabled(savedPref === "true");
    }

    const audio = new Audio("/notification-orders.mp3");
    audio.preload = "auto";
    audioRef.current = audio;

    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            audioRef.current?.pause();
            if (audioRef.current) audioRef.current.currentTime = 0;
            setAudioUnlocked(true);
          })
          .catch(() => {});
      }
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };

    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      if (titleIntervalRef.current) clearInterval(titleIntervalRef.current);
    };
  }, []);

  const testSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => setAudioUnlocked(true))
        .catch((err) => {
          console.warn("Could not play notification audio:", err);
        });
    }
  };

  const playNotificationSound = () => {
    if (!soundEnabled || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((err) => {
      console.warn("Audio autoplay blocked by browser:", err);
    });
  };

  // Flashing document title for visibility in background tabs
  useEffect(() => {
    if (activeAlerts.length > 0) {
      let toggle = false;
      if (titleIntervalRef.current) clearInterval(titleIntervalRef.current);

      titleIntervalRef.current = setInterval(() => {
        document.title = toggle
          ? `🔔 (${activeAlerts.length}) New Order! - Vendor Portal`
          : originalTitleRef.current || "Vendor Portal - MyPetalsCart";
        toggle = !toggle;
      }, 1000);
    } else {
      if (titleIntervalRef.current) clearInterval(titleIntervalRef.current);
      if (originalTitleRef.current) {
        document.title = originalTitleRef.current;
      }
    }

    return () => {
      if (titleIntervalRef.current) clearInterval(titleIntervalRef.current);
    };
  }, [activeAlerts.length]);

  // Polling loop
  useEffect(() => {
    let isMounted = true;

    async function pollOrders() {
      try {
        const url = lastTimestampRef.current
          ? `/api/vendor/orders/latest?since=${encodeURIComponent(lastTimestampRef.current)}`
          : `/api/vendor/orders/latest`;

        const res = await fetch(url);
        if (!res.ok) return;

        const data = await res.json();
        if (!isMounted) return;

        if (!lastTimestampRef.current) {
          lastTimestampRef.current = data.latestTimestamp;
        } else if (data.orders && data.orders.length > 0) {
          lastTimestampRef.current = data.latestTimestamp;
          setActiveAlerts((prev) => [...data.orders, ...prev].slice(0, 5));
          playNotificationSound();
        }
      } catch (e) {
        console.error("Vendor order polling failed:", e);
      }
    }

    pollOrders();
    const interval = setInterval(pollOrders, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [soundEnabled]);

  const dismissAlert = (orderId: string) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== orderId));
  };

  return (
    <>
      {/* Floating Order Alert Toasts (Top-Right) */}
      {activeAlerts.length > 0 && (
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 w-96 max-w-[calc(100vw-2.5rem)] pointer-events-auto animate-in slide-in-from-top-4 fade-in duration-300">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-2xl border-2 border-rose-600 bg-white p-4 shadow-2xl text-zinc-900 ring-4 ring-rose-500/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/30">
                    <ShoppingBag className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                        New Order for Preparation!
                      </span>
                      <Sparkles className="h-3 w-3 text-amber-500" />
                    </div>
                    <div className="font-mono text-sm font-bold text-zinc-900">
                      #{alert.orderNumber}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => dismissAlert(alert.id)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Order Content Summary */}
              <div className="mt-3 rounded-xl bg-zinc-50 p-2.5 text-xs space-y-1.5 border border-zinc-200">
                <div className="flex justify-between font-semibold text-zinc-900">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Deliver to: {alert.recipientName}</span>
                  </span>
                  <span className="font-mono font-bold text-rose-600">
                    {formatINR(alert.total)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-600">
                  <Clock className="h-3 w-3 text-rose-500" />
                  <span>Slot: {alert.deliverySlot}</span>
                </div>
                {alert.items && alert.items.length > 0 && (
                  <p className="text-[11px] text-zinc-600 truncate pt-0.5 border-t border-zinc-200">
                    Items: {alert.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}
                  </p>
                )}
              </div>

              {/* CTA Action */}
              <div className="mt-3 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={testSound}
                  className="h-8 text-xs text-zinc-500 hover:text-zinc-900 gap-1.5 px-2"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Replay Sound</span>
                </Button>

                <Link
                  href="/vendor"
                  onClick={() => dismissAlert(alert.id)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition"
                >
                  <span>Accept & Prepare Order</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Audio Unlock Banner (If browser blocked audio before any user click) */}
      {!audioUnlocked && (
        <button
          type="button"
          onClick={testSound}
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900 shadow-lg hover:bg-amber-100 transition duration-150"
        >
          <Volume2 className="h-4 w-4 text-amber-600 animate-bounce" />
          <span>Click to enable sound alerts for new orders</span>
        </button>
      )}
    </>
  );
}

/**
 * Compact sound toggle button for Vendor Top Bar / Header
 */
export function VendorSoundControl() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("vendor_order_sound_enabled");
    if (saved !== null) {
      setSoundEnabled(saved === "true");
    }
    audioRef.current = new Audio("/notification-orders.mp3");
  }, []);

  const toggle = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("vendor_order_sound_enabled", String(next));
    if (next && audioRef.current) {
      playTest();
    }
  };

  const playTest = () => {
    if (!audioRef.current) return;
    setIsPlaying(true);
    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .then(() => {
        setTimeout(() => setIsPlaying(false), 2000);
      })
      .catch((e) => {
        console.warn(e);
        setIsPlaying(false);
      });
  };

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs">
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 transition"
        title={soundEnabled ? "Sound Alerts Enabled (Click to mute)" : "Sound Alerts Muted (Click to enable)"}
      >
        {soundEnabled ? (
          <Volume2 className="h-3.5 w-3.5 text-rose-600" />
        ) : (
          <VolumeX className="h-3.5 w-3.5 text-zinc-400" />
        )}
        <span className="font-semibold text-[11px]">
          {soundEnabled ? "Sound: ON" : "Sound: OFF"}
        </span>
      </button>

      {soundEnabled && (
        <>
          <span className="text-zinc-300">|</span>
          <button
            type="button"
            onClick={playTest}
            disabled={isPlaying}
            className="text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:underline"
          >
            {isPlaying ? "Playing..." : "Test"}
          </button>
        </>
      )}
    </div>
  );
}
