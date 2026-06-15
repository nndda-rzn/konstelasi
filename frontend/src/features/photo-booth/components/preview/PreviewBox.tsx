interface PreviewBoxProps {
  children: React.ReactNode;
  className?: string;
  border?: "thick" | "rounded";
}

/**
 * PreviewBox - SVG container with shared gradient defs and
 * optional frame border. Children are the layout's photo cells.
 */
export function PreviewBox({ children, className = "", border }: PreviewBoxProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`h-full w-full ${className}`}
      aria-hidden
    >
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE5E8" />
          <stop offset="1" stopColor="#FFB8C0" />
        </linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F5ECD7" />
          <stop offset="1" stopColor="#E8D4B0" />
        </linearGradient>
        <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EDE7F6" />
          <stop offset="1" stopColor="#B9A6D6" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        rx={border === "rounded" ? "8" : "4"}
        fill={border === "thick" ? "#FAF8F5" : "transparent"}
        stroke={border === "thick" ? "#E8E0DC" : "transparent"}
        strokeWidth={border === "thick" ? "1.5" : "0"}
      />
      {children}
    </svg>
  );
}
