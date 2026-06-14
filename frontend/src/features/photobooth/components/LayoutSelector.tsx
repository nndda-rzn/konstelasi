"use client";

import { LayoutTemplate } from "lucide-react";
import { LAYOUTS } from "../constants";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

export function LayoutSelector() {
  const selectedLayout = usePhotoboothStore((s) => s.selectedLayout);
  const setSelectedLayout = usePhotoboothStore((s) => s.setSelectedLayout);

  const classic = LAYOUTS.filter(l => l.group === 'classic');
  const wide = LAYOUTS.filter(l => l.group === 'wide');

  const renderItem = (l: typeof LAYOUTS[0]) => (
    <button
      key={l.key}
      onClick={() => setSelectedLayout(l.key)}
      className={`relative flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 text-center transition-all ${
        selectedLayout === l.key
          ? "border-[#E63946]/40 bg-[#E63946]/6 shadow-sm"
          : "border-[#FFB8C0]/25 bg-white/50 hover:border-[#FFB8C0]/50"
      }`}
    >
      <div className={`text-[10px] font-bold ${selectedLayout === l.key ? "text-[#E63946]" : "text-[#3F2A35]"}`}>
        {l.label}
      </div>
      <p className="text-[9px] text-[#8C7783] leading-tight line-clamp-1">{l.desc}</p>
    </button>
  );

  return (
    <div className="space-y-4">
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#6D5561]">
        <LayoutTemplate className="h-3.5 w-3.5" />
        Layout Foto
      </p>
      
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-[9px] font-bold text-[#8C7783]/60 uppercase tracking-tighter">Classic</p>
          <div className="grid grid-cols-3 gap-2">
            {classic.map(renderItem)}
          </div>
        </div>
        
        <div>
          <p className="mb-2 text-[9px] font-bold text-[#8C7783]/60 uppercase tracking-tighter">Wide & Cinematic</p>
          <div className="grid grid-cols-3 gap-2">
            {wide.map(renderItem)}
          </div>
        </div>
      </div>
    </div>
  );
}
