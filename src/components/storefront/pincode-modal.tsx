"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "@/lib/location-context";
import { MapPin, CheckCircle2, AlertCircle } from "lucide-react";

const POPULAR_CITIES = [
  { city: "Bengaluru", pincode: "560001", area: "MG Road" },
  { city: "Bengaluru", pincode: "560038", area: "Indiranagar" },
  { city: "Delhi", pincode: "110001", area: "Connaught Place" },
  { city: "Mumbai", pincode: "400001", area: "Fort" },
  { city: "Gurugram", pincode: "122001", area: "Cyber City" },
];

export function PincodeModal() {
  const { isPincodeModalOpen, setIsPincodeModalOpen, location, setLocation, checkPincode } =
    useLocation();
  const [inputPin, setInputPin] = useState(location.pincode);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async (pin: string) => {
    setError(null);
    if (!/^\d{6}$/.test(pin.trim())) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setIsLoading(true);
    const result = await checkPincode(pin.trim());
    setIsLoading(false);

    if (result.valid && result.city) {
      setLocation({
        pincode: pin.trim(),
        city: result.city,
        areaName: result.area,
        isEligible: true,
      });
      setIsPincodeModalOpen(false);
    } else {
      setError("Sorry, delivery is currently not serviceable at this pincode. Try 560001 or 560038.");
    }
  };

  return (
    <Modal
      isOpen={isPincodeModalOpen}
      onClose={() => setIsPincodeModalOpen(false)}
      title="Select Delivery Location"
      description="Enter delivery pincode to see available flowers, cakes, and midnight delivery slots."
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit Pincode (e.g. 560038)"
              className="pl-9 font-medium tracking-wide"
              value={inputPin}
              onChange={(e) => {
                setInputPin(e.target.value.replace(/\D/g, ""));
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCheck(inputPin);
              }}
            />
          </div>
          <Button
            onClick={() => handleCheck(inputPin)}
            disabled={isLoading || inputPin.length !== 6}
            className="px-6"
          >
            {isLoading ? "Checking..." : "Confirm"}
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Popular Delivery Zones
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {POPULAR_CITIES.map((item) => (
              <button
                key={item.pincode}
                onClick={() => {
                  setInputPin(item.pincode);
                  handleCheck(item.pincode);
                }}
                className={`flex flex-col items-start rounded-lg border p-2.5 text-left text-xs transition hover:border-rose-300 hover:bg-rose-50/50 ${
                  location.pincode === item.pincode
                    ? "border-rose-500 bg-rose-50/60 font-medium text-rose-900"
                    : "border-zinc-200 text-zinc-700"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-semibold text-zinc-900">{item.city}</span>
                  {location.pincode === item.pincode && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-rose-600" />
                  )}
                </div>
                <span className="text-zinc-500 text-[11px]">{item.area}</span>
                <span className="font-mono text-[10px] text-zinc-400">{item.pincode}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
