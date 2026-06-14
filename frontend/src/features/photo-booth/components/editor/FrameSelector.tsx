"use client";

import { motion } from "framer-motion";
import { usePhotoBoothStore } from "../../photoBoothStore";
import {
  FRAME_STYLES,
  type FrameStyle,
} from "../../config/frames";

/**
 * FrameSelector - Grid of frame thumbnails for the Result/Edit panel.
 * Each thumbnail is a small SVG mockup that shows the frame's character
 * (border, padding, decor, caption area) without rendering the actual
 * composed photo.
 */
export function FrameSelector() {
  const selected = usePhotoBoothStore((s) => s.selectedFrame);
  const setFrame = usePhotoBoothStore((s) => s.setSelectedFrame);

  return (
    <div className="grid grid-cols-2 gap-2">
      {FRAME_STYLES.map((frame) => (
        <FrameThumb
          key={frame.id}
          frame={frame}
          active={selected === frame.id}
          onSelect={() => setFrame(frame.id)}
        />
      ))}
    </div>
  );
}

function FrameThumb({
  frame,
  active,
  onSelect,
}: {
  frame: FrameStyle;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`group relative flex flex-col items-stretch overflow-hidden rounded-lg p-1.5 text-left transition-all ${
        active ? "bg-white" : "bg-white/60 hover:bg-white"
      }`}
      style={{
        boxShadow: active
          ? "0 1px 2px rgba(60, 30, 40, 0.05), 0 4px 12px rgba(60, 30, 40, 0.06), 0 0 0 1.5px rgba(212, 165, 116, 0.5)"
          : "0 1px 2px rgba(60, 30, 40, 0.03), 0 1px 3px rgba(60, 30, 40, 0.04)",
        border: "1px solid rgba(225, 210, 195, 0.4)",
      }}
    >
      {/* Selected check */}
      {active && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
          className="absolute right-1 top-1 z-20 flex h-3.5 w-3.5 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, #D4A574 0%, #B8895A 100%)",
            boxShadow: "0 1px 3px rgba(184, 137, 90, 0.4)",
          }}
        >
          <svg width="7" height="7" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M2 5.5L4 7.5L8 3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}

      <FrameMockup frame={frame} />

      {/* Meta */}
      <div className="mt-1.5 px-1">
        <p className="text-[10.5px] font-semibold tracking-tight text-[#3F2A35]">
          {frame.name}
        </p>
        <p className="text-[8.5px] text-[#8C7783]">{frame.tagline}</p>
      </div>
    </motion.button>
  );
}

/**
 * FrameMockup - Small SVG-based mockup that visualizes the frame
 * style (surround color, border, decor, caption area) without
 * rendering a real photo.
 */
function FrameMockup({ frame }: { frame: FrameStyle }) {
  const isDark = isDarkSurround(frame.surroundColor);
  const textColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(60,30,40,0.3)";

  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[3px]"
      style={{
        background: frame.surroundColor,
        border: frame.borderColor === "none" ? "none" : `1px solid ${frame.borderColor}`,
      }}
    >
      {/* "Image" placeholder */}
      <div
        className="absolute"
        style={{
          top: `${frame.padding}%`,
          left: `${frame.padding}%`,
          right: `${frame.padding}%`,
          bottom: `${frame.captionArea / 6 + frame.padding}%`,
          background:
            "linear-gradient(135deg, rgba(212, 165, 116, 0.15) 0%, rgba(230, 57, 70, 0.08) 50%, rgba(232, 212, 240, 0.15) 100%)",
          borderRadius: 1,
        }}
      />

      {/* Caption area (bottom strip) */}
      {frame.captionArea > 0 && (
        <div
          className="absolute left-0 right-0 flex items-center justify-center"
          style={{
            bottom: 4,
            height: 3,
          }}
        >
          <span
            className="text-[4px] font-medium tracking-wider uppercase"
            style={{ color: textColor }}
          >
            Constella
          </span>
        </div>
      )}

      {/* Decor marker */}
      {frame.decor === "star" && <StarMarker x={6} y={6} size={4} />}
      {frame.decor === "constellation" && (
        <>
          <StarMarker x={5} y={5} size={3} />
          <StarMarker x={9} y={9} size={2.5} />
          <ConstellationLine x1={5} y1={5} x2={9} y2={9} />
        </>
      )}
      {frame.decor === "film" && (
        <>
          <FilmPerf x={4} y={4} />
          <FilmPerf x={88} y={4} />
        </>
      )}
      {frame.decor === "hearts" && (
        <>
          <HeartMarker x={5} y={4} size={3} />
          <HeartMarker x={88} y={88} size={2.5} />
        </>
      )}
      {frame.decor === "accent" && (
        <div
          className="absolute"
          style={{
            top: 3,
            right: 3,
            width: 2,
            height: 2,
            borderRadius: "50%",
            background: "#E63946",
          }}
        />
      )}
      {frame.decor === "cinema" && (
        <div
          className="absolute"
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "rgba(0,0,0,0.15)",
          }}
        />
      )}
    </div>
  );
}

function StarMarker({
  x,
  y,
  size,
}: {
  x: number;
  y: number;
  size: number;
}) {
  return (
    <svg
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
        fill="#D4A574"
      />
    </svg>
  );
}

function ConstellationLine({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#D4A574"
        strokeWidth="0.3"
        strokeOpacity="0.5"
      />
    </svg>
  );
}

function FilmPerf({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute flex flex-col gap-[2px]"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: 2,
            borderRadius: 0.5,
            background: "rgba(255,255,255,0.2)",
          }}
        />
      ))}
    </div>
  );
}

function HeartMarker({
  x,
  y,
  size,
}: {
  x: number;
  y: number;
  size: number;
}) {
  return (
    <svg
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 8.5C2 6.5 0.5 4.5 0.5 2.8C0.5 1.5 1.5 0.5 2.8 0.5C3.7 0.5 4.5 1 5 1.8C5.5 1 6.3 0.5 7.2 0.5C8.5 0.5 9.5 1.5 9.5 2.8C9.5 4.5 8 6.5 5 8.5Z"
        fill="#E8919C"
        opacity="0.7"
      />
    </svg>
  );
}

function isDarkSurround(color: string): boolean {
  // Check if the surround color is dark enough to need light text
  const hex = color.replace("#", "");
  if (hex.length !== 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}
