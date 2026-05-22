'use client';

import { useState } from 'react';
import { X, PenTool, Heart, Hourglass, GitBranch, User, BarChart3, Sparkles } from 'lucide-react';

const TABS = [
  { id: 'stats', label: 'Stats', icon: PenTool, color: '#7C83FD' },
  { id: 'emotional', label: 'Emosi', icon: Heart, color: '#FF6B8B' },
  { id: 'timeline', label: 'Memori', icon: Hourglass, color: '#CC5DE8' },
  { id: 'versions', label: 'Versi', icon: GitBranch, color: '#38D9A9' },
  { id: 'characters', label: 'Karakter', icon: User, color: '#C074DF' },
  { id: 'analytics', label: 'Analitik', icon: BarChart3, color: '#FF922B' },
];

interface InsightsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  activeTab: string | null;
}

export default function InsightsDrawer({ isOpen, onClose, onSelectTab, activeTab }: InsightsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-14 right-2 w-[180px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl border border-[#FFB4A2]/15 dark:border-[#FF8FA3]/10 shadow-2xl rounded-xl z-50 overflow-hidden">
      <div className="px-3 py-2.5 border-b border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B8B]" />
          <span className="text-[11px] font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Story Insights</span>
        </div>
      </div>
      <div className="p-1.5 space-y-0.5">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { onSelectTab(tab.id); onClose(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                isActive
                  ? 'bg-[#FFB4A2]/10 dark:bg-[#FF8FA3]/10'
                  : 'hover:bg-[#FFB4A2]/5 dark:hover:bg-[#FF8FA3]/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: tab.color }} />
              <span className={isActive ? 'text-[#4A2F3C] dark:text-[#e2d9f3]' : 'text-[#5A3E4C]/60 dark:text-[#e2d9f3]/50'}>{tab.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tab.color }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
