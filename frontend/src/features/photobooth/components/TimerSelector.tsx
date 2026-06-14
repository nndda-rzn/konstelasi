"use client";

import { TIMERS } from "../constants";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

/**
 * TimerSelector - Slim 3-button segmented control.
 */
export function TimerSelector() {
  const selectedTimer = usePhotoboothStore((s) => s.selectedTimer);
  const setSelectedTimer = usePhotoboothStore((s) => s.setSelectedTimer);

  return (
    <div className="flex w-full rounded-md border border-black/10 bg-[#FAFAFA] p-0.5">
      {TIMERS.map((t) => {
        const active = selectedTimer === t.value;
        return (
          <button
            key={t.value}
            onClick={() => setSelectedTimer(t.value)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded py-1.5 text-[11px] font-semibold transition-colors ${
              active
                ? "bg-white text-[#3F2A35] shadow-sm"
                : "text-[#8C7783] hover:text-[#3F2A35]"
            }`}
            title={t.desc}
          >
            <span>{t.label}</span>
            {active && (
              <span className="text-[9px] font-medium text-[#8C7783]">
                {t.desc}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
