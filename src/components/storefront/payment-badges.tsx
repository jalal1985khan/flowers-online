import React from "react";

export function PaymentBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* UPI Badge */}
      <div className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-800/70 hover:bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 shadow-2xs transition">
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 shrink-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 3L14 12L7 21" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 3L19 12L12 21" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-bold tracking-tight text-[11px]">UPI</span>
      </div>

      {/* Razorpay Badge */}
      <div className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-800/70 hover:bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 shadow-2xs transition">
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 shrink-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.6 2H10.1C9.4 2 8.7 2.4 8.4 3.1L3.1 14.8C2.8 15.5 3.3 16.3 4.1 16.3H9.4L6.9 22L19.9 8.2C20.6 7.4 20.1 6.2 19 6.2H14.1L17.6 2Z"
            fill="#3395FF"
          />
        </svg>
        <span className="font-semibold tracking-tight text-[11px]">Razorpay</span>
      </div>

      {/* PhonePe Badge */}
      <div className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-800/70 hover:bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 shadow-2xs transition">
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 shrink-0 rounded-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="12" fill="#5F259F" />
          <path
            d="M12 5.5v13M12 11a3.5 3.5 0 0 0 0-7M7.5 9h9"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="14" r="1.5" fill="#ffffff" />
        </svg>
        <span className="font-semibold tracking-tight text-[11px]">PhonePe</span>
      </div>

      {/* Visa Badge */}
      <div className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-800/70 hover:bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 shadow-2xs transition">
        <svg
          viewBox="0 0 36 12"
          className="h-3 w-8 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="0"
            y="10"
            fill="#2563eb"
            fontFamily="sans-serif"
            fontWeight="900"
            fontStyle="italic"
            fontSize="12"
            letterSpacing="0.5"
          >
            VISA
          </text>
        </svg>
        <span className="font-semibold tracking-tight text-[11px]">Visa</span>
      </div>

      {/* Mastercard Badge */}
      <div className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-800/70 hover:bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 shadow-2xs transition">
        <svg
          viewBox="0 0 24 15"
          className="h-3.5 w-5 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="7.5" cy="7.5" r="7.5" fill="#EB001B" />
          <circle cx="16.5" cy="7.5" r="7.5" fill="#F79E1B" fillOpacity="0.9" />
        </svg>
        <span className="font-semibold tracking-tight text-[11px]">Mastercard</span>
      </div>
    </div>
  );
}
