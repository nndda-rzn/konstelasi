"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_MEDIA } from "@/graphql/queries";

export type GalleryFilter = "all" | "canvas" | "story";

export interface MediaItem {
  id: string;
  imageUrl: string;
  caption?: string;
  createdAt: string;
  note?: {
    id: string;
    title?: string;
    canvas?: { name: string };
    story?: { id: string; title: string };
  };
}

/**
 * useGallery - Manages gallery media data + filter state.
 * Returns filtered media list, loading state, and filter actions.
 */
export const useGallery = () => {
  const [filter, setFilter] = useState<GalleryFilter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

  const { data, loading } = useQuery<{ getAllMedia: MediaItem[] }>(
    GET_ALL_MEDIA,
    { fetchPolicy: "cache-and-network" }
  );

  const allImages = useMemo(() => data?.getAllMedia || [], [data]);

  const filteredImages = useMemo(() => {
    if (filter === "all") return allImages;
    if (filter === "canvas")
      return allImages.filter((img) => img.note?.canvas);
    if (filter === "story") return allImages.filter((img) => img.note?.story);
    return allImages;
  }, [allImages, filter]);

  return {
    filter,
    setFilter,
    showFilters,
    setShowFilters,
    selectedImage,
    setSelectedImage,
    allImages,
    filteredImages,
    loading,
  };
};
