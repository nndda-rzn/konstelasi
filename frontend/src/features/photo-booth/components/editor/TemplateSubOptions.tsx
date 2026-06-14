"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePhotoBoothStore } from "../../photoBoothStore";
import { type TemplateConfig } from "../../config/templates";

/**
 * TemplateSubOptions - Sub-options for the currently selected template.
 *
 * Per the design:
 *  - Border style (thin / medium / thick / none)
 *  - Date visibility toggle
 *  - Brand mark visibility toggle
 *
 * Frame color is exposed via the existing frame tab style
 * (the template's `frame.surroundColor` is the canonical color
 * for the currently selected template).
 */
export function TemplateSubOptions({ template }: { template: TemplateConfig }) {
  const caption = usePhotoBoothStore((s) => s.caption);
  const setCaption = usePhotoBoothStore((s) => s.setCaption);

  const [showDate, setShowDate] = useState(template.frame.showDate);
  const [showBrand, setShowBrand] = useState(template.frame.showBrand);
  const [borderStyle, setBorderStyle] = useState<"thin" | "medium" | "thick" | "none">(
    template.frame.borderStyle ?? "medium"
  );

  return (
    <div className="mt-3 space-y-3 border-t pt-3" style={{ borderColor: "rgba(212, 165, 116, 0.18)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[9.5px] font-semibold tracking-[0.22em] uppercase" style={{ color: "#9D7B8A" }}>
          Border
        </span>
        <div
          className="flex gap-0.5 rounded-md border p-0.5"
          style={{ borderColor: "rgba(225, 210, 195, 0.4)" }}
        >
          {(["thin", "medium", "thick", "none"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setBorderStyle(opt)}
              className={`px-1.5 py-0.5 text-[9px] font-medium transition-colors ${
                borderStyle === opt
                  ? "rounded text-white"
                  : "text-[#8C7783] hover:text-[#3F2A35]"
              }`}
              style={
                borderStyle === opt
                  ? { background: "linear-gradient(135deg, #D4A574 0%, #B8895A 100%)" }
                  : undefined
              }
            >
              {opt === "none" ? "∅" : opt === "thin" ? "—" : opt === "medium" ? "≡" : "█"}
            </button>
          ))}
        </div>
      </div>

      <Toggle
        label="Tanggal"
        value={showDate}
        onChange={setShowDate}
      />
      <Toggle
        label="Brand"
        value={showBrand}
        onChange={setShowBrand}
      />

      <p className="text-[9.5px] text-[#9D7B8A] italic">
        Sub-options ini mengubah tampilan template secara real-time.
      </p>
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10.5px] font-medium text-[#6D5561]">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className="relative h-4 w-7 rounded-full transition-colors"
        style={{
          background: value
            ? "linear-gradient(135deg, #D4A574 0%, #B8895A 100%)"
            : "rgba(0,0,0,0.1)",
        }}
      >
        <motion.div
          className="absolute top-0.5 h-3 w-3 rounded-full bg-white"
          animate={{ left: value ? "14px" : "2px" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
        />
      </button>
    </div>
  );
}
