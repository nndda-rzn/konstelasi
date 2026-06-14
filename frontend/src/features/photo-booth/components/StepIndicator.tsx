"use client";

import { motion } from "framer-motion";

/**
 * StepIndicator - Minimal-premium 3-step progress.
 * Uses thin connectors and tiny celestial accents for Constella brand.
 */
export function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Layout" },
    { n: 2, label: "Format" },
    { n: 3, label: "Capture" },
  ];

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((s, i) => {
        const active = s.n === step;
        const done = s.n < step;
        return (
          <div key={s.n} className="flex items-center gap-2">
            {/* Step node */}
            <div className="flex items-center gap-2">
              {active && (
                <motion.span
                  className="h-1 w-1 rounded-full"
                  style={{ background: "#D4A574" }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <span
                className={`text-[10px] font-semibold tracking-[0.25em] uppercase transition-colors ${
                  active
                    ? "text-[#3F2A35]"
                    : done
                      ? "text-[#9D7B3F]"
                      : "text-[#B8A0AA]"
                }`}
              >
                <span
                  className={`mr-1.5 inline-block ${
                    active ? "text-[#D4A574]" : done ? "text-[#D4A574]/70" : "text-[#D4A574]/30"
                  }`}
                >
                  0{s.n}
                </span>
                {s.label}
              </span>
            </div>

            {/* Connector line */}
            {s.n < 3 && (
              <div className="relative h-px w-6 sm:w-10">
                <div
                  className="absolute inset-0"
                  style={{ background: "rgba(212, 165, 116, 0.15)" }}
                />
                {done && (
                  <motion.div
                    className="absolute inset-y-0 left-0"
                    style={{ background: "linear-gradient(90deg, #D4A574 0%, #D4A57480 100%)" }}
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
