interface AmbientHazeProps {
  className?: string;
  color: string;
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  translateX?: string;
  translateY?: string;
}

/**
 * AmbientHaze - Soft blurred orb used as ambient backdrop.
 */
export function AmbientHaze({
  className,
  color,
  size = 320,
  top,
  left,
  right,
  bottom,
  translateX,
  translateY,
}: AmbientHazeProps) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full blur-[100px] ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        background: color,
        top,
        left,
        right,
        bottom,
        transform: `translate(${translateX ?? "0"}, ${translateY ?? "0"})`,
      }}
    />
  );
}
