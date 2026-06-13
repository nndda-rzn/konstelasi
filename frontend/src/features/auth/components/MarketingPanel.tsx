"use client";

import { Gem, Star } from "lucide-react";
import { ConstellationCard } from "./ConstellationCard";

/**
 * MarketingPanel - Left-side intro panel with brand visuals.
 */
export function MarketingPanel() {
  return (
    <section className="hidden lg:block">
      <div className="relative rounded-[2rem] border border-white/55 bg-white/38 p-8 shadow-[0_28px_90px_rgba(84,45,55,0.14)] backdrop-blur-2xl">
        <div className="absolute -right-5 -top-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#D9A441] via-[#E86A76] to-[#9D0208] text-white shadow-[0_18px_44px_rgba(157,2,8,0.22)] animate-float">
          <Gem className="h-7 w-7" />
        </div>
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#E6B8A2]/45 bg-white/62 px-3 py-1.5 text-xs font-semibold text-[#9D0208] shadow-sm">
          <Star className="h-3.5 w-3.5" />
          Private writing studio
        </div>
        <h1 className="max-w-xl text-5xl font-black leading-[1.03] tracking-[-0.04em] text-[#3F2A35]">
          Ruang pribadi untuk merangkai cerita dengan tenang.
        </h1>
        <p className="mt-5 max-w-lg text-sm leading-7 text-[#5A3E4C]/62">
          Lanjutkan catatan, story, dan time capsule dalam tampilan yang
          lembut, rapi, dan tetap personal.
        </p>
        <div className="mt-10 grid gap-4">
          <div className="ml-8 max-w-sm rounded-[1.6rem] border border-[#E6B8A2]/35 bg-white/75 p-4 shadow-[0_16px_42px_rgba(84,45,55,0.10)] backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#9D0208]">
              <Gem className="h-4 w-4" />
              Studio focus
            </div>
            <p className="text-sm leading-6 text-[#5A3E4C]/70">
              Tempat masuk yang terasa ringan, namun tetap matang untuk
              menulis hal personal.
            </p>
          </div>
          <ConstellationCard />
        </div>
      </div>
    </section>
  );
}
