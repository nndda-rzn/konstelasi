"use client";

import { usePhotoboothStore } from "../../store/usePhotoboothStore";

/**
 * CaptionInput - Simple, single-line input.
 */
export function CaptionInput() {
  const caption = usePhotoboothStore((s) => s.caption);
  const setCaption = usePhotoboothStore((s) => s.setCaption);

  return (
    <div>
      <label
        htmlFor="photobooth-caption"
        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#6D5561]"
      >
        Caption
      </label>
      <input
        id="photobooth-caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Tulis caption..."
        maxLength={60}
        className="h-9 w-full rounded border border-black/10 bg-white px-3 text-[13px] text-[#3F2A35] outline-none placeholder:text-[#8C7783]/70 focus:border-[#E63946]/40"
      />
    </div>
  );
}
