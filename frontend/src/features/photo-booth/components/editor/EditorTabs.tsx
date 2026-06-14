"use client";

import { Palette, LayoutTemplate, Smile, Type } from "lucide-react";

export type EditorTab = "template" | "filter" | "sticker" | "caption";

/**
 * EditorTabs - Underline tabs for the result editor panel.
 * Tabs: Template · Filter · Stiker · Caption
 *
 * The Frame tab is removed — all frame styling is now part of
 * the Template's sub-options.
 */
export function EditorTabs({
  tab,
  setTab,
}: {
  tab: EditorTab;
  setTab: (t: EditorTab) => void;
}) {
  const items: { key: EditorTab; label: string; icon: any }[] = [
    { key: "template", label: "Template", icon: LayoutTemplate },
    { key: "filter", label: "Filter", icon: Palette },
    { key: "sticker", label: "Stiker", icon: Smile },
    { key: "caption", label: "Caption", icon: Type },
  ];
  return (
    <div className="-mb-px flex gap-4">
      {items.map(({ key, label, icon: Icon }) => {
        const active = tab === key;
        return (
          <button
            key={key}
            onClick={() => setTab(key)}
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
