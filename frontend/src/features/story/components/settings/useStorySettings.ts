"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  GRANT_STORY_ACCESS,
  REVOKE_STORY_ACCESS,
  GET_STORY_ACCESS,
  DELETE_STORY,
} from "@/graphql/story";
import { parseScrapbookTheme } from "../../utils/scrapbookTheme";
import { notify } from "@/lib/toast";

/**
 * useStorySettings - Form state, save, access, and delete
 * mutations for the story settings panel.
 */
export function useStorySettings(
  story: any,
  onUpdate: (input: Record<string, unknown>) => Promise<void>,
  onDelete?: () => void
) {
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

  const [deleteStoryMutation] = useMutation(DELETE_STORY);
  const [grantAccess] = useMutation(GRANT_STORY_ACCESS);
  const [revokeAccess] = useMutation(REVOKE_STORY_ACCESS);

  const { data: accessData, refetch: refetchAccess } = useQuery<any>(
    GET_STORY_ACCESS,
    {
      variables: { storyId: story.id },
      skip: privacyLevel !== "FRIENDS_ONLY",
    }
  );

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
    } catch {
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
    } catch {
      notify.error("Gagal memberikan akses");
    }
  };

  const handleRevoke = async (accessId: string) => {
    try {
      await revokeAccess({ variables: { storyId: story.id, accessId } });
      refetchAccess();
      notify.success("Akses dicabut");
    } catch {
      notify.error("Gagal mencabut akses");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStoryMutation({ variables: { id: story.id } });
      notify.success("Story berhasil dihapus");
      onDelete?.();
    } catch {
      notify.error("Gagal menghapus story");
    }
  };

  return {
    title,
    setTitle,
    subtitle,
    setSubtitle,
    description,
    setDescription,
    privacyLevel,
    setPrivacyLevel,
    status,
    setStatus,
    scrapbookTheme,
    setScrapbookTheme,
    inviteEmail,
    setInviteEmail,
    saving,
    accessList: accessData?.getStoryAccess || [],
    handleSave,
    handleInvite,
    handleRevoke,
    handleDelete,
  };
}
