"use client";

import { FONT_OPTIONS, findFontOption } from "@/features/canvas/utils/fontOptions";

interface FontFamilyPickerProps {
  editor: any;
}

/**
 * FontFamilyPicker - Dropdown for selecting font family in editor.
 */
export function FontFamilyPicker({ editor }: FontFamilyPickerProps) {
  const current = editor.getAttributes("textStyle").fontFamily as
    | string
    | undefined;
  const activeOption = findFontOption(current);

  const handleChange = (value: string) => {
    if (value === "") {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(value).run();
    }
  };

  return (
    <select
      value={activeOption.value}
      onChange={(e) => handleChange(e.target.value)}
      className="text-xs px-2 py-1 rounded-lg bg-white/70 border border-[#FFB4A2]/20 text-[#5A3E4C]/70 hover:text-[#5A3E4C] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/30 transition-all cursor-pointer"
      style={{ fontFamily: activeOption.value || undefined }}
      title="Pilih font"
      aria-label="Pilih font"
    >
      {FONT_OPTIONS.map((opt) => (
        <option
          key={opt.label}
          value={opt.value}
          style={{ fontFamily: opt.value || undefined }}
        >
          {opt.label}
        </option>
      ))}
    </select>
  );
}
