"use client";

/**
 * PhotoBoothMark - Constella's branded Photo Booth identity mark.
 * A simplified camera-lens with a celestial star accent.
 * Replaces the generic red Camera icon in the header.
 */
export function PhotoBoothMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="pbMarkGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8919C" />
          <stop offset="100%" stopColor="#C52836" />
        </linearGradient>
        <linearGradient id="pbMarkLens" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFCF8" />
          <stop offset="100%" stopColor="#FAF5EE" />
        </linearGradient>
      </defs>
      {/* Rounded frame */}
      <rect
        x="2"
        y="6"
        width="28"
        height="22"
        rx="5"
        fill="url(#pbMarkGrad)"
      />
      {/* Top notch (camera body detail) */}
      <rect x="11" y="2" width="10" height="5" rx="2" fill="url(#pbMarkGrad)" />
      {/* Lens outer */}
      <circle cx="16" cy="17" r="7" fill="url(#pbMarkLens)" />
      {/* Lens inner */}
      <circle
        cx="16"
        cy="17"
        r="4.5"
        fill="none"
        stroke="#C52836"
        strokeWidth="0.8"
        strokeOpacity="0.35"
      />
      <circle cx="16" cy="17" r="2.2" fill="#C52836" fillOpacity="0.15" />
      <circle cx="14.5" cy="15.5" r="0.9" fill="#FFFCF8" fillOpacity="0.7" />
      {/* Tiny celestial star on top-right corner */}
      <path
        d="M25 7L25.45 8.55L27 9L25.45 9.45L25 11L24.55 9.45L23 9L24.55 8.55L25 7Z"
        fill="#D4A574"
      />
    </svg>
  );
}
