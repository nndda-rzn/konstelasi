"use client";

import { Gem, Star } from "lucide-react";
import { ConstellationCard } from "./ConstellationCard";

/**
 * MarketingPanel - Left hero. Atmospheric, no large boxed card.
 * Text sits directly over the night sky; only refined sub-elements
 * use subtle translucent panels for readability.
 */
export function MarketingPanel() {
  return (
    <section className="hidden max-w-[620px] lg:block">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-[#D8CDD2] backdrop-blur-md">
        <Star className="h-3.5 w-3.5 text-[#F2B84B]" />
        Private writing studio
      </div>

      <h1 className="mt-7 max-w-xl text-[46px] font-extrabold leading-[1.07] tracking-[-0.03em] text-[#F8F4EF] [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
        Ruang pribadi untuk merangkai cerita dengan tenang.
      </h1>

      <p className="mt-5 max-w-md text-base leading-[1.7] text-[#AFA6AD] [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">
        Lanjutkan catatan, story, dan time capsule di bawah langit malam yang
        tenang dan personal.
      </p>

      <div className="mt-9 flex max-w-md flex-col gap-3.5">
        <div className="rounded-[18px] border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#F2B84B]">
            <Gem className="h-3.5 w-3.5" />
            Studio focus
          </div>
          <p className="text-sm leading-6 text-[#AFA6AD]">
            Tempat masuk yang terasa ringan, namun tetap matang untuk menulis
            hal personal.
          </p>
        </div>
        <ConstellationCard />
      </div>
    </section>
  );
}
