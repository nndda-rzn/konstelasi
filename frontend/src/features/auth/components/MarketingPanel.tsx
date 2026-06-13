"use client";

import { ConstellationCard } from "./ConstellationCard";

/**
 * MarketingPanel - Left hero. Editorial, atmospheric, text-led.
 * No decorative icons; identity comes from typography and restraint.
 */
export function MarketingPanel() {
  return (
    <section className="hidden max-w-[600px] lg:block">
      <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#8C8088]">
        <span className="h-1 w-1 rounded-full bg-[#F2B84B]" />
        Private writing studio
      </div>

      <h1 className="mt-8 max-w-xl text-[46px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#F8F4EF] [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
        A private space for shaping stories in peace.
      </h1>

      <p className="mt-6 max-w-md text-[17px] leading-[1.75] text-[#AFA6AD] [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">
        Continue your notes, stories, and time capsules in a calm, personal
        workspace.
      </p>

      <div className="mt-11 flex max-w-md flex-col gap-3">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-xl">
          <div className="mb-2 flex items-center gap-2.5">
            <span className="h-px w-5 bg-[#F2B84B]/70" />
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#C9BFC4]">
              Writing focus
            </span>
          </div>
          <p className="text-sm leading-6 text-[#AFA6AD]">
            A quiet entry point designed for personal writing and reflection.
          </p>
        </div>
        <ConstellationCard />
      </div>
    </section>
  );
}
