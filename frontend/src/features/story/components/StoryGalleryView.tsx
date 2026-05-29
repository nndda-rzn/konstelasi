'use client';

import { useMemo, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface StoryGalleryViewProps {
  nodes: any[];
}

function isNodeTimeLocked(node: any) {
  return Boolean(node?.isTimeLocked || (node?.unlockDate && new Date(node.unlockDate).getTime() > Date.now()));
}

export default function StoryGalleryView({ nodes }: StoryGalleryViewProps) {
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const allImages = useMemo(() => {
    const images: any[] = [];
    nodes.forEach((node: any) => {
      if (isNodeTimeLocked(node)) return;
      node.images?.forEach((img: any) => {
        images.push({
          ...img,
          nodeTitle: node.title,
          nodeType: node.storyNodeType || 'scene',
          nodeDate: node.createdAt,
        });
      });
    });
    return images.sort((a, b) => new Date(b.nodeDate).getTime() - new Date(a.nodeDate).getTime());
  }, [nodes]);

  if (allImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ZoomIn className="w-10 h-10 text-[#FFB4A2]/30 mx-auto mb-3" />
          <p className="text-sm text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Belum ada gambar dalam story ini</p>
          <p className="text-[10px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20 mt-1">Tambahkan gambar ke node untuk melihat gallery</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      {/* Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 max-w-5xl mx-auto">
        {allImages.map((img: any) => (
          <button
            key={img.id}
            onClick={() => setSelectedImage(img)}
            className="block w-full mb-3 rounded-xl overflow-hidden group relative break-inside-avoid"
          >
            <img src={img.imageUrl} alt={img.caption || ''} loading="lazy" decoding="async" className="w-full object-cover rounded-xl transition-transform group-hover:scale-[1.02]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end p-3">
              <div>
                <p className="text-[10px] text-white/90 font-medium truncate">{img.nodeTitle || 'Untitled'}</p>
                <p className="text-[8px] text-white/60">{img.nodeType.replace('_', ' ')}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="max-w-[85vw] max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <img src={selectedImage.imageUrl} alt="" loading="lazy" decoding="async" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
            <div className="mt-3 text-center">
              <p className="text-sm text-white/90 font-medium">{selectedImage.nodeTitle}</p>
              {selectedImage.caption && <p className="text-xs text-white/60 mt-1">{selectedImage.caption}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
