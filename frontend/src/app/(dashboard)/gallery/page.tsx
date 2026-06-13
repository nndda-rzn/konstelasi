"use client";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ExternalLink, Filter, Image as ImageIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { Providers } from "@/lib/Providers";
import { useGallery, type GalleryFilter, type MediaItem } from "@/features/gallery/hooks/useGallery";
import { GalleryHeader } from "@/features/gallery/components/GalleryHeader";
import { GalleryGrid } from "@/features/gallery/components/GalleryGrid";
import { GalleryLoading, GalleryEmpty } from "@/features/gallery/components/GalleryStates";
import { Lightbox } from "@/features/gallery/components/Lightbox";

function GalleryContent() {
  const router = useRouter();
  const {
    filter,
    setFilter,
    showFilters,
    setShowFilters,
    selectedImage,
    setSelectedImage,
    filteredImages,
    loading,
  } = useGallery();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#FFF1E8_0%,transparent_34%),radial-gradient(circle_at_bottom_right,#F2E8FF_0%,transparent_30%),linear-gradient(135deg,#FFF8F4_0%,#FFFAF7_50%,#F8F1FF_100%)]">
      <GalleryHeader
        count={filteredImages.length}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filter={filter}
        setFilter={setFilter}
      />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {loading ? (
          <GalleryLoading />
        ) : filteredImages.length === 0 ? (
          <GalleryEmpty />
        ) : (
          <GalleryGrid images={filteredImages} onSelect={setSelectedImage} />
        )}
      </main>

      <Lightbox
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        onNavigate={(note) => {
          if (note?.story?.id) router.push(`/story/${note.story.id}`);
          else router.push("/canvas");
        }}
      />
    </div>
  );
}

export default function GalleryPage() {
  return (
    <ApolloWrapper>
      <Providers>
        <GalleryContent />
      </Providers>
    </ApolloWrapper>
  );
}
