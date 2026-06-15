"use client";

import TitleFontPicker from "../TitleFontPicker";
import NoteTimestamps from "../NoteTimestamps";

interface EditorTitleSectionProps {
  title: string;
  setTitle: (v: string) => void;
  titleFont: string;
  setTitleFont: (v: string) => void;
  titleRef: React.RefObject<HTMLInputElement | null>;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * EditorTitleSection - Title input with font picker + timestamps.
 */
export function EditorTitleSection({
  title,
  setTitle,
  titleFont,
  setTitleFont,
  titleRef,
  createdAt,
  updatedAt,
}: EditorTitleSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#9A8F95]">
          Title
        </label>
        <TitleFontPicker value={titleFont} onChange={setTitleFont} />
      </div>
      <input
        ref={titleRef}
        type="text"
        className="w-full bg-[#FAF7F2] border border-[rgba(47,39,48,0.08)] rounded-[14px] text-[#2F2730] text-lg font-semibold px-4 py-3 placeholder-[#9A8F95] focus:outline-none focus:ring-1 focus:ring-[#C99A45]/40 focus:border-[#C99A45]/50 transition-colors"
        style={titleFont ? { fontFamily: titleFont } : undefined}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled note"
      />
      <NoteTimestamps createdAt={createdAt} updatedAt={updatedAt} />
    </div>
  );
}
