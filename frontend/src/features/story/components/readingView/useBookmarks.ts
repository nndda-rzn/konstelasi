"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { TOGGLE_BOOKMARK, GET_BOOKMARKS } from "@/graphql/story";
import { toast } from "sonner";

interface UseBookmarksParams {
  storyId?: string;
}

export const useBookmarks = ({ storyId }: UseBookmarksParams) => {
  const [toggleBookmark] = useMutation(TOGGLE_BOOKMARK);
  const { data, refetch } = useQuery<any>(GET_BOOKMARKS, {
    variables: { storyId },
    skip: !storyId,
  });

  const bookmarkedNodeIds = new Set(
    (data?.getBookmarks || []).map((b: any) => b.node?.id).filter(Boolean)
  );

  const handleToggle = async (nodeId?: string) => {
    if (!storyId || !nodeId) return;
    try {
      await toggleBookmark({ variables: { storyId, nodeId } });
      await refetch();
      const wasBookmarked = bookmarkedNodeIds.has(nodeId);
      toast.success(wasBookmarked ? "Bookmark dihapus" : "Bookmark ditambahkan");
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
      toast.error("Gagal mengubah bookmark");
    }
  };

  return {
    bookmarkedNodeIds,
    handleToggle,
  };
};
