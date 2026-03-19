'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, ImagePlus, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useMutation } from '@apollo/client/react';
import { UPDATE_NOTE_CONTENT, DELETE_NOTE, ADD_NOTE_IMAGE, DELETE_NOTE_IMAGE } from '@/graphql/mutations';
import TiptapEditor from './TiptapEditor';

interface NoteEditorSidebarProps {
  note: any;
  onClose: () => void;
  onDeleteSuccess: (nodeId: string) => void;
  onUpdateCache: (nodeId: string, title?: string, content?: string, newImages?: any[], color?: string) => void;
}

export default function NoteEditorSidebar({ note, onClose, onDeleteSuccess, onUpdateCache }: NoteEditorSidebarProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [color, setColor] = useState(note?.color || 'default');
  const [images, setImages] = useState<any[]>(note?.images || []);
  const [uploading, setUploading] = useState(false);
  
  const supabase = createClient();
  const [updateNoteContent] = useMutation<any>(UPDATE_NOTE_CONTENT);
  const [deleteNote] = useMutation<any>(DELETE_NOTE);
  const [addNoteImage] = useMutation<any>(ADD_NOTE_IMAGE);
  const [deleteNoteImage] = useMutation<any>(DELETE_NOTE_IMAGE);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setColor(note?.color || 'default');
    setImages(note?.images || []);
  }, [note]);

  useEffect(() => {
    if (!note) return;
    
    const handler = setTimeout(() => {
      if (title !== note.title || content !== note.content || color !== (note.color || 'default')) {
        updateNoteContent({
          variables: {
            input: {
              id: note.id,
              title,
              content,
              color
            }
          }
        });
        onUpdateCache(note.id, title, content, undefined, color);
      }
    }, 800);

    return () => clearTimeout(handler);
  }, [title, content, color, note, updateNoteContent, onUpdateCache]);

  const handleDeleteNode = async () => {
    if (confirm('Are you sure you want to delete this note and all its links?')) {
      await deleteNote({ 
        variables: { id: note.id },
        update(cache) {
          cache.modify({
            fields: {
              getNotes(existingNotes = [], { readField }) {
                return existingNotes.filter(
                  (noteRef: any) => note.id !== readField('id', noteRef)
                );
              }
            }
          });
        }
      });
      onDeleteSuccess(note.id);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const userId = '00000000-0000-0000-0000-000000000000';
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
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
          input: {
            noteId: note.id,
            imageUrl: publicUrl,
            caption: '',
          }
        }
      });

      if (data?.addNoteImage) {
        const newImages = [...images, data.addNoteImage];
        setImages(newImages);
        onUpdateCache(note.id, title, content, newImages);
      }

    } catch (err: any) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    if (confirm('Delete this image?')) {
      // Find image to get its URL
      const imgToDelete = images.find(img => img.id === imageId);
      if (imgToDelete) {
        try {
          // Extract file path from public URL
          const urlParts = imgToDelete.imageUrl.split('/notes_images/');
          if (urlParts.length === 2) {
            const filePath = urlParts[1];
            await supabase.storage.from('notes_images').remove([filePath]);
          }
        } catch (e) {
          console.error("Failed to delete physical image", e);
        }
      }

      await deleteNoteImage({ variables: { id: imageId } });
      const newImages = images.filter(img => img.id !== imageId);
      setImages(newImages);
      onUpdateCache(note.id, title, content, newImages);
    }
  };

  if (!note) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-[400px] bg-[#12121a]/95 backdrop-blur-2xl shadow-2xl shadow-black/50 border-l border-white/[0.06] z-50 flex flex-col pt-16 animate-slide-in-right">
      {/* Red accent line */}
      <div className="absolute top-16 left-0 w-px h-full bg-gradient-to-b from-red-500/40 via-rose-500/10 to-transparent" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
        <h2 className="text-lg font-bold bg-gradient-to-r from-red-300 to-rose-200 bg-clip-text text-transparent">Edit Note</h2>
        <div className="flex gap-1.5">
          <button 
            onClick={handleDeleteNode} 
            className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" 
            title="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose} 
            className="p-2 text-white/30 hover:text-white/60 hover:bg-white/[0.06] rounded-lg transition-all" 
            title="Close editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">Title</label>
          <input
            type="text"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/90 text-lg font-semibold px-4 py-3 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/30 transition-all hover:bg-white/[0.06]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">Content</label>
          <TiptapEditor content={content} onChange={setContent} />
          <p className="text-[11px] text-white/20 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
            Auto-saved
          </p>
        </div>

        {/* ── Theme Color ── */}
        <div className="border-t border-white/[0.06] pt-6">
          <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Theme Color</label>
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'default', bg: 'bg-[#13131c]', border: 'border-white/20' },
              { id: 'red', bg: 'bg-red-950/50', border: 'border-red-500/50' },
              { id: 'amber', bg: 'bg-amber-950/50', border: 'border-amber-500/50' },
              { id: 'emerald', bg: 'bg-emerald-950/50', border: 'border-emerald-500/50' },
              { id: 'blue', bg: 'bg-blue-950/50', border: 'border-blue-500/50' },
              { id: 'indigo', bg: 'bg-indigo-950/50', border: 'border-indigo-500/50' },
              { id: 'purple', bg: 'bg-purple-950/50', border: 'border-purple-500/50' },
              { id: 'pink', bg: 'bg-pink-950/50', border: 'border-pink-500/50' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setColor(c.id)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${c.bg} ${color === c.id ? c.border + ' scale-110 shadow-lg' : 'border-transparent hover:border-white/20 hover:scale-105'}`}
                title={c.id.charAt(0).toUpperCase() + c.id.slice(1)}
              />
            ))}
          </div>
        </div>

        {/* ── Attachments ── */}
        <div className="border-t border-white/[0.06] pt-6">
          <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Attachments</label>
          
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.03]">
                <img src={img.imageUrl} alt={img.caption || 'Note attachment'} className="object-cover w-full h-24 opacity-80 group-hover:opacity-100 transition-opacity" />
                <button 
                  onClick={() => handleRemoveImage(img.id)}
                  className="absolute top-1.5 right-1.5 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <label className="flex items-center justify-center w-full p-4 border border-dashed border-white/[0.1] rounded-xl hover:border-red-500/30 hover:bg-red-500/[0.04] cursor-pointer transition-all text-white/30 hover:text-red-300 font-medium text-sm">
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <><ImagePlus className="w-5 h-5 mr-2" /> Upload Image</>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>
        
        {/* ── Backlinks ── */}
        {note.incomingEdges && note.incomingEdges.length > 0 && (
          <div className="border-t border-white/[0.06] pt-6 pb-4">
            <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Mentioned In</label>
            <div className="space-y-2">
              {note.incomingEdges.map((edge: any) => (
                <div key={edge.id} className="px-3 py-2 bg-white/[0.03] border border-white/[0.04] rounded-lg text-sm text-white/70 hover:text-white hover:border-red-500/30 transition-all cursor-pointer flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                  <span className="truncate flex-1">{edge.source.title || 'Untitled Note'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
