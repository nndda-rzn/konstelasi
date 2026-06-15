export type ClipMask = "rounded" | "circle" | "heart" | "filmFrame";

/**
 * Structural type for the 2D path API used by Konva's clipFunc.
 * Konva's SceneContext implements these methods even though the
 * @types/konva declaration does not extend CanvasRenderingContext2D.
 */
export type MaskContext = {
  beginPath: () => void;
  moveTo: (x: number, y: number) => void;
  lineTo: (x: number, y: number) => void;
  quadraticCurveTo: (cpx: number, cpy: number, x: number, y: number) => void;
  bezierCurveTo: (
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ) => void;
  arc: (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean
  ) => void;
  closePath: () => void;
};

/**
 * Draw the appropriate mask path on the 2D context.
 * Used by Group.clipFunc to clip an image to the slot's shape.
 */
export function drawMaskPath(
  ctx: MaskContext,
  mask: ClipMask,
  w: number,
  h: number,
  radius: number
): void {
  if (mask === "rounded") {
    const r = radius;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.quadraticCurveTo(w, 0, w, r);
    ctx.lineTo(w, h - r);
    ctx.quadraticCurveTo(w, h, w - r, h);
    ctx.lineTo(r, h);
    ctx.quadraticCurveTo(0, h, 0, h - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
  } else if (mask === "circle") {
    const r = Math.min(w, h) / 2;
    const cx = w / 2;
    const cy = h / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2, false);
    ctx.closePath();
  } else if (mask === "heart") {
    const cx = w / 2;
    const cy = h * 0.35;
    const r = Math.min(w * 0.3, h * 0.3);
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.85);
    ctx.bezierCurveTo(
      w * 0.05,
      h * 0.7,
      w * 0.05,
      cy - r * 0.3,
      cx,
      cy - r * 0.1
    );
    ctx.bezierCurveTo(
      w * 0.95,
      cy - r * 0.3,
      w * 0.95,
      h * 0.7,
      cx,
      h * 0.85
    );
    ctx.closePath();
  } else if (mask === "filmFrame") {
    const notches = 4;
    const notchH = h * 0.04;
    const notchW = w * 0.08;
    ctx.beginPath();
    for (let i = 0; i <= notches; i++) {
      const x = (i / notches) * w;
      ctx.lineTo(x, 0);
      ctx.lineTo(x + notchW / 2, 0);
      ctx.lineTo(x + notchW / 2, notchH);
    }
    ctx.lineTo(w, notchH);
    ctx.lineTo(w, h - notchH);
    for (let i = notches; i >= 0; i--) {
      const x = (i / notches) * w;
      ctx.lineTo(x + notchW / 2, h - notchH);
      ctx.lineTo(x + notchW / 2, h);
      ctx.lineTo(x, h);
    }
    ctx.lineTo(0, h);
    ctx.lineTo(0, 0);
    ctx.closePath();
  }
}
