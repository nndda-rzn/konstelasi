"use client";

import { Plus } from "lucide-react";

interface CanvasSidebarHeaderProps {
  onCreate: () => void;
}

export function CanvasSidebarHeader({ onCreate }: CanvasSidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-[#FFB4A2]/15">
      <h2 className="text-lg font-bold bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] bg-clip-text text-transparent">
        Canvases
      </h2>
      <div className="flex gap-1.5">
        <button
          onClick={onCreate}
          className="p-2 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
          title="New canvas"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
