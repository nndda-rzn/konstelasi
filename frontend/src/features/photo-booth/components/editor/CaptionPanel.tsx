"use client";

/**
 * CaptionPanel - Simple caption input for the result editor.
 */
export function CaptionPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="photobooth-result-caption"
        className="block text-[10px] font-semibold uppercase tracking-wider text-[#6D5561]"
      >
        Caption
      </label>
      <input
        id="photobooth-result-caption"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tulis caption..."
        maxLength={60}
        className="h-9 w-full rounded border border-black/10 bg-white px-3 text-[13px] text-[#3F2A35] outline-none placeholder:text-[#8C7783]/70 focus:border-[#E63946]/40"
      />
      <p className="text-[10px] text-[#8C7783]">
        Caption akan ditampilkan di area bawah hasil akhir.
      </p>
    </div>
  );
}
