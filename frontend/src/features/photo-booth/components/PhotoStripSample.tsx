"use client";

import { BrandMark } from "./BrandMark";

/**
 * PhotoStripSample - Decorative sample photo strip shown on the
 * welcome screen. 4 frames with varied warm tones, soft shadow
 * like a printed photo, and a "Constella" signature at the bottom.
 */
export function PhotoStripSample({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative inline-block rounded-2xl border border-black/[0.08] bg-[#FAF8F5] p-2.5 shadow-[0_10px_28px_rgba(60,30,40,0.10)] ${className}`}
    >
      <div className="flex w-36 flex-col gap-1.5">
        {frameGradients.map((g, i) => (
          <div
            key={i}
            className="h-24 w-32 rounded-md"
            style={{ background: g }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center gap-1.5">
        <BrandMark size="sm" />
        <span className="text-[9px] text-[#8C7783]">· 14 Jun 2026</span>
      </div>
    </div>
  );
}

const frameGradients = [
  "linear-gradient(135deg,#FFE5E8 0%,#FFB8C0 60%,#FF9AAB 100%)",
  "linear-gradient(135deg,#F5ECD7 0%,#E8D4B0 50%,#D9B98A 100%)",
  "linear-gradient(135deg,#EDE7F6 0%,#D6C8E8 50%,#B9A6D6 100%)",
  "linear-gradient(135deg,#FCE4EC 0%,#F8BBD0 60%,#F48FB1 100%)",
];
