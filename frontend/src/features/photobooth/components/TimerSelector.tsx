"use client";

import { Timer as TimerIcon } from "lucide-react";
import { TIMERS } from "../constants";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

export function TimerSelector() {
  const selectedTimer = usePhotoboothStore((s) => s.selectedTimer);
  const setSelectedTimer = usePhotoboothStore((s) => s.setSelectedTimer);

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#6D5561]">
        <TimerIcon className="h-3.5 w-3.5" />
        Timer
      </p>
      <div className="flex gap-2">
        {TIMERS.map((t) => (
          <button
            key={t.value}
            onClick={() => setSelectedTimer(t.value)}
            className={`flex-1 rounded-2xl border py-2.5 text-xs font-bold transition-all ${
              selectedTimer === t.value
                ? "border-[#E63946]/40 bg-[#E63946]/6 text-[#E63946]"
                : "border-[#FFB8C0]/25 bg-white/50 text-[#6D5561]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
