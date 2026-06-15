import type { TemplateConfig } from "../../../config/templates";

/**
 * Compute the background style (solid or linear gradient) for a
 * template thumbnail's mockup area.
 */
export function getMockupStyle(template: TemplateConfig): React.CSSProperties {
  const bg = template.background;
  if (bg.type === "solid") {
    return { background: bg.color || "#FFFFFF" };
  }
  if (bg.type === "gradient" && bg.gradientStops && bg.gradientStops.length >= 2) {
    const angle = bg.gradientAngle ?? 180;
    return {
      background: `linear-gradient(${angle}deg, ${bg.gradientStops
        .map((s) => `${s.color} ${s.offset * 100}%`)
        .join(", ")})`,
    };
  }
  return { background: "#FFFFFF" };
}
