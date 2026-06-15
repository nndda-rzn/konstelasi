import type { PhotoSlot } from "../../../config/templates";
import { darken } from "./darken";

const SLOT_COLORS = ["#FFE0E8", "#F0E2C5", "#E8DEF2", "#FCDCE6", "#E8E0F0", "#F5E8D8"];

/**
 * SlotPlaceholder - Visual placeholder for a photo slot in the
 * template thumbnail mockup. Uses a slightly varied pastel color
 * per slot for visibility.
 */
export function SlotPlaceholder({ slot, index }: { slot: PhotoSlot; index: number }) {
  const color = SLOT_COLORS[index % SLOT_COLORS.length];

  return (
    <div
      className="absolute"
      style={{
        left: `${slot.x * 100}%`,
        top: `${slot.y * 100}%`,
        width: `${slot.w * 100}%`,
        height: `${slot.h * 100}%`,
        background: `linear-gradient(135deg, ${color} 0%, ${darken(color, 0.05)} 100%)`,
        border: slot.stroke
          ? `0.5px solid ${slot.stroke.color}`
          : "0.5px solid rgba(255,255,255,0.6)",
        borderRadius: (slot.radius ?? 0) > 0 ? (slot.radius ?? 0) / 8 : 0.5,
        boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.4)",
      }}
    />
  );
}
