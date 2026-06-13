"use client";

/**
 * ConstellationCard - Decorative brand card with node dot connectors.
 */
export function ConstellationCard() {
  return (
    <div className="max-w-md rounded-[1.8rem] border border-white/55 bg-gradient-to-br from-white/88 via-[#FFF4EC]/75 to-[#FFE5E8]/62 p-5 shadow-[0_18px_52px_rgba(157,2,8,0.12)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9D0208]/68">
          Konstelasi
        </span>
        <span className="rounded-full bg-[#9D0208]/8 px-2.5 py-1 text-[10px] font-bold text-[#9D0208]">
          Private
        </span>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-[#B8860B] shadow-[0_0_18px_rgba(184,134,11,0.45)]" />
        <div className="h-px flex-1 bg-gradient-to-r from-[#B8860B]/45 to-[#FFB8C0]/10" />
        <div className="h-4 w-4 rounded-full bg-[#7C83FD] shadow-[0_0_18px_rgba(124,131,253,0.45)]" />
        <div className="h-px flex-1 bg-gradient-to-r from-[#7C83FD]/35 to-[#E63946]/24" />
        <div className="h-3 w-3 rounded-full bg-[#E63946] shadow-[0_0_18px_rgba(230,57,70,0.45)]" />
      </div>
      <div className="mt-5 flex gap-2 text-[10px] font-semibold text-[#5A3E4C]/48">
        <span className="rounded-full border border-[#E6B8A2]/40 bg-white/50 px-2.5 py-1">
          Notes
        </span>
        <span className="rounded-full border border-[#E6B8A2]/40 bg-white/50 px-2.5 py-1">
          Stories
        </span>
        <span className="rounded-full border border-[#E6B8A2]/40 bg-white/50 px-2.5 py-1">
          Capsule
        </span>
      </div>
    </div>
  );
}
