'use client';

import { useState, useMemo } from 'react';
import { Search, X, Calendar, Tag as TagIcon } from 'lucide-react';

interface SearchPanelProps {
  notes: any[];
  onNoteClick: (noteId: string) => void;
  onClose: () => void;
}

function highlightText(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-[#FFD6A5]/50 text-[#4A2F3C] rounded px-0.5">$1</mark>');
}

const MOOD_EMOJI: Record<string, string> = {
  memory: 'Memory', hope: 'Hope', secret: 'Secret',
  dream: 'Dream', ordinary: 'Ordinary', important: 'Important',
};

const MOOD_COLORS: Record<string, string> = {
  memory: '#C7CEEA', hope: '#B5EAD7', secret: '#E0BBE4',
  dream: '#FFD6A5', ordinary: '#D4D4D4', important: '#FF8FA3',
};

export default function SearchPanel({ notes, onNoteClick, onClose }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [filterMood, setFilterMood] = useState('');

  const results = useMemo(() => {
    if (!query && !filterMood) return [];
    
    return notes.filter((note: any) => {
      const q = query.toLowerCase();
      const matchesQuery = !query || 
        note.title?.toLowerCase().includes(q) || 
        note.content?.replace(/<[^>]*>/g, '').toLowerCase().includes(q) ||
        note.tags?.some((t: any) => t.name.toLowerCase().includes(q));
      
      const matchesMood = !filterMood || note.mood === filterMood;
      
      return matchesQuery && matchesMood;
    });
  }, [notes, query, filterMood]);

  return (
    <div className="fixed inset-0 z-50 bg-[#5A3E4C]/20 backdrop-blur-sm flex items-start justify-center pt-20">
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-pink-200/30 border border-[#FFB4A2]/15 overflow-hidden animate-fade-in-up">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#FFB4A2]/15">
          <Search className="w-5 h-5 text-[#FF8FA3]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari catatan, tag, atau kutipan..."
            className="flex-1 bg-transparent text-[#4A2F3C] placeholder-[#5A3E4C]/30 focus:outline-none text-sm"
            autoFocus
          />
          <button onClick={onClose} className="p-1.5 text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mood Filter */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-[#FFB4A2]/10 overflow-x-auto">
          <span className="text-[10px] text-[#5A3E4C]/40 uppercase font-semibold shrink-0">Moment:</span>
          <button
            onClick={() => setFilterMood('')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${!filterMood ? 'bg-[#FF8FA3]/10 text-[#FF8FA3]' : 'text-[#5A3E4C]/40 hover:text-[#5A3E4C]/60'}`}
          >
            All
          </button>
          {Object.entries(MOOD_COLORS).map(([id, color]) => (
            <button
              key={id}
              onClick={() => setFilterMood(filterMood === id ? '' : id)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-all ${filterMood === id ? 'bg-[#FF8FA3]/10 text-[#FF8FA3]' : 'text-[#5A3E4C]/40 hover:text-[#5A3E4C]/60'}`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              {MOOD_EMOJI[id]}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {(query || filterMood) && results.length === 0 && (
            <div className="text-center py-10 text-[#5A3E4C]/40 text-sm">
              Tidak ditemukan hasil.
            </div>
          )}

          {results.map((note: any) => {
            const plainContent = note.content?.replace(/<[^>]*>/g, '') || '';
            const time = new Date(note.createdAt || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

            return (
              <div
                key={note.id}
                onClick={() => { onNoteClick(note.id); onClose(); }}
                className="px-5 py-3 border-b border-[#FFB4A2]/8 hover:bg-[#FFF5F0]/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  {note.mood && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MOOD_COLORS[note.mood] || '#D4D4D4' }} />}
                  <h4
                    className="font-medium text-sm text-[#4A2F3C] flex-1"
                    dangerouslySetInnerHTML={{ __html: highlightText(note.title || 'Untitled', query) }}
                  />
                  <span className="text-[10px] text-[#5A3E4C]/30 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {time}
                  </span>
                </div>
                <p
                  className="text-xs text-[#5A3E4C]/50 line-clamp-2 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: highlightText(plainContent.slice(0, 150), query) }}
                />
                {note.tags && note.tags.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {note.tags.map((tag: any) => (
                      <span key={tag.id} className="px-1.5 py-0.5 rounded text-[9px] font-medium text-white" style={{ backgroundColor: tag.color || '#FF8FA3' }}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {!query && !filterMood && (
            <div className="text-center py-10 text-[#5A3E4C]/30 text-sm">
              Ketik untuk mulai mencari...
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-5 py-2.5 border-t border-[#FFB4A2]/10 text-[10px] text-[#5A3E4C]/30">
            {results.length} hasil ditemukan
          </div>
        )}
      </div>
    </div>
  );
}
