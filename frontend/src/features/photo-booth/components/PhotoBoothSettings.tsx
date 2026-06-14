"use client";

import { RatioSelector } from "./RatioSelector";
import { LayoutSelector } from "./LayoutSelector";
import { TimerSelector } from "./TimerSelector";
import { FilterSelector } from "./FilterSelector";
import { MoreSettingsPanel } from "./MoreSettingsPanel";

/**
 * PhotoBoothSettings - Camera-stage settings column.
 * Width set by parent grid (~340px). Reduced radius/shadow.
 */
export function PhotoBoothSettings() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-4 shadow-sm">
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
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6D5561]">
        {label}
      </p>
      {children}
    </div>
  );
}
