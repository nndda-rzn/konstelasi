"use client";

/**
 * ConstellationCard - Subtle product-story card with a small node motif.
 * Understated markers, no loud colors or decorative icons.
 */
export function ConstellationCard() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#8C8088]">
          Constellation
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#7F747C]">
          Private
        </span>
      </div>

      {/* node motif: small dots joined by thin lines */}
      <div className="mt-5 flex items-center">
        <span className="h-1.5 w-1.5 rounded-full bg-[#F2E6CF]" />
        <span className="h-px flex-1 bg-white/12" />
        <span className="h-2 w-2 rounded-full bg-[#F2B84B]/90" />
        <span className="h-px flex-1 bg-white/12" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#C9D4E8]/80" />
      </div>

      <div className="mt-5 flex gap-4 text-[11px] font-medium text-[#8C8088]">
        <span>Notes</span>
        <span>Stories</span>
        <span>Time capsules</span>
      </div>
    </div>
  );
}
