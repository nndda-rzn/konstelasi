"use client";

/**
 * ConstellationCard - Decorative brand card with node dot connectors.
 * Dark premium variant.
 */
export function ConstellationCard() {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A99EA6]">
          Konstelasi
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold text-[#F2B84B]">
          Private
        </span>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-2.5 w-2.5 rounded-full bg-[#F2B84B] shadow-[0_0_14px_rgba(242,184,75,0.55)]" />
        <div className="h-px flex-1 bg-gradient-to-r from-[#F2B84B]/40 to-white/5" />
        <div className="h-3.5 w-3.5 rounded-full bg-[#C9D4E8] shadow-[0_0_14px_rgba(201,212,232,0.5)]" />
        <div className="h-px flex-1 bg-gradient-to-r from-[#C9D4E8]/30 to-[#E63946]/20" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#E94B3C] shadow-[0_0_14px_rgba(233,75,60,0.5)]" />
      </div>
      <div className="mt-5 flex gap-2 text-[10px] font-semibold text-[#A99EA6]">
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
          Notes
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
          Stories
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
          Capsule
        </span>
      </div>
    </div>
  );
}
