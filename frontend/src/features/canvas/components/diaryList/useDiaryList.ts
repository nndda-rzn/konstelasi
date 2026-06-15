"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_NOTES } from "@/graphql/queries";
import { CREATE_NOTE } from "@/graphql/mutations";
import { useCanvas } from "@/context/CanvasContext";
import { notify } from "@/lib/toast";

/**
 * useDiaryList - Data + create + selection state for DiaryListView.
 */
export function useDiaryList() {
  const { selectedCanvasId } = useCanvas();
  const { data, loading, error, refetch } = useQuery<any>(GET_NOTES, {
    variables: { canvasId: selectedCanvasId || undefined },
    fetchPolicy: "cache-and-network",
    ssr: false,
  });
  const [createNote] = useMutation<any>(CREATE_NOTE);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = useMemo(() => {
    if (!data?.getNotes) return [];
    if (!searchQuery) return data.getNotes;
    return data.getNotes.filter((note: any) => {
      const q = searchQuery.toLowerCase();
      return (
        note.title?.toLowerCase().includes(q) ||
        note.content?.toLowerCase().includes(q)
      );
    });
  }, [data?.getNotes, searchQuery]);

  const handleCreateNewNote = async () => {
    try {
      const result = await createNote({
        variables: {
          input: {
            title: "New Note",
            positionX: 0,
            positionY: 0,
          },
        },
      });
      if (result.data?.createNote) {
        refetch();
        setSelectedNote(result.data.createNote);
      }
    } catch (err: any) {
      notify.error("Gagal membuat catatan: " + err.message);
    }
  };

  return {
    data,
    loading,
    error,
    refetch,
    notes: filteredNotes,
    selectedNote,
    setSelectedNote,
    searchQuery,
    setSearchQuery,
    handleCreateNewNote,
  };
}
