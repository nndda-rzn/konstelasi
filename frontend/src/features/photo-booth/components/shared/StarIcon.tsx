interface StarIconProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * StarIcon - Small filled 4-point star used for ornament marks.
 */
export function StarIcon({ size = 7, color = "#D4A574", className }: StarIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
        fill={color}
      />
    </svg>
  );
}
