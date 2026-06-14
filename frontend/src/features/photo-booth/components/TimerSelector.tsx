"use client";

import { TIMERS, usePhotoBoothStore } from "../photoBoothStore";

export function TimerSelector() {
  const selected = usePhotoBoothStore((s) => s.selectedTimer);
  const set = usePhotoBoothStore((s) => s.setSelectedTimer);

  return (
    <div className="flex w-full gap-1 rounded-md border border-black/10 bg-[#FAFAFA] p-0.5">
      {TIMERS.map((t: { value: number; label: string; desc: string }) => {
        const active = selected === t.value;
        return (
          <button
            key={t.value}
            onClick={() => set(t.value)}
            title={t.desc}
            className={`flex flex-1 items-center justify-center rounded py-1.5 text-[11px] font-semibold transition-colors ${
              active
                ? "bg-white text-[#3F2A35] shadow-sm"
                : "text-[#8C7783] hover:text-[#3F2A35]"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
