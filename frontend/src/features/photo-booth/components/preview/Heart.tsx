interface HeartProps {
  x: number;
  y: number;
}

/**
 * Heart - Small SVG heart marker for layout thumbnails that
 * show per-cell heart decorations.
 */
export function Heart({ x, y }: HeartProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(0.05)`} fill="#E63946" opacity="0.7">
      <path d="M100 50 C100 22 78 0 50 0 C22 0 0 22 0 50 C0 88 50 100 50 100 C50 100 100 88 100 50 Z" />
    </g>
  );
}
