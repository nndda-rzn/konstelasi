"use client";

import { LayoutTemplate, Palette, Smile } from "lucide-react";
import type { EditTab } from "../../constants";
import { usePhotoboothStore } from "../../store/usePhotoboothStore";

const TABS: Array<{ key: EditTab; label: string; icon: any }> = [
  { key: "filter", label: "Filter", icon: Palette },
  { key: "color", label: "Warna", icon: LayoutTemplate },
  { key: "sticker", label: "Stiker", icon: Smile },
];

/**
 * EditorTabs - Tab switcher for filter/color/sticker panels.
 */
export function EditorTabs() {
  const activeTab = usePhotoboothStore((s) => s.activeTab);
  const setActiveTab = usePhotoboothStore((s) => s.setActiveTab);

  return (
    <div className="flex gap-1 rounded-2xl border border-[#FFB8C0]/20 bg-white/50 p-1">
      {TABS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-semibold transition-all ${
            activeTab === key
              ? "bg-[#E63946] text-white shadow-sm"
              : "text-[#6D5561] hover:text-[#3F2A35]"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
