interface BrandMarkProps {
  size?: number;
  className?: string;
  /** Simplified mark for tiny sizes (no gold pointer / inner triangulation) */
  bare?: boolean;
}

/**
 * BrandMark - Constella constellation "C" logo.
 *
 * A letter C drawn as a star map: cream nodes joined by thin lines, with a
 * single gold accent node + pointer. Uses `currentColor` for the nodes/lines
 * so it inherits the parent text color (cream by default). The gold accent
 * is fixed brand gold.
 */
export function BrandMark({ size = 40, className, bare = false }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Constella"
    >
      {/* connecting lines (behind nodes) */}
      <g
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.55}
      >
        {/* outer C trace */}
        <line x1="28" y1="12" x2="14" y2="22" />
        <line x1="14" y1="22" x2="8" y2="36" />
        <line x1="8" y1="36" x2="14" y2="50" />
        <line x1="14" y1="50" x2="30" y2="56" />
        <line x1="30" y1="56" x2="46" y2="52" />
        {!bare && (
          <>
            {/* inner triangulation */}
            <line x1="28" y1="12" x2="44" y2="14" />
            <line x1="44" y1="14" x2="24" y2="30" />
            <line x1="24" y1="30" x2="24" y2="38" />
            <line x1="24" y1="38" x2="46" y2="52" />
            <line x1="24" y1="38" x2="14" y2="50" />
          </>
        )}
      </g>

      {/* gold pointer stick */}
      {!bare && (
        <line
          x1="44"
          y1="14"
          x2="54"
          y2="18"
          stroke="#F2B84B"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      )}

      {/* nodes */}
      <g fill="currentColor">
        <circle cx="28" cy="12" r="1.8" />
        <circle cx="14" cy="22" r="1.8" />
        <circle cx="8" cy="36" r="1.8" />
        <circle cx="14" cy="50" r="1.8" />
        <circle cx="30" cy="56" r="1.8" />
        <circle cx="46" cy="52" r="1.8" />
        {!bare && (
          <>
            <circle cx="44" cy="14" r="1.8" />
            <circle cx="24" cy="30" r="1.5" />
            <circle cx="24" cy="38" r="1.5" />
          </>
        )}
      </g>

      {/* gold accent node */}
      {!bare && <circle cx="54" cy="18" r="2.4" fill="#F2B84B" />}
    </svg>
  );
}
