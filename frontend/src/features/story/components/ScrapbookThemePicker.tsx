'use client';

import { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { SCRAPBOOK_BACKGROUNDS, SCRAPBOOK_FONTS, parseScrapbookTheme } from '@/features/story/utils/scrapbookTheme';

interface Props {
  /** Raw scrapbookTheme JSON string from the story (or undefined for default). */
  value: string | null | undefined;
  /** Called with the new JSON string when user changes background or font. */
  onChange: (nextJson: string) => void;
}

/**
 * Compact dropdown theme picker for the story header. Lets users
 * change background palette + font without opening the settings panel.
 */
export default function ScrapbookThemePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = parseScrapbookTheme(value || undefined);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [open]);

  const update = (patch: Partial<{ background: string; font: string }>) => {
    onChange(JSON.stringify({ ...current, ...patch }));
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        title="Ganti tema scrapbook"
        aria-label="Ganti tema scrapbook"
        aria-expanded={open}
        className={`p-2 rounded-lg transition-all ${
          open
            ? 'bg-[#FFB8C0]/20 text-[#E63946]'
            : 'hover:bg-[#FFB8C0]/10 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60'
        }`}
      >
        <Palette className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute top-10 right-0 w-[240px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl border border-[#FFB8C0]/15 dark:border-[#E63946]/10 shadow-2xl rounded-xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-[#FFB8C0]/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">
              Background
            </span>
          </div>
          <div className="p-1.5 space-y-0.5">
            {SCRAPBOOK_BACKGROUNDS.map((bg) => {
              const active = current.background === bg.value;
              return (
                <button
                  key={bg.value}
                  onClick={() => update({ background: bg.value })}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                    active
                      ? 'bg-[#FFB8C0]/15'
                      : 'hover:bg-[#FFB8C0]/5'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md bg-gradient-to-br ${bg.className} border border-[#FFB8C0]/30 shrink-0`}
                  />
                  <span className="text-[11px] font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">
                    {bg.label}
                  </span>
                  {active && <span className="ml-auto text-[10px] text-[#E63946]">●</span>}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 border-y border-[#FFB8C0]/10 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">
              Font
            </span>
          </div>
          <div className="p-1.5 space-y-0.5">
            {SCRAPBOOK_FONTS.map((font) => {
              const active = current.font === font.value;
              return (
                <button
                  key={font.value}
                  onClick={() => update({ font: font.value })}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
                    active
                      ? 'bg-[#FFB8C0]/15'
                      : 'hover:bg-[#FFB8C0]/5'
                  }`}
                >
                  <span className="text-[11px] font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">
                    {font.label}
                  </span>
                  {active && <span className="text-[10px] text-[#E63946]">●</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
