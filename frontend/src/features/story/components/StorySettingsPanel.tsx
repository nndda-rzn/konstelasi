"use client";

import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_STORY_ACCESS,
  GRANT_STORY_ACCESS,
  REVOKE_STORY_ACCESS,
  DELETE_STORY,
} from "@/graphql/story";
import { notify } from "@/lib/toast";
import { parseScrapbookTheme } from "@/features/story/utils/scrapbookTheme";
import { SettingsHeader } from "./settings/SettingsHeader";
import { TextField } from "./settings/TextField";
import { StatusSelector } from "./settings/StatusSelector";
import { PrivacySelector } from "./settings/PrivacySelector";
import { ScrapbookPicker } from "./settings/ScrapbookPicker";
import { FriendsAccessList } from "./settings/FriendsAccessList";
import { DeleteConfirm } from "./settings/DeleteConfirm";

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
  const [title, setTitle] = useState(story.title || "");
  const [subtitle, setSubtitle] = useState(story.subtitle || "");
  const [description, setDescription] = useState(story.description || "");
  const [privacyLevel, setPrivacyLevel] = useState(
    story.privacyLevel?.toUpperCase() || "PRIVATE"
  );
  const [status, setStatus] = useState(story.status?.toUpperCase() || "DRAFT");
  const [scrapbookTheme, setScrapbookTheme] = useState(
    parseScrapbookTheme(story.scrapbookTheme)
  );
  const [inviteEmail, setInviteEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [deleteStoryMutation] = useMutation(DELETE_STORY);

  const { data: accessData, refetch: refetchAccess } = useQuery<any>(
    GET_STORY_ACCESS,
    {
      variables: { storyId: story.id },
      skip: privacyLevel !== "FRIENDS_ONLY",
    }
  );

  const [grantAccess] = useMutation(GRANT_STORY_ACCESS);
  const [revokeAccess] = useMutation(REVOKE_STORY_ACCESS);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({
        title,
        subtitle,
        description,
        privacyLevel,
        status,
        scrapbookTheme: JSON.stringify(scrapbookTheme),
      });
      notify.success("Story berhasil diupdate");
    } catch (err) {
      notify.error("Gagal mengupdate story");
    } finally {
      setSaving(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    try {
      await grantAccess({
        variables: { storyId: story.id, email: inviteEmail, level: "VIEW" },
      });
      setInviteEmail("");
      refetchAccess();
      notify.success("Akses berhasil diberikan");
    } catch (err) {
      notify.error("Gagal memberikan akses");
    }
  };

  const handleRevoke = async (accessId: string) => {
    try {
      await revokeAccess({ variables: { storyId: story.id, accessId } });
      refetchAccess();
      notify.success("Akses dicabut");
    } catch (err) {
      notify.error("Gagal mencabut akses");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStoryMutation({ variables: { id: story.id } });
      notify.success("Story berhasil dihapus");
      onDelete?.();
    } catch (err) {
      notify.error("Gagal menghapus story");
    }
  };

  return (
    <div className="absolute top-0 right-0 h-full w-[360px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl border-l border-[#FFB8C0]/15 dark:border-[#E63946]/10 shadow-2xl z-50 flex flex-col overflow-hidden">
      <SettingsHeader onClose={onClose} />

      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        <div className="space-y-3">
          <TextField label="Judul" value={title} onChange={setTitle} />
          <TextField
            label="Subtitle"
            value={subtitle}
            onChange={setSubtitle}
          />
          <TextField
            label="Deskripsi"
            value={description}
            onChange={setDescription}
            multiline
          />
        </div>

        <StatusSelector value={status} onChange={setStatus} />
        <PrivacySelector value={privacyLevel} onChange={setPrivacyLevel} />

        <ScrapbookPicker
          background={scrapbookTheme.background}
          font={scrapbookTheme.font}
          onBackgroundChange={(v) =>
            setScrapbookTheme({ ...scrapbookTheme, background: v })
          }
          onFontChange={(v) =>
            setScrapbookTheme({ ...scrapbookTheme, font: v })
          }
        />

        {privacyLevel === "FRIENDS_ONLY" && (
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-2">
              Undang Teman
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email teman..."
                className="flex-1 px-3 py-2 rounded-lg border border-[#FFB8C0]/20 bg-white/50 dark:bg-[#1a1625]/50 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] focus:outline-none focus:border-[#E63946]/50"
              />
              <button
                onClick={handleInvite}
                className="px-3 py-2 rounded-lg bg-[#E63946] text-white text-xs font-medium"
              >
                Undang
              </button>
            </div>
            <FriendsAccessList
              accessList={accessData?.getStoryAccess || []}
              onRevoke={handleRevoke}
            />
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-[#FFB8C0]/10 dark:border-[#E63946]/10 space-y-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E63946] hover:bg-[#E63946]/90 text-white text-sm font-medium transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        <DeleteConfirm
          isVisible={showDeleteConfirm}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(!showDeleteConfirm)}
        />
      </div>
    </div>
  );
}
