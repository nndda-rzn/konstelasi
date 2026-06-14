"use client";

import { motion } from "framer-motion";

/**
 * StepIndicator - Editorial 3-step progress with celestial accents.
 * Minimal, premium, calm.
 */
export function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Layout" },
    { n: 2, label: "Format" },
    { n: 3, label: "Capture" },
  ];

  return (
    <div className="inline-flex items-center gap-3">
      {steps.map((s, i) => {
        const active = s.n === step;
        const done = s.n < step;
        return (
          <div key={s.n} className="flex items-center gap-3">
            {/* Step node */}
            <div className="flex items-center gap-1.5">
              {active ? (
                <motion.svg
                  width="7"
                  height="7"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden
                  animate={{ rotate: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path
                    d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
                    fill="#D4A574"
                  />
                </motion.svg>
              ) : done ? (
                <svg width="7" height="7" viewBox="0 0 10 10" fill="none" aria-hidden>
                  <path
                    d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
                    fill="#D4A574"
                    opacity="0.45"
                  />
                </svg>
              ) : (
                <svg width="7" height="7" viewBox="0 0 10 10" fill="none" aria-hidden>
                  <path
                    d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
                    fill="#D4A574"
                    opacity="0.18"
                  />
                </svg>
              )}
              <span
                className={`text-[10.5px] font-medium tracking-[0.18em] uppercase transition-colors ${
                  active
                    ? "text-[#3F2A35]"
                    : done
                      ? "text-[#9D7B8A]"
                      : "text-[#C5A8B0]"
                }`}
              >
                <span
                  className={`mr-1.5 text-[9px] tabular-nums ${
                    active ? "text-[#9D7B3F]" : "opacity-50"
                  }`}
                >
                  0{s.n}
                </span>
                {s.label}
              </span>
            </div>

            {/* Connector line */}
            {s.n < 3 && (
              <div className="relative h-px w-8 sm:w-12">
                <div
                  className="absolute inset-0"
                  style={{ background: "rgba(212, 165, 116, 0.12)" }}
                />
                {done && (
                  <motion.div
                    className="absolute inset-y-0 left-0"
                    style={{
                      background:
                        "linear-gradient(90deg, #D4A574 0%, transparent 100%)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
