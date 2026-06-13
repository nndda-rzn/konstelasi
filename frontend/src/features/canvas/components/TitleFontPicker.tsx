'use client';

import { FONT_OPTIONS, findFontOption } from '@/features/canvas/utils/fontOptions';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Compact font family picker for the note title input.
 * Uses the same FONT_OPTIONS as the content editor so the choice
 * stays consistent across the application.
 */
export default function TitleFontPicker({ value, onChange }: Props) {
  const active = findFontOption(value);

  return (
    <select
      value={active.value}
      onChange={(e) => onChange(e.target.value)}
      className="text-[11px] px-2 py-1 rounded-[8px] bg-[#F7F1EA] border border-[rgba(47,39,48,0.08)] text-[#6F626A] hover:text-[#2F2730] hover:bg-[#FFFCF8] focus:outline-none focus:ring-1 focus:ring-[#C99A45]/40 focus:border-[#C99A45]/50 transition-colors cursor-pointer"
      style={{ fontFamily: active.value || undefined }}
      title="Choose title font"
      aria-label="Choose title font"
    >
      {FONT_OPTIONS.map((opt) => (
        <option key={opt.label} value={opt.value} style={{ fontFamily: opt.value || undefined }}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
