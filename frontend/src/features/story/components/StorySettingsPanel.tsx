"use client";

import { useState } from "react";
import { SettingsHeader } from "./settings/SettingsHeader";
import { TextField } from "./settings/TextField";
import { StatusSelector } from "./settings/StatusSelector";
import { PrivacySelector } from "./settings/PrivacySelector";
import { ScrapbookPicker } from "./settings/ScrapbookPicker";
import { FriendsAccessList } from "./settings/FriendsAccessList";
import { SettingsSaveBar } from "./settings/SettingsSaveBar";
import { useStorySettings } from "./settings/useStorySettings";

interface StorySettingsPanelProps {
  story: any;
  onClose: () => void;
  onUpdate: (input: any) => Promise<void>;
  onDelete?: () => void;
}

export default function StorySettingsPanel({
  story,
  onClose,
  onUpdate,
  onDelete,
}: StorySettingsPanelProps) {
  const settings = useStorySettings(story, onUpdate, onDelete);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="absolute top-0 right-0 h-full w-[360px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl border-l border-[#FFB8C0]/15 dark:border-[#E63946]/10 shadow-2xl z-50 flex flex-col overflow-hidden">
      <SettingsHeader onClose={onClose} />

      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        <div className="space-y-3">
          <TextField label="Judul" value={settings.title} onChange={settings.setTitle} />
          <TextField
            label="Subtitle"
            value={settings.subtitle}
            onChange={settings.setSubtitle}
          />
          <TextField
            label="Deskripsi"
            value={settings.description}
            onChange={settings.setDescription}
            multiline
          />
        </div>

        <StatusSelector value={settings.status} onChange={settings.setStatus} />
        <PrivacySelector value={settings.privacyLevel} onChange={settings.setPrivacyLevel} />

        <ScrapbookPicker
          background={settings.scrapbookTheme.background}
          font={settings.scrapbookTheme.font}
          onBackgroundChange={(v) =>
            settings.setScrapbookTheme({ ...settings.scrapbookTheme, background: v })
          }
          onFontChange={(v) =>
            settings.setScrapbookTheme({ ...settings.scrapbookTheme, font: v })
          }
        />

        {settings.privacyLevel === "FRIENDS_ONLY" && (
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-2">
              Undang Teman
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="email"
                value={settings.inviteEmail}
                onChange={(e) => settings.setInviteEmail(e.target.value)}
                placeholder="Email teman..."
                className="flex-1 px-3 py-2 rounded-lg border border-[#FFB8C0]/20 bg-white/50 dark:bg-[#1a1625]/50 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] focus:outline-none focus:border-[#E63946]/50"
              />
              <button
                onClick={settings.handleInvite}
                className="px-3 py-2 rounded-lg bg-[#E63946] text-white text-xs font-medium"
              >
                Undang
              </button>
            </div>
            <FriendsAccessList
              accessList={settings.accessList}
              onRevoke={settings.handleRevoke}
            />
          </div>
        )}
      </div>

      <SettingsSaveBar
        saving={settings.saving}
        showDeleteConfirm={showDeleteConfirm}
        onSave={settings.handleSave}
        onToggleDelete={() => setShowDeleteConfirm((s) => !s)}
        onConfirmDelete={settings.handleDelete}
      />
    </div>
  );
}
