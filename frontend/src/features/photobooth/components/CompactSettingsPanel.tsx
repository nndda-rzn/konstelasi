"use client";

import { RatioSelector } from "./RatioSelector";
import { TimerSelector } from "./TimerSelector";
import { LayoutDropdown } from "./LayoutDropdown";
import { EffectsToggleGroup } from "./EffectsToggleGroup";
import { MoreSettingsPopover } from "./MoreSettingsPopover";

/**
 * CompactSettingsPanel - Studio-style settings column.
 * Fits one viewport without internal scroll at 1366x768.
 * Order: Format (ratio) → Layout → Timer → Effects → More.
 */
export function CompactSettingsPanel() {
  return (
    <div className="flex flex-col gap-3.5 rounded-3xl border border-[#FFB8C0]/20 bg-white/65 p-4 shadow-[0_8px_24px_rgba(84,45,55,0.08)] backdrop-blur-2xl">
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
      <p className="text-[9px] font-bold uppercase tracking-widest text-[#8C7783]">
        {label}
      </p>
      {children}
    </div>
  );
}
