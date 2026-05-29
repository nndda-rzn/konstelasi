'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import { createClient } from '@/lib/supabase/client';
import { ADD_NOTE_IMAGE, DELETE_NOTE_IMAGE } from '@/graphql/mutations';
import { notify } from '@/lib/toast';

interface NoteImage {
  id: string;
  imageUrl: string;
  caption?: string | null;
}

interface UseNoteImageUploadParams {
  noteId: string;
  initialImages?: NoteImage[];
  /** Called whenever the images list changes; useful for canvas cache sync. */
  onImagesChange?: (images: NoteImage[]) => void;
}

interface UseNoteImageUploadResult {
  images: NoteImage[];
  setImages: React.Dispatch<React.SetStateAction<NoteImage[]>>;
  uploading: boolean;
  uploadImage: (file: File) => Promise<NoteImage | null>;
  uploadFromInputEvent: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  deleteImage: (imageId: string) => Promise<void>;
}

/**
 * Encapsulates all image upload/delete logic for a note:
 * - Uploads to Supabase storage (`notes_images` bucket).
 * - Adds metadata via GraphQL `addNoteImage` mutation.
 * - Maintains the local images array, mirrored to parent via `onImagesChange`.
 *
 * Extracted from NoteEditorSidebar.
 */
export function useNoteImageUpload({
  noteId,
  initialImages = [],
  onImagesChange,
}: UseNoteImageUploadParams): UseNoteImageUploadResult {
  const supabase = createClient();
  const [images, setImages] = useState<NoteImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [addNoteImage] = useMutation<any>(ADD_NOTE_IMAGE);
  const [deleteNoteImage] = useMutation<any>(DELETE_NOTE_IMAGE);

  const uploadImage = useCallback(
    async (file: File): Promise<NoteImage | null> => {
      setUploading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const userId = user?.id || 'anonymous';
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()
          .toString(36)
          .substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('notes_images')
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('notes_images')
          .getPublicUrl(filePath);
        const publicUrl = publicUrlData.publicUrl;

        const { data } = await addNoteImage({
          variables: {
            input: { noteId, imageUrl: publicUrl, caption: '' },
          },
        });

        if (data?.addNoteImage) {
          const newImages = [...images, data.addNoteImage];
          setImages(newImages);
          onImagesChange?.(newImages);
          return data.addNoteImage;
        }
        return null;
      } catch (err) {
        console.error('Image upload failed:', err);
        notify.error('Gagal mengunggah gambar');
        return null;
      } finally {
        setUploading(false);
      }
    },
    [noteId, images, supabase, addNoteImage, onImagesChange]
  );

  const uploadFromInputEvent = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await uploadImage(file);
    },
    [uploadImage]
  );

  const deleteImage = useCallback(
    async (imageId: string) => {
      try {
        await deleteNoteImage({ variables: { id: imageId } });
        const newImages = images.filter((img) => img.id !== imageId);
        setImages(newImages);
        onImagesChange?.(newImages);
      } catch (err) {
        console.error('Image delete failed:', err);
        notify.error('Gagal menghapus gambar');
      }
    },
    [images, deleteNoteImage, onImagesChange]
  );

  return {
    images,
    setImages,
    uploading,
    uploadImage,
    uploadFromInputEvent,
    deleteImage,
  };
}
