/**
 * Generate SVG-like path data string for heart shape, scaled to w x h.
 */
export function heartPathData(w: number, h: number): string {
  const cx = w / 2;
  const top = h * 0.25;
  const r = Math.min(w * 0.28, h * 0.28);
  return (
    `M ${cx} ${h * 0.95} ` +
    `C ${w * 0.05} ${h * 0.75}, ${w * 0.05} ${top - r * 0.3}, ${cx} ${top - r * 0.1} ` +
    `C ${w * 0.95} ${top - r * 0.3}, ${w * 0.95} ${h * 0.75}, ${cx} ${h * 0.95} Z`
  );
}

/**
 * Generate 4-point star path scaled to w x h.
 */
export function starPathData(w: number, h: number): string {
  const cx = w / 2;
  const cy = h / 2;
  const outer = Math.min(w, h) / 2;
  const inner = outer * 0.35;
  const points: string[] = [];
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
  }
  points.push("Z");
  return points.join(" ");
}
