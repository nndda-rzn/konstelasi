"use client";

/**
 * StepIndicator - 3-dot step pill used across the photobooth session.
 * Active step is filled, others are outlined.
 */
export function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Layout" },
    { n: 2, label: "Format" },
    { n: 3, label: "Capture" },
  ];
  return (
    <div className="flex items-center justify-center gap-1.5">
      {steps.map((s) => {
        const active = s.n === step;
        const done = s.n < step;
        return (
          <div key={s.n} className="flex items-center gap-1.5">
            <div
              className={`flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[10px] font-semibold tracking-wider uppercase transition-colors ${
                active
                  ? "bg-[#E63946] text-white"
                  : done
                    ? "bg-[#E63946]/15 text-[#E63946]"
                    : "bg-black/[0.04] text-[#8C7783]"
              }`}
            >
              <span>{s.n}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {s.n < 3 && (
              <div
                className={`h-px w-3 sm:w-5 ${done ? "bg-[#E63946]/40" : "bg-black/10"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
