"use client";

import { motion } from "framer-motion";
import type { TemplateConfig } from "../../config/templates";
import { SlotPlaceholder } from "./template-thumbs/SlotPlaceholder";
import { DecorMarker } from "./template-thumbs/DecorMarker";
import { getMockupStyle } from "./template-thumbs/getMockupStyle";

/**
 * TemplateThumb - A static CSS/SVG miniature that visualizes a
 * template. Renders the background, photo slot positions, decor
 * markers, and badge — without spinning up a Konva stage.
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

      <div
        className={`relative w-full overflow-hidden rounded-[3px] ${aspectClass}`}
        style={getMockupStyle(template)}
      >
        {template.photoSlots.map((slot, i) => (
          <SlotPlaceholder key={i} slot={slot} index={i} />
        ))}

        {template.overlays.slice(0, 6).map((overlay, i) => (
          <DecorMarker key={i} overlay={overlay} />
        ))}

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
