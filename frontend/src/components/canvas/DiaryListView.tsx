'use client';

import { useQuery } from '@apollo/client/react';
import { GET_NOTES } from '@/graphql/queries';
import { Loader2, Plus, Image as ImageIcon, LogOut, Sparkles, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import NoteEditorSidebar from './NoteEditorSidebar';
import { useMutation } from '@apollo/client/react';
import { CREATE_NOTE } from '@/graphql/mutations';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const COLOR_LINES: Record<string, string> = {
  default: 'from-white/20',
  red: 'from-red-500/50',
  amber: 'from-amber-500/50',
  emerald: 'from-emerald-500/50',
  blue: 'from-blue-500/50',
  indigo: 'from-indigo-500/50',
  purple: 'from-purple-500/50',
  pink: 'from-pink-500/50',
};

export default function DiaryListView() {
  const router = useRouter();
  const supabase = createClient();
  const { data, loading, error, refetch } = useQuery<any>(GET_NOTES, {
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
      alert("Error creating note: " + err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0f0f14] p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse" />
          <Loader2 className="relative animate-spin text-red-400 w-10 h-10" />
        </div>
        <p className="text-white/30 text-xs uppercase tracking-wider">Loading notes...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="text-red-400 p-6 font-medium flex-col gap-3 flex bg-[#0f0f14] min-h-screen items-center justify-center">
      <p className="text-white/40 text-sm">Error loading notes</p>
      <button onClick={() => refetch()} className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-medium shadow-lg shadow-red-900/30">Retry</button>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#0f0f14] pt-20 p-4">
      {/* ── Header ── */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-[#0f0f14]/80 backdrop-blur-2xl border-b border-white/[0.06] z-10 flex items-center justify-between px-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-900/30">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-red-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">Konstelasi</h1>
        </div>
        <button onClick={handleLogout} className="text-white/30 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-white/[0.04]">
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* ── Title + Create + Search ── */}
      <div className="flex flex-col gap-4 mb-6 max-w-2xl mx-auto mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white/80">My Notes</h2>
          <button 
            onClick={handleCreateNewNote}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-red-900/30 hover:shadow-red-900/50"
          >
            <Plus className="w-4 h-4" /> New Note
          </button>
        </div>
        
        <div className="relative w-full">
          <Search className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search your thoughts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-11 pr-4 py-3 text-sm text-white/90 placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 transition-all hover:bg-white/[0.05]"
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
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:border-white/20 hover:bg-white/[0.06] transition-all cursor-pointer flex flex-col min-h-[150px] group animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => setSelectedNote(note)}
            >
              {/* Top accent */}
              <div className={`h-0.5 w-12 rounded-full bg-gradient-to-r ${accentColor} to-transparent mb-3 group-hover:w-20 transition-all`} />
              <h3 className="font-semibold text-base text-white/80 mb-1.5 truncate">{note.title || 'Untitled'}</h3>
            <p className="text-white/30 text-sm line-clamp-3 mb-auto leading-relaxed">
              {note.content ? note.content.replace(/<[^>]*>/g, '') : 'Drafting new ideas...'}
            </p>
            {note.images?.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-red-300/60 font-medium mt-3 bg-red-500/[0.08] w-max px-2.5 py-1 rounded-lg">
                <ImageIcon className="w-3 h-3" /> {note.images.length}
              </div>
            )}
            </div>
          );
        })}
      </div>
      
      {/* ── Empty State ── */}
      {filteredNotes.length === 0 && (
         <div className="text-center p-10 mt-10 max-w-2xl mx-auto bg-white/[0.03] rounded-2xl border border-dashed border-white/[0.08] text-white/30">
           <p className="text-lg mb-2">✨</p>
           {searchQuery ? (
             <p>No notes found matching "{searchQuery}".</p>
           ) : (
             <>
               <p>You don&apos;t have any notes yet.</p>
               <p className="text-sm text-white/20 mt-1">Create one to get started!</p>
             </>
           )}
         </div>
      )}

      {/* ── Sidebar Editor ── */}
      {selectedNote && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
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
