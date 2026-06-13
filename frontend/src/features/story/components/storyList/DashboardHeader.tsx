"use client";

import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  showCreate: boolean;
  onCreate: () => void;
}

export function DashboardHeader({ showCreate, onCreate }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">
            Stories
          </h1>
          <p className="text-sm text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mt-1">
            Ceritakan kisah Anda melalui connected bubbles
          </p>
        </div>
      </div>
      {showCreate && (
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-candy-primary text-white font-medium text-sm transition-all shadow-candy hover:shadow-candy-lg hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          Buat Story Baru
        </button>
      )}
    </div>
  );
}
