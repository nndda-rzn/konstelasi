"use client";

import { BrandMark } from "@/features/auth/components/BrandMark";

/**
 * CanvasToolbarBrand - Constella monogram + wordmark.
 * Plain, editorial, no gradient candy.
 */
export function CanvasToolbarBrand() {
  return (
    <div className="flex items-center gap-2 pr-3 border-r border-[rgba(47,39,48,0.08)]">
      <BrandMark size={22} />
      <h1 className="text-[14px] font-semibold tracking-[-0.01em] text-[#2F2730] hidden sm:block">
        Constella
      </h1>
    </div>
  );
}
