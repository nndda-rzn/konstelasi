"use client";

import { Camera, FlipHorizontal, LayoutTemplate, Timer } from "lucide-react";
import { LAYOUTS, TIMERS } from "../constants";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

interface SetupControlsProps {
  onStart: () => void;
}

/**
 * SetupControls - Layout, timer, camera-flip, and start button.
 * Shown below the webcam during "setup" stage.
 */
export function SetupControls({ onStart }: SetupControlsProps) {
  const selectedLayout = usePhotoboothStore((s) => s.selectedLayout);
  const setSelectedLayout = usePhotoboothStore((s) => s.setSelectedLayout);
  const selectedTimer = usePhotoboothStore((s) => s.selectedTimer);
  const setSelectedTimer = usePhotoboothStore((s) => s.setSelectedTimer);
  const toggleFacingMode = usePhotoboothStore((s) => s.toggleFacingMode);

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      {/* Layout selector */}
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#6D5561]">
          <LayoutTemplate className="inline h-3.5 w-3.5 mr-1" />
          Layout
        </p>
        <div className="grid grid-cols-5 gap-2">
          {LAYOUTS.map((l) => (
            <button
              key={l.key}
              onClick={() => setSelectedLayout(l.key)}
              className={`rounded-2xl border p-2.5 text-center transition-all ${
                selectedLayout === l.key
                  ? "border-[#E63946]/40 bg-[#E63946]/6 shadow-sm"
                  : "border-[#FFB8C0]/25 bg-white/50 hover:border-[#FFB8C0]/50"
              }`}
            >
              <p
                className={`text-xs font-bold ${
                  selectedLayout === l.key ? "text-[#E63946]" : "text-[#3F2A35]"
                }`}
              >
                {l.label}
              </p>
              <p className="text-[9px] text-[#8C7783] mt-0.5">{l.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Timer selector */}
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#6D5561]">
          <Timer className="inline h-3.5 w-3.5 mr-1" />
          Timer
        </p>
        <div className="flex gap-2">
          {TIMERS.map((t) => (
            <button
              key={t.value}
              onClick={() => setSelectedTimer(t.value)}
              className={`flex-1 rounded-2xl border py-2.5 text-sm font-semibold transition-all ${
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

      {/* Camera flip + Start */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleFacingMode}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FFB8C0]/25 bg-white/60 text-[#6D5561] hover:bg-white/80"
        >
          <FlipHorizontal className="h-5 w-5" />
        </button>
        <button
          onClick={onStart}
          className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#E63946] to-[#FF6B7A] py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(230,57,70,0.25)] hover:shadow-[0_12px_32px_rgba(230,57,70,0.35)] transition-all"
        >
          <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
          <Camera className="relative h-5 w-5" />
          <span className="relative">Mulai Sesi Foto</span>
        </button>
      </div>
    </div>
  );
}
