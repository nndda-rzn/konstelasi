"use client";

import { Sparkles, Grid3X3, Zap, FlipHorizontal } from "lucide-react";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

// @deprecated - replaced by EffectsToggleGroup. Kept temporarily for compile.
export function ToggleRow() {
  const isGridEnabled = usePhotoboothStore((s) => s.isGridEnabled);
  const setGridEnabled = usePhotoboothStore((s) => s.setGridEnabled);
  const selectedEffect = usePhotoboothStore((s) => s.selectedEffect);
  const setSelectedEffect = usePhotoboothStore((s) => s.setSelectedEffect);
  const isFlashEnabled = usePhotoboothStore((s) => s.isFlashEnabled);
  const setFlashEnabled = usePhotoboothStore((s) => s.setFlashEnabled);
  const toggleFacingMode = usePhotoboothStore((s) => s.toggleFacingMode);

  const Toggle = ({ active, onClick, icon: Icon, label }: any) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 transition-all flex-1 ${
        active
          ? "border-[#E63946]/40 bg-[#E63946]/6 text-[#E63946]"
          : "border-[#FFB8C0]/25 bg-white/50 text-[#6D5561]"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-[9px] font-bold uppercase tracking-tight">{label}</span>
    </button>
  );

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-widest text-[#6D5561]">Opsi Tambahan</p>
      <div className="grid grid-cols-4 gap-2">
        <Toggle
          active={isGridEnabled}
          onClick={() => setGridEnabled(!isGridEnabled)}
          icon={Grid3X3}
          label="Grid"
        />
        <Toggle
          active={selectedEffect === "soft"}
          onClick={() => setSelectedEffect(selectedEffect === "soft" ? "off" : "soft")}
          icon={Sparkles}
          label="Beauty"
        />
        <Toggle
          active={isFlashEnabled}
          onClick={() => setFlashEnabled(!isFlashEnabled)}
          icon={Zap}
          label="Flash"
        />
        <Toggle
          active={false}
          onClick={toggleFacingMode}
          icon={FlipHorizontal}
          label="Flip"
        />
      </div>
    </div>
  );
}
