"use client";

import { RatioSelector } from "./RatioSelector";
import { TimerSelector } from "./TimerSelector";
import { LayoutDropdown } from "./LayoutDropdown";
import { EffectsToggleGroup } from "./EffectsToggleGroup";
import { MoreSettingsPopover } from "./MoreSettingsPopover";

/**
 * CompactSettingsPanel - Right column settings rail.
 * Width set by parent grid (340px). Reduced radius and shadows for a
 * calmer, product-like look.
 */
export function CompactSettingsPanel() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <Section label="Format">
        <RatioSelector />
      </Section>

      <Section label="Layout">
        <LayoutDropdown />
      </Section>

      <Section label="Timer">
        <TimerSelector />
      </Section>

      <Section label="Efek">
        <EffectsToggleGroup />
      </Section>

      <MoreSettingsPopover />
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
