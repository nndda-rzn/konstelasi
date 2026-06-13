"use client";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ExternalLink, Filter, Image as ImageIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { Providers } from "@/lib/Providers";
import { useGallery, type GalleryFilter, type MediaItem } from "@/features/gallery/hooks/useGallery";

const FILTER_OPTIONS: { key: GalleryFilter; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "canvas", label: "Canvas" },
  { key: "story", label: "Story" },
];

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

function GalleryHeader({
  count,
  showFilters,
  onToggleFilters,
  filter,
  setFilter,
}: {
  count: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  filter: GalleryFilter;
  setFilter: (f: GalleryFilter) => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E6B8A2]/15 bg-white/72 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-bold text-[#3F2A35]">Gallery</h1>
            <p className="text-xs text-[#5A3E4C]/50">{count} media</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFilters}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
              showFilters
                ? "border-[#9D0208]/30 bg-[#9D0208]/8 text-[#9D0208]"
                : "border-[#E6B8A2]/30 bg-white/60 text-[#5A3E4C]/60 hover:border-[#E6B8A2]/50"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <FilterBar filter={filter} setFilter={setFilter} />
        )}
      </AnimatePresence>
    </header>
  );
}

function FilterBar({
  filter,
  setFilter,
}: {
  filter: GalleryFilter;
  setFilter: (f: GalleryFilter) => void;
}) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden border-t border-[#E6B8A2]/10"
    >
      <div className="mx-auto flex max-w-7xl gap-2 px-6 py-3">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              filter === opt.key
                ? "bg-gradient-to-r from-[#9D0208] to-[#E63946] text-white shadow-sm"
                : "border border-[#E6B8A2]/30 bg-white/50 text-[#5A3E4C]/55 hover:border-[#E6B8A2]/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function GalleryLoading() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E63946] border-t-transparent" />
    </div>
  );
}

function GalleryEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6B8A2]/15">
        <ImageIcon className="h-7 w-7 text-[#9D0208]/40" />
      </div>
      <p className="text-sm font-semibold text-[#3F2A35]/60">Belum ada media</p>
      <p className="mt-1 text-xs text-[#5A3E4C]/40">
        Upload gambar ke note atau story untuk melihatnya di sini.
      </p>
    </div>
  );
}

function GalleryGrid({
  images,
  onSelect,
}: {
  images: MediaItem[];
  onSelect: (img: MediaItem) => void;
}) {
  const staggerDelay = 0.04;

  return (
    <LayoutGroup>
      <motion.div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5">
        <AnimatePresence mode="popLayout">
          {images.map((img, index) => (
            <ImageCard
              key={img.id}
              image={img}
              index={index}
              staggerDelay={staggerDelay}
              onSelect={onSelect}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}

function ImageCard({
  image,
  index,
  staggerDelay,
  onSelect,
}: {
  image: MediaItem;
  index: number;
  staggerDelay: number;
  onSelect: (img: MediaItem) => void;
}) {
  return (
    <motion.div
      layoutId={image.id}
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        delay: index * staggerDelay,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="mb-4 break-inside-avoid"
    >
      <motion.button
        onClick={() => onSelect(image)}
        className="group relative w-full overflow-hidden rounded-2xl border border-white/60 bg-white/40 shadow-[0_8px_32px_rgba(84,45,55,0.08)] backdrop-blur-sm transition-shadow hover:shadow-[0_16px_48px_rgba(157,2,8,0.12)]"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <img
          src={image.imageUrl}
          alt={image.caption || image.note?.title || ""}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <CardOverlay image={image} />
      </motion.button>
    </motion.div>
  );
}

function CardOverlay({ image }: { image: MediaItem }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/55 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <p className="truncate text-xs font-semibold text-white/95">
        {image.note?.title || "Untitled"}
      </p>
      <div className="mt-1 flex items-center gap-2">
        {image.note?.story && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-medium text-white/80 backdrop-blur-sm">
            {image.note.story.title}
          </span>
        )}
        {image.note?.canvas && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-medium text-white/80 backdrop-blur-sm">
            {image.note.canvas.name}
          </span>
        )}
      </div>
    </div>
  );
}

function Lightbox({
  image,
  onClose,
  onNavigate,
}: {
  image: MediaItem | null;
  onClose: () => void;
  onNavigate: (note: MediaItem["note"]) => void;
}) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            layoutId={image.id}
            className="relative max-h-[88vh] max-w-[90vw] overflow-hidden rounded-3xl border border-white/10 bg-[#1a1625]/90 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <img
              src={image.imageUrl}
              alt={image.caption || ""}
              className="max-h-[75vh] w-auto object-contain"
            />
            <LightboxInfo
              image={image}
              onNavigate={onNavigate}
              onClose={onClose}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LightboxInfo({
  image,
  onNavigate,
  onClose,
}: {
  image: MediaItem;
  onNavigate: (note: MediaItem["note"]) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-white/10 px-5 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white/90">
          {image.note?.title || "Untitled"}
        </p>
        <div className="mt-1 flex items-center gap-2 text-[10px] text-white/50">
          {image.note?.story && <span>{image.note.story.title}</span>}
          {image.note?.canvas && <span>{image.note.canvas.name}</span>}
          <span>
            {new Date(image.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate(image.note)}
          className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/20"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Go to note
        </button>
        <button
          onClick={onClose}
          className="rounded-xl bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
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
