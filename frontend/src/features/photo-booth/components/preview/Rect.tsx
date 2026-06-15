interface RectProps {
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
  fill: string;
}

/**
 * Rect - SVG rectangle helper for layout photo cells.
 */
export function Rect({ x, y, w, h, rx, fill }: RectProps) {
  return <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} />;
}
