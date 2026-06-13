"use client";

import { Palette, PenLine } from "lucide-react";
import {
  SCRAPBOOK_BACKGROUNDS,
  SCRAPBOOK_FONTS,
} from "@/features/story/utils/scrapbookTheme";

interface ScrapbookPickerProps {
  background: string;
  font: string;
  onBackgroundChange: (v: string) => void;
  onFontChange: (v: string) => void;
}

/**
 * ScrapbookPicker - Background and font visual selector.
 */
export function ScrapbookPicker({
  background,
  font,
  onBackgroundChange,
  onFontChange,
}: ScrapbookPickerProps) {
  return (
    <div className="p-3 rounded-2xl border border-[#FFB8C0]/15 dark:border-[#E63946]/10 bg-gradient-to-br from-[#FFE5E8]/35 to-white/40 dark:from-[#E63946]/10 dark:to-[#1a1625]/30">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-4 h-4 text-[#E63946]" />
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/50 font-semibold">
            Story Scrapbook
          </label>
          <p className="text-[10px] text-[#5A3E4C]/35 dark:text-[#e2d9f3]/25 mt-0.5">
            Atur rasa visual untuk membaca dan menjelajah story.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <BackgroundPicker
          value={background}
          onChange={onBackgroundChange}
        />
        <FontPicker value={font} onChange={onFontChange} />
      </div>
    </div>
  );
}

function BackgroundPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-[#5A3E4C]/45 dark:text-[#e2d9f3]/35 mb-2">
        Background
      </p>
      <div className="grid grid-cols-2 gap-2">
        {SCRAPBOOK_BACKGROUNDS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`p-2 rounded-xl border text-left transition-all ${
              value === option.value
                ? "border-[#E63946] bg-[#E63946]/5"
                : "border-[#FFB8C0]/15 hover:border-[#E63946]/25"
            }`}
          >
            <div
              className={`h-8 rounded-lg bg-gradient-to-br ${option.className} mb-2 border border-white/40`}
            />
            <p className="text-[10px] font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">
              {option.label}
            </p>
            <p className="text-[9px] text-[#5A3E4C]/35 dark:text-[#e2d9f3]/25">
              {option.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function FontPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-[#5A3E4C]/45 dark:text-[#e2d9f3]/35 mb-2">
        Typography
      </p>
      <div className="space-y-1.5">
        {SCRAPBOOK_FONTS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
              value === option.value
                ? "border-[#E63946] bg-[#E63946]/5"
                : "border-[#FFB8C0]/15 hover:border-[#E63946]/25"
            }`}
          >
            <PenLine
              className={`w-3.5 h-3.5 ${
                value === option.value
                  ? "text-[#E63946]"
                  : "text-[#5A3E4C]/30"
              }`}
            />
            <div>
              <p
                className={`text-xs font-medium text-[#4A2F3C] dark:text-[#e2d9f3] ${
                  option.value === "handwriting"
                    ? "font-scrapbook-handwriting text-sm"
                    : option.value === "serif"
                    ? "font-scrapbook-serif"
                    : ""
                }`}
              >
                {option.label}
              </p>
              <p className="text-[9px] text-[#5A3E4C]/35 dark:text-[#e2d9f3]/25">
                {option.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
