'use client';

import { useQuery } from '@apollo/client/react';
import { GET_NOTES } from '@/graphql/queries';
import { Loader2, Plus, Image as ImageIcon, LogOut, Sparkles, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import NoteEditorSidebar from './NoteEditorSidebar';
import { useMutation } from '@apollo/client/react';
import { CREATE_NOTE } from '@/graphql/mutations';
import { createClient } from '@/lib/supabase/client';
import { notify } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { useCanvas } from '@/context/CanvasContext';

const COLOR_LINES: Record<string, string> = {
  default: 'from-[#FFB4A2]/40',
  red: 'from-[#FF8FA3]/50',
  amber: 'from-amber-400/50',
  emerald: 'from-emerald-400/50',
  blue: 'from-blue-400/50',
  indigo: 'from-indigo-400/50',
  purple: 'from-purple-400/50',
  pink: 'from-pink-400/50',
};

export default function DiaryListView() {
  const router = useRouter();
  const supabase = createClient();
  const { selectedCanvasId } = useCanvas();
  const { data, loading, error, refetch } = useQuery<any>(GET_NOTES, {
    variables: { canvasId: selectedCanvasId || undefined },
    fetchPolicy: 'cache-and-network',
    ssr: false
  });
  
  const [createNote] = useMutation<any>(CREATE_NOTE);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = useMemo(() => {
    if (!data?.getNotes) return [];
    if (!searchQuery) return data.getNotes;
    
    return data.getNotes.filter((note: any) => {
      const q = searchQuery.toLowerCase();
      return (note.title?.toLowerCase().includes(q) || note.content?.toLowerCase().includes(q));
    });
  }, [data?.getNotes, searchQuery]);

  const handleUpdateCache = (nodeId: string, newTitle?: string, newContent?: string) => {
    refetch();
  };

  const handleDeleteSuccess = (nodeId: string) => {
    setSelectedNote(null);
    refetch();
  };

  const handleCreateNewNote = async () => {
    try {
      const { data } = await createNote({
        variables: {
          input: {
            title: "New Note",
            positionX: 0,
            positionY: 0
          }
        }
      });
      if (data?.createNote) {
        refetch();
        setSelectedNote(data.createNote);
      }
    } catch (err: any) {
      notify.error("Gagal membuat catatan: " + err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#FFFAF7] p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#FFB4A2]/20 blur-xl animate-pulse" />
          <Loader2 className="relative animate-spin text-[#FF8FA3] w-10 h-10" />
        </div>
        <p className="text-[#5A3E4C]/40 text-xs uppercase tracking-wider">Loading notes...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="text-[#FF6B9D] p-6 font-medium flex-col gap-3 flex bg-[#FFFAF7] min-h-screen items-center justify-center">
      <p className="text-[#5A3E4C]/50 text-sm">Error loading notes</p>
      <button onClick={() => refetch()} className="px-5 py-2.5 bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] text-white rounded-xl font-medium shadow-lg shadow-pink-300/30">Retry</button>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#FFFAF7] pt-20 p-4">
      {/* ── Header ── */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-[#FFFAF7]/80 backdrop-blur-2xl border-b border-[#FFB4A2]/15 z-10 flex items-center justify-between px-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF8FA3] to-[#FFB4A2] flex items-center justify-center shadow-lg shadow-pink-300/30">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-[#FF8FA3] via-[#FFB4A2] to-[#FFD6A5] bg-clip-text text-transparent">Konstelasi</h1>
        </div>
        <button onClick={handleLogout} className="text-[#5A3E4C]/30 hover:text-[#FF8FA3] transition-colors p-2 rounded-lg hover:bg-[#FFB4A2]/10">
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* ── Title + Create + Search ── */}
      <div className="flex flex-col gap-4 mb-6 max-w-2xl mx-auto mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#4A2F3C]">My Notes</h2>
          <button 
            onClick={handleCreateNewNote}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] hover:from-[#FF7A8A] hover:to-[#FF8FA3] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-pink-300/30 hover:shadow-pink-300/50"
          >
            <Plus className="w-4 h-4" /> New Note
          </button>
        </div>
        
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#5A3E4C]/30 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search your thoughts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/60 border border-[#FFB4A2]/15 rounded-xl pl-11 pr-4 py-3 text-sm text-[#5A3E4C] placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-1 focus:ring-[#FF8FA3]/40 focus:border-[#FF8FA3]/40 transition-all hover:bg-white/80"
          />
        </div>
      </div>
      
      {/* ── Notes Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
        {filteredNotes.map((note: any, i: number) => {
          const accentColor = COLOR_LINES[note.color || 'default'] || COLOR_LINES.default;
          
          return (
            <div 
              key={note.id} 
              className="bg-white/70 border border-[#FFB4A2]/15 rounded-2xl p-5 hover:border-[#FF8FA3]/30 hover:bg-white/90 transition-all cursor-pointer flex flex-col min-h-[150px] group animate-fade-in-up shadow-sm hover:shadow-md hover:shadow-pink-200/20"
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => setSelectedNote(note)}
            >
              {/* Top accent */}
              <div className={`h-0.5 w-12 rounded-full bg-gradient-to-r ${accentColor} to-transparent mb-3 group-hover:w-20 transition-all`} />
              <h3 className="font-semibold text-base text-[#4A2F3C] mb-1.5 truncate">{note.title || 'Untitled'}</h3>
            <p className="text-[#5A3E4C]/50 text-sm line-clamp-3 mb-auto leading-relaxed">
              {note.content ? note.content.replace(/<[^>]*>/g, '') : 'Drafting new ideas...'}
            </p>
            {note.images?.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-[#FF8FA3] font-medium mt-3 bg-[#FF8FA3]/[0.08] w-max px-2.5 py-1 rounded-lg">
                <ImageIcon className="w-3 h-3" /> {note.images.length}
              </div>
            )}
            </div>
          );
        })}
      </div>
      
      {/* ── Empty State ── */}
      {filteredNotes.length === 0 && (
         <div className="text-center p-10 mt-10 max-w-2xl mx-auto bg-white/50 rounded-2xl border border-dashed border-[#FFB4A2]/20 text-[#5A3E4C]/50">
           <p className="text-lg mb-2">✨</p>
           {searchQuery ? (
             <p>No notes found matching &quot;{searchQuery}&quot;.</p>
           ) : (
             <>
               <p>You don&apos;t have any notes yet.</p>
               <p className="text-sm text-[#5A3E4C]/30 mt-1">Create one to get started!</p>
             </>
           )}
         </div>
      )}

      {/* ── Sidebar Editor ── */}
      {selectedNote && (
        <div className="fixed inset-0 z-40 bg-[#5A3E4C]/20 backdrop-blur-sm">
          <NoteEditorSidebar 
            note={data?.getNotes?.find((n:any) => n.id === selectedNote.id) || selectedNote} 
            onClose={() => setSelectedNote(null)} 
            onUpdateCache={handleUpdateCache}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </div>
      )}
    </div>
  );
}
