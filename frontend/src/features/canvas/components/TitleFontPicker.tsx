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
      className="text-[11px] px-2 py-1 rounded-lg bg-white/70 border border-[#FFB4A2]/20 text-[#5A3E4C]/70 hover:text-[#5A3E4C] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/30 transition-all cursor-pointer"
      style={{ fontFamily: active.value || undefined }}
      title="Pilih font judul"
      aria-label="Pilih font judul"
    >
      {FONT_OPTIONS.map((opt) => (
        <option key={opt.label} value={opt.value} style={{ fontFamily: opt.value || undefined }}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
