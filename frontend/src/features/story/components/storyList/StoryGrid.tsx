"use client";

import { Globe, Lock, Users } from "lucide-react";
import { STORY_TYPES } from "../StoryWizard";

interface StoryGridProps {
  stories: any[];
  onNavigate: (storyId: string) => void;
}

const PRIVACY_ICON: Record<string, any> = {
  private: Lock,
  friends_only: Users,
  public: Globe,
};

export function StoryGrid({ stories, onNavigate }: StoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stories.map((story) => {
        const typeInfo =
          STORY_TYPES.find(
            (t) => t.value === story.storyType?.toLowerCase()
          ) || STORY_TYPES[5];
        const TypeIcon = typeInfo.icon;
        const PrivacyIcon = PRIVACY_ICON[story.privacyLevel] || Lock;
        const isPublished = story.status?.toLowerCase() === "published";

        return (
          <button
            key={story.id}
            onClick={() => onNavigate(story.id)}
            className="text-left p-5 rounded-2xl border border-[#FFB8C0]/15 dark:border-[#E63946]/10 bg-white/80 dark:bg-[#2a2438]/80 hover:shadow-lg hover:shadow-[#E63946]/5 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${typeInfo.color}20` }}
              >
                <TypeIcon
                  className="w-4 h-4"
                  style={{ color: typeInfo.color }}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <PrivacyIcon className="w-3 h-3 text-[#5A3E4C]/30" />
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isPublished
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {story.status?.toLowerCase()}
                </span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3] mb-1 group-hover:text-[#E63946] transition-colors">
              {story.title}
            </h3>
            {story.subtitle && (
              <p className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mb-2">
                {story.subtitle}
              </p>
            )}
            <p className="text-[10px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20">
              {new Date(story.updatedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </button>
        );
      })}
    </div>
  );
}
