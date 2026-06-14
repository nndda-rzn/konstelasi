"use client";

import {
  FlipHorizontal,
  Grid3X3,
  Zap,
  Sparkles,
  Sun,
} from "lucide-react";
import { usePhotoboothStore } from "../store/usePhotoboothStore";
import type { EffectKey } from "../constants";

/**
 * EffectsToggleGroup - 5 icon-only chips: Mirror, Grid, Flash, Soft, Warm.
 * Each independent. Soft and Warm are mutually exclusive within effect.
 */
export function EffectsToggleGroup() {
  const isGridEnabled = usePhotoboothStore((s) => s.isGridEnabled);
  const setGridEnabled = usePhotoboothStore((s) => s.setGridEnabled);
  const isFlashEnabled = usePhotoboothStore((s) => s.isFlashEnabled);
  const setFlashEnabled = usePhotoboothStore((s) => s.setFlashEnabled);
  const selectedEffect = usePhotoboothStore((s) => s.selectedEffect);
  const setSelectedEffect = usePhotoboothStore((s) => s.setSelectedEffect);
  const toggleFacingMode = usePhotoboothStore((s) => s.toggleFacingMode);

  const setEffect = (next: EffectKey) => setSelectedEffect(next);

  const Chip = ({
    active,
    onClick,
    icon: Icon,
    label,
  }: {
    active: boolean;
    onClick: () => void;
    icon: any;
    label: string;
  }) => (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
        active
          ? "bg-[#E63946] text-white shadow-sm"
          : "bg-white/55 text-[#6D5561] hover:bg-white/80 hover:text-[#3F2A35]"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="flex w-full items-center justify-between gap-1.5 rounded-xl border border-[#FFB8C0]/20 bg-white/40 p-1.5 backdrop-blur-md">
      <Chip
        active={isGridEnabled}
        onClick={() => setGridEnabled(!isGridEnabled)}
        icon={Grid3X3}
        label="Grid"
      />
      <Chip
        active={selectedEffect === "soft"}
        onClick={() => setEffect(selectedEffect === "soft" ? "off" : "soft")}
        icon={Sparkles}
        label="Soft Beauty"
      />
      <Chip
        active={selectedEffect === "warm"}
        onClick={() => setEffect(selectedEffect === "warm" ? "off" : "warm")}
        icon={Sun}
        label="Warm Tone"
      />
      <Chip
        active={isFlashEnabled}
        onClick={() => setFlashEnabled(!isFlashEnabled)}
        icon={Zap}
        label="Flash"
      />
      <Chip
        active={false}
        onClick={toggleFacingMode}
        icon={FlipHorizontal}
        label="Mirror"
      />
    </div>
  );
}
