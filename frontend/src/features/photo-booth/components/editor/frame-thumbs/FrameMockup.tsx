"use client";

import type { FrameStyle } from "../../../config/frames";
import { isDarkSurround } from "./isDarkSurround";

/**
 * FrameMockup - Small SVG-based mockup that visualizes the frame
 * style (surround color, border, decor, caption area) without
 * rendering a real photo.
 */
export function FrameMockup({ frame }: { frame: FrameStyle }) {
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

      {frame.captionArea > 0 && (
        <div
          className="absolute left-0 right-0 flex items-center justify-center"
          style={{ bottom: 4, height: 3 }}
        >
          <span
            className="text-[4px] font-medium tracking-wider uppercase"
            style={{ color: textColor }}
          >
            Constella
          </span>
        </div>
      )}

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
          style={{ bottom: 0, left: 0, right: 0, height: 4, background: "rgba(0,0,0,0.15)" }}
        />
      )}
    </div>
  );
}

function StarMarker({ x, y, size }: { x: number; y: number; size: number }) {
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

function HeartMarker({ x, y, size }: { x: number; y: number; size: number }) {
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
