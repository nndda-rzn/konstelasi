"use client";

import { Palette, LayoutTemplate, Smile } from "lucide-react";
import type { EditTab } from "../../constants";
import { usePhotoboothStore } from "../../store/usePhotoboothStore";

const TABS: Array<{ key: EditTab; label: string; icon: any }> = [
  { key: "filter", label: "Filter", icon: Palette },
  { key: "color", label: "Warna", icon: LayoutTemplate },
  { key: "sticker", label: "Stiker", icon: Smile },
];

/**
 * EditorTabs - Underline tab indicator, product-editor style.
 */
export function EditorTabs() {
  const activeTab = usePhotoboothStore((s) => s.activeTab);
  const setActiveTab = usePhotoboothStore((s) => s.setActiveTab);

  return (
    <div className="-mb-px flex gap-4">
      {TABS.map(({ key, label, icon: Icon }) => {
        const active = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 border-b-2 pb-2 text-[12px] font-semibold transition-colors ${
              active
                ? "border-[#E63946] text-[#3F2A35]"
                : "border-transparent text-[#8C7783] hover:text-[#3F2A35]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
