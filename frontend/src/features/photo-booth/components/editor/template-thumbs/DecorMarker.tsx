import type { OverlayElement } from "../../../config/templates";

/**
 * DecorMarker - Visual marker for a decorative overlay element in
 * the template thumbnail mockup. Supports rect, circle, heart, star, line.
 */
export function DecorMarker({ overlay }: { overlay: OverlayElement }) {
  const left = `${overlay.x * 100}%`;
  const top = `${overlay.y * 100}%`;
  const w = (overlay.width ?? 5) / 8;
  const h = (overlay.height ?? 5) / 8;

  if (overlay.shape === "rect" && overlay.fill) {
    return (
      <div
        className="absolute"
        style={{
          left,
          top,
          width: w,
          height: h,
          background: overlay.fill,
          transform: "translate(-50%, -50%)",
          opacity: overlay.opacity,
        }}
      />
    );
  }
  if (overlay.shape === "circle" && overlay.fill) {
    return (
      <div
        className="absolute rounded-full"
        style={{
          left,
          top,
          width: w,
          height: h,
          background: overlay.fill,
          transform: "translate(-50%, -50%)",
          opacity: overlay.opacity,
        }}
      />
    );
  }
  if (overlay.shape === "heart" && overlay.fill) {
    return (
      <svg
        className="absolute"
        style={{
          left,
          top,
          width: w,
          height: h,
          transform: "translate(-50%, -50%)",
          opacity: overlay.opacity,
        }}
        viewBox="0 0 10 10"
        fill="none"
        aria-hidden
      >
        <path
          d="M5 9 C2 7 0.5 5 0.5 3 C0.5 1.5 1.5 0.5 3 0.5 C3.8 0.5 4.5 1 5 1.7 C5.5 1 6.2 0.5 7 0.5 C8.5 0.5 9.5 1.5 9.5 3 C9.5 5 8 7 5 9 Z"
          fill={overlay.fill}
        />
      </svg>
    );
  }
  if (overlay.shape === "star" && overlay.fill) {
    return (
      <svg
        className="absolute"
        style={{
          left,
          top,
          width: w,
          height: h,
          transform: "translate(-50%, -50%)",
          opacity: overlay.opacity,
        }}
        viewBox="0 0 10 10"
        fill="none"
        aria-hidden
      >
        <path
          d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
          fill={overlay.fill}
        />
      </svg>
    );
  }
  if (overlay.shape === "line" && overlay.stroke) {
    return (
      <div
        className="absolute"
        style={{
          left,
          top,
          width: w,
          height: 0.3,
          background: overlay.stroke,
          transform: "translate(-50%, -50%)",
          opacity: overlay.opacity,
        }}
      />
    );
  }
  return null;
}
