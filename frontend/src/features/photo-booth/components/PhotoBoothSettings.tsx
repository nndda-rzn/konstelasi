"use client";

import { RatioSelector } from "./RatioSelector";
import { LayoutSelector } from "./LayoutSelector";
import { TimerSelector } from "./TimerSelector";
import { FilterSelector } from "./FilterSelector";
import { MoreSettingsPanel } from "./MoreSettingsPanel";

/**
 * PhotoBoothSettings - Sticky right column with internal scroll.
 *
 * - width: parent grid sets 340/360px
 * - max-height: calc(100vh - 120px)
 * - position: sticky; top: 88px (clears the 64px header + small gap)
 * - overflow-y: auto
 * - cards are compact (no large padding, no big red borders)
 */
export function PhotoBoothSettings() {
  return (
    <aside
      className="
        sticky top-[88px]
        w-full self-start
        rounded-2xl border border-black/10 bg-white
        shadow-[0_2px_8px_rgba(60,30,40,0.04)]
        max-h-[calc(100vh-120px)]
        overflow-y-auto
      "
    >
      <div className="flex flex-col gap-3.5 p-3.5">
        <Section label="Format">
          <RatioSelector />
        </Section>

        <Section label="Layout">
          <LayoutSelector />
        </Section>

        <Section label="Timer">
          <TimerSelector />
        </Section>

        <Section label="Filter">
          <FilterSelector />
        </Section>

        <MoreSettingsPanel />
      </div>
    </aside>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-[#8C7783]">
        {label}
      </p>
      {children}
    </div>
  );
}
