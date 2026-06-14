"use client";

import { motion } from "framer-motion";
import type { LayoutId } from "../photoBooth.config";
import { COMPOSITION_LAYOUTS } from "../photoBooth.config";

interface FormatPreviewProps {
  layoutId: LayoutId;
  ratio: number; // aspect ratio (w/h)
  ratioLabel: string;
  ratioName: string;
}

const FRAME_COLORS = [
  "#FFE0E8",
  "#F0E2C5",
  "#E8DEF2",
  "#FCDCE6",
  "#FFE5C2",
  "#E2EAF0",
];

/**
 * FormatPreview - Live mini mockup of how the selected layout will look
 * in the chosen aspect ratio. Reads from COMPOSITION_LAYOUTS to ensure
 * pixel-perfect accuracy with the actual photo booth output.
 */
export function FormatPreview({
  layoutId,
  ratio,
  ratioLabel,
  ratioName,
}: FormatPreviewProps) {
  const composition = COMPOSITION_LAYOUTS[layoutId];

  // Use a fixed preview container width and let aspect ratio drive height
  const previewWidth = 280;
  const previewHeight = previewWidth / ratio;

  return (
    <div className="relative flex w-full flex-col items-center">
      {/* Soft glow behind preview */}
      <div
        className="pointer-events-none absolute inset-0 -m-8"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255, 200, 210, 0.22) 0%, rgba(232, 212, 240, 0.12) 40%, transparent 70%)",
          filter: "blur(16px)",
        }}
        aria-hidden
      />

      {/* Preview mockup container */}
      <div
        className="relative w-full max-w-[340px] rounded-[10px] p-3"
        style={{
          background: "linear-gradient(180deg, #FFFCF8 0%, #FAF5EE 100%)",
          boxShadow:
            "0 1px 2px rgba(60, 30, 40, 0.05), 0 8px 24px rgba(60, 30, 40, 0.08), inset 0 0 0 1px rgba(225, 210, 195, 0.5)",
        }}
      >
        {/* Celestial stamp top-right */}
        <div className="absolute right-2 top-2 flex items-center gap-0.5 opacity-60">
          <svg width="5" height="5" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
              fill="#D4A574"
            />
          </svg>
          <svg width="4" height="4" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
              fill="#D4A574"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Inner aspect-ratio preview area */}
        <div
          className="relative mx-auto flex w-full items-center justify-center overflow-hidden rounded-[4px]"
          style={{
            maxWidth: previewWidth,
            aspectRatio: `${ratio}`,
            background:
              "linear-gradient(180deg, rgba(250, 245, 238, 0.5) 0%, rgba(245, 230, 220, 0.3) 100%)",
          }}
        >
          {/* Layout composition (cells) */}
          <CompositionCells composition={composition} />
        </div>

        {/* Print footer */}
        <div
          className="mt-2.5 flex items-center justify-between px-1 text-[6.5px] tracking-[0.18em] uppercase"
          style={{ color: "#B89A8A" }}
        >
          <div className="flex items-center gap-0.5">
            <svg width="3.5" height="3.5" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path
                d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
                fill="#D4A574"
                opacity="0.7"
              />
            </svg>
            <span>Constella</span>
          </div>
          <span className="italic" style={{ color: "#C5A39A" }}>
            {ratioLabel} · {ratioName}
          </span>
        </div>
      </div>
    </div>
  );
}

function CompositionCells({
  composition,
}: {
  composition: (typeof COMPOSITION_LAYOUTS)[LayoutId];
}) {
  return (
    <div className="absolute inset-0 p-2">
      {composition.cells.map((cell, i) => {
        const left = `${cell.x * 100}%`;
        const top = `${cell.y * 100}%`;
        const width = `${cell.w * 100}%`;
        const height = `${cell.h * 100}%`;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="absolute rounded-[2px]"
            style={{
              left,
              top,
              width,
              height,
              background: `linear-gradient(135deg, ${
                FRAME_COLORS[i % FRAME_COLORS.length]
              } 0%, ${darken(FRAME_COLORS[i % FRAME_COLORS.length], 0.08)} 100%)`,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4)",
            }}
          >
            {/* Inner highlight */}
            <div
              className="absolute inset-0 rounded-[2px]"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.35) 0%, transparent 55%)",
              }}
              aria-hidden
            />
          </motion.div>
        );
      })}
    </div>
  );
}

function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dr = Math.max(0, Math.floor(r * (1 - amount)));
  const dg = Math.max(0, Math.floor(g * (1 - amount)));
  const db = Math.max(0, Math.floor(b * (1 - amount)));
  return `#${dr.toString(16).padStart(2, "0")}${dg.toString(16).padStart(2, "0")}${db.toString(16).padStart(2, "0")}`;
}
