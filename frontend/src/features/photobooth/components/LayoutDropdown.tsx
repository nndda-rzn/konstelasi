"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { LAYOUTS, type LayoutKey } from "../constants";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

/**
 * LayoutDropdown - Compact pill button that opens a popover with 8 layout
 * options. Hides the visual weight of 8 cards while keeping all options
 * one click away. Closes on outside click and Escape.
 */
export function LayoutDropdown() {
  const selectedLayout = usePhotoboothStore((s) => s.selectedLayout);
  const setSelectedLayout = usePhotoboothStore((s) => s.setSelectedLayout);

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = LAYOUTS.find((l) => l.key === selectedLayout) ?? LAYOUTS[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white/55 px-3 py-2 text-left backdrop-blur-md transition-all ${
          open
            ? "border-[#E63946]/40"
            : "border-[#FFB8C0]/20 hover:border-[#FFB8C0]/45"
        }`}
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-bold text-[#3F2A35]">
            {current.label}
          </p>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-[#8C7783] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-[280px] overflow-y-auto rounded-2xl border border-[#FFB8C0]/25 bg-white/95 p-1.5 shadow-[0_8px_24px_rgba(84,45,55,0.12)] backdrop-blur-2xl">
          {LAYOUTS.map((l) => {
            const active = l.key === selectedLayout;
            return (
              <button
                key={l.key}
                onClick={() => {
                  setSelectedLayout(l.key as LayoutKey);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                  active
                    ? "bg-[#E63946]/8"
                    : "hover:bg-[#FFE5E8]/60"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[12px] font-bold ${
                      active ? "text-[#E63946]" : "text-[#3F2A35]"
                    }`}
                  >
                    {l.label}
                  </p>
                  <p className="truncate text-[10px] text-[#8C7783]">
                    {l.desc}
                  </p>
                </div>
                {active && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#E63946]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
