"use client";

import { motion } from "framer-motion";
import type {
  TemplateConfig,
  PhotoSlot,
  OverlayShape,
} from "../../config/templates";

/**
 * TemplateThumb - A static CSS/SVG miniature that visualizes a
 * template. Renders the background, photo slot positions, decor
 * markers, and badge — without spinning up a Konva stage.
 *
 * Each thumb is unique (different background, slot arrangement,
 * and decor) so the user can see the difference at a glance.
 */
export function TemplateThumb({
  template,
  active,
  onSelect,
  disabled = false,
}: {
  template: TemplateConfig;
  active: boolean;
  onSelect: () => void;
  disabled?: boolean;
}) {
  // Use aspect 3:4 (portrait) for strip-style templates
  const aspectClass = template.photoSlots.length > 2
    ? "aspect-[3/4]"
    : "aspect-[4/3]";

  return (
    <motion.button
      onClick={onSelect}
      whileHover={!disabled ? { y: -1 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      disabled={disabled}
      className={`group relative flex flex-col items-stretch overflow-hidden rounded-lg p-1.5 text-left transition-all ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : active
            ? "bg-white"
            : "bg-white/60 hover:bg-white"
      }`}
      style={{
        boxShadow: active
          ? "0 1px 2px rgba(60, 30, 40, 0.05), 0 4px 12px rgba(60, 30, 40, 0.06), 0 0 0 1.5px rgba(212, 165, 116, 0.5)"
          : "0 1px 2px rgba(60, 30, 40, 0.03), 0 1px 3px rgba(60, 30, 40, 0.04)",
        border: "1px solid rgba(225, 210, 195, 0.4)",
      }}
    >
      {/* Selected check */}
      {active && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
          className="absolute right-1 top-1 z-20 flex h-3.5 w-3.5 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, #D4A574 0%, #B8895A 100%)",
            boxShadow: "0 1px 3px rgba(184, 137, 90, 0.4)",
          }}
        >
          <svg width="7" height="7" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M2 5.5L4 7.5L8 3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}

      {/* Badge */}
      {template.badge && (
        <div
          className="absolute left-1 top-1 z-10 flex items-center gap-0.5 rounded-full px-1.5 py-0.5"
          style={{
            background:
              template.badge === "recommended"
                ? "rgba(212, 165, 116, 0.18)"
                : template.badge === "new"
                  ? "rgba(99, 102, 241, 0.15)"
                  : template.badge === "popular"
                    ? "rgba(230, 57, 70, 0.12)"
                    : template.badge === "holiday"
                      ? "rgba(216, 72, 92, 0.15)"
                      : "rgba(212, 165, 116, 0.12)",
            border: "1px solid rgba(212, 165, 116, 0.25)",
          }}
        >
          <span
            className="text-[7px] font-semibold tracking-[0.12em] uppercase"
            style={{
              color:
                template.badge === "new"
                  ? "#6366F1"
                  : template.badge === "popular"
                    ? "#E63946"
                    : "#9D7B3F",
            }}
          >
            {template.badge === "try_it"
              ? "Try It"
              : template.badge === "new"
                ? "New"
                : template.badge === "popular"
                  ? "Popular"
                  : template.badge === "holiday"
                    ? "Holiday"
                    : template.badge === "recommended"
                      ? "Rec"
                      : "Tpl"}
          </span>
        </div>
      )}

      {/* Thumbnail mockup */}
      <div
        className={`relative w-full overflow-hidden rounded-[3px] ${aspectClass}`}
        style={getMockupStyle(template)}
      >
        {/* Photo slot placeholders */}
        {template.photoSlots.map((slot, i) => (
          <SlotPlaceholder key={i} slot={slot} index={i} />
        ))}

        {/* Decor markers */}
        {template.overlays.slice(0, 6).map((overlay, i) => (
          <DecorMarker key={i} overlay={overlay} />
        ))}

        {/* Bottom brand strip */}
        {template.frame.showBrand && (
          <div
            className="absolute left-0 right-0 flex items-center justify-center"
            style={{ bottom: "3px" }}
          >
            <span
              className="text-[4.5px] font-semibold tracking-[0.18em] uppercase"
              style={{ color: template.frame.footerColor }}
            >
              {template.frame.footerText}
            </span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="mt-1.5 px-1">
        <p className="text-[10.5px] font-semibold tracking-tight text-[#3F2A35]">
          {template.name}
        </p>
        <p className="text-[8.5px] text-[#8C7783]">
          {template.tagline} · {template.requiredShots} pose
        </p>
      </div>
    </motion.button>
  );
}

/* ----- Helpers ----- */

function getMockupStyle(template: TemplateConfig): React.CSSProperties {
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

function SlotPlaceholder({ slot, index }: { slot: PhotoSlot; index: number }) {
  // Generate a slightly varied pastel color per slot for visibility
  const colors = ["#FFE0E8", "#F0E2C5", "#E8DEF2", "#FCDCE6", "#E8E0F0", "#F5E8D8"];
  const color = colors[index % colors.length];

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

function DecorMarker({
  overlay,
}: {
  overlay: import("../../config/templates").OverlayElement;
}) {
  const left = `${overlay.x * 100}%`;
  const top = `${overlay.y * 100}%`;
  const w = (overlay.width ?? 5) / 8;
  const h = (overlay.height ?? 5) / 8;

  if (overlay.shape === "rect" && overlay.fill) {
    return (
      <div
        className="absolute"
        style={{
          left,
          top,
          width: w,
          height: h,
          background: overlay.fill,
          transform: "translate(-50%, -50%)",
          opacity: overlay.opacity,
        }}
      />
    );
  }
  if (overlay.shape === "circle" && overlay.fill) {
    return (
      <div
        className="absolute rounded-full"
        style={{
          left,
          top,
          width: w,
          height: h,
          background: overlay.fill,
          transform: "translate(-50%, -50%)",
          opacity: overlay.opacity,
        }}
      />
    );
  }
  if (overlay.shape === "heart" && overlay.fill) {
    return (
      <svg
        className="absolute"
        style={{
          left,
          top,
          width: w,
          height: h,
          transform: "translate(-50%, -50%)",
          opacity: overlay.opacity,
        }}
        viewBox="0 0 10 10"
        fill="none"
        aria-hidden
      >
        <path
          d="M5 9 C2 7 0.5 5 0.5 3 C0.5 1.5 1.5 0.5 3 0.5 C3.8 0.5 4.5 1 5 1.7 C5.5 1 6.2 0.5 7 0.5 C8.5 0.5 9.5 1.5 9.5 3 C9.5 5 8 7 5 9 Z"
          fill={overlay.fill}
        />
      </svg>
    );
  }
  if (overlay.shape === "star" && overlay.fill) {
    return (
      <svg
        className="absolute"
        style={{
          left,
          top,
          width: w,
          height: h,
          transform: "translate(-50%, -50%)",
          opacity: overlay.opacity,
        }}
        viewBox="0 0 10 10"
        fill="none"
        aria-hidden
      >
        <path
          d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
          fill={overlay.fill}
        />
      </svg>
    );
  }
  if (overlay.shape === "line" && overlay.stroke) {
    return (
      <div
        className="absolute"
        style={{
          left,
          top,
          width: w,
          height: 0.3,
          background: overlay.stroke,
          transform: "translate(-50%, -50%)",
          opacity: overlay.opacity,
        }}
      />
    );
  }
  return null;
}

function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dr = Math.max(0, Math.floor(r * (1 - amount)));
  const dg = Math.max(0, Math.floor(g * (1 - amount)));
  const db = Math.max(0, Math.floor(b * (1 - amount)));
  return `#${dr.toString(16).padStart(2, "0")}${dg.toString(16).padStart(2, "0")}${db.toString(16).padStart(2, "0")}`;
}
