"use client";

import { TIMERS } from "../constants";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

/**
 * TimerSelector - Slim 3-button segmented control.
 * h-8, no per-item card.
 */
export function TimerSelector() {
  const selectedTimer = usePhotoboothStore((s) => s.selectedTimer);
  const setSelectedTimer = usePhotoboothStore((s) => s.setSelectedTimer);

  return (
    <div className="flex w-full rounded-xl border border-[#FFB8C0]/20 bg-white/55 p-0.5 backdrop-blur-md">
      {TIMERS.map((t) => {
        const active = selectedTimer === t.value;
        return (
          <button
            key={t.value}
            onClick={() => setSelectedTimer(t.value)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-bold transition-all ${
              active
                ? "bg-[#E63946] text-white shadow-sm"
                : "text-[#6D5561] hover:text-[#3F2A35]"
            }`}
            title={t.desc}
          >
            <span>{t.label}</span>
            {active && (
              <span className="text-[9px] font-medium opacity-80">
                {t.desc}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
