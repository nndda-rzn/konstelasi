"use client";

import { usePhotoboothStore } from "../../store/usePhotoboothStore";

/**
 * CaptionInput - Editable caption text field.
 */
export function CaptionInput() {
  const caption = usePhotoboothStore((s) => s.caption);
  const setCaption = usePhotoboothStore((s) => s.setCaption);

  return (
    <div>
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-[#6D5561]">
        Caption
      </p>
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Tulis caption..."
        className="w-full rounded-2xl border border-[#FFB8C0]/25 bg-white/65 px-4 py-2.5 text-sm text-[#3F2A35] outline-none placeholder:text-[#8C7783]/60 focus:border-[#E63946]/35 focus:ring-4 focus:ring-[#FFB8C0]/15 font-scrapbook-handwriting"
      />
    </div>
  );
}
