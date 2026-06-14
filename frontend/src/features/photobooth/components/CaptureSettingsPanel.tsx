"use client";

import { Settings2 } from "lucide-react";
import { LayoutSelector } from "./LayoutSelector";
import { RatioSelector } from "./RatioSelector";
import { TimerSelector } from "./TimerSelector";
import { ZoomSelector } from "./ZoomSelector";
import { ToggleRow } from "./ToggleRow";

interface CaptureSettingsPanelProps {
  onStart: () => void;
}

/**
 * CaptureSettingsPanel - Comprehensive configuration panel for the photobooth.
 * Grouped into Ratio, Layout, Timer, Zoom, and Additional Toggles.
 */
export function CaptureSettingsPanel({ onStart }: CaptureSettingsPanelProps) {
  return (
    <div className="flex flex-col gap-6 rounded-[32px] border border-[#FFB8C0]/25 bg-white/70 p-6 shadow-xl backdrop-blur-2xl xl:p-8">
      <div className="flex items-center gap-3 border-b border-[#FFB8C0]/15 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E63946]/6 text-[#E63946]">
          <Settings2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#3F2A35]">Pengaturan</h2>
          <p className="text-[10px] text-[#8C7783]">Sesuaikan format, timer, dan tampilan.</p>
        </div>
      </div>

      <div className="space-y-8 overflow-y-auto pr-1 max-h-[60vh] custom-scrollbar">
        <RatioSelector />
        <LayoutSelector />
        <TimerSelector />
        <ZoomSelector />
        <ToggleRow />
      </div>
    </div>
  );
}
