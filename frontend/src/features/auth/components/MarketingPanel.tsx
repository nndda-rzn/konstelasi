"use client";

import { Gem, Star } from "lucide-react";
import { ConstellationCard } from "./ConstellationCard";

/**
 * MarketingPanel - Left-side hero panel, dark translucent premium.
 */
export function MarketingPanel() {
  return (
    <section className="hidden lg:block">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(14,12,22,0.6)] p-12 shadow-[0_24px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        {/* subtle radial highlight */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#F2B84B]/8 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#7C83FD]/8 blur-[100px]" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-[#D8CDD2]">
            <Star className="h-3.5 w-3.5 text-[#F2B84B]" />
            Private writing studio
          </div>

          <h1 className="mt-9 max-w-xl text-[52px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#F8F4EF]">
            Ruang pribadi untuk merangkai cerita dengan tenang.
          </h1>

          <p className="mt-5 max-w-lg text-[17px] leading-[1.7] text-[#A99EA6]">
            Lanjutkan catatan, story, dan time capsule dalam tampilan yang
            lembut, rapi, dan tetap personal.
          </p>

          <div className="mt-11 grid gap-4">
            <div className="rounded-[20px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md">
              <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#F2B84B]">
                <Gem className="h-4 w-4" />
                Studio focus
              </div>
              <p className="text-sm leading-6 text-[#D8CDD2]/80">
                Tempat masuk yang terasa ringan, namun tetap matang untuk
                menulis hal personal.
              </p>
            </div>
            <ConstellationCard />
          </div>
        </div>
      </div>
    </section>
  );
}
