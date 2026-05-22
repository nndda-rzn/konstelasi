'use client';

import { Link2, ArrowRight, ArrowLeft } from 'lucide-react';

interface BacklinksPanelProps {
  note: any;
  allNotes: any[];
  onNavigate: (noteId: string) => void;
}

interface BacklinkItem {
  id: string;
  noteId: string;
  title: string;
  label?: string;
}

export default function BacklinksPanel({ note, allNotes, onNavigate }: BacklinksPanelProps) {
  if (!note) return null;

  const findTitle = (id?: string): string => {
    if (!id) return 'Untitled';
    const found = allNotes.find(n => n.id === id);
    return found?.title || 'Untitled Note';
  };

  const incoming: BacklinkItem[] = (note.incomingEdges || [])
    .filter((edge: any) => edge?.source?.id)
    .map((edge: any) => ({
      id: edge.id,
      noteId: edge.source.id,
      title: edge.source.title || findTitle(edge.source.id),
      label: edge.label,
    }));

  const outgoing: BacklinkItem[] = (note.outgoingEdges || [])
    .filter((edge: any) => edge?.target?.id)
    .map((edge: any) => ({
      id: edge.id,
      noteId: edge.target.id,
      title: findTitle(edge.target.id),
      label: edge.label,
    }));

  if (incoming.length === 0 && outgoing.length === 0) {
    return (
      <div className="px-4 py-3 rounded-xl bg-[#FFE5E8]/30 border border-[#FFB8C0]/20">
        <div className="flex items-center gap-2">
          <Link2 className="w-3.5 h-3.5 text-[#E63946]/60" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#6D5561]">Kenangan Terkait</p>
        </div>
        <p className="text-[10px] text-[#8C7783] mt-2 leading-relaxed">
          Belum ada koneksi. Tarik garis antar note di kanvas untuk membangun jejaring kenangan.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 rounded-xl bg-[#FFE5E8]/30 border border-[#FFB8C0]/20 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="w-3.5 h-3.5 text-[#E63946]" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#6D5561]">Kenangan Terkait</p>
        </div>
        <span className="text-[9px] text-[#8C7783]">{incoming.length + outgoing.length}</span>
      </div>

      {outgoing.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <ArrowRight className="w-3 h-3 text-[#E63946]/70" />
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#8C7783]">
              Menuju ke ({outgoing.length})
            </p>
          </div>
          <div className="space-y-1">
            {outgoing.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.noteId)}
                className="w-full text-left px-3 py-2 rounded-lg bg-white/70 hover:bg-white border border-[#FFB8C0]/20 hover:border-[#E63946]/30 hover:shadow-[0_2px_8px_rgba(230,57,70,0.08)] transition-all group"
              >
                <p className="text-xs font-medium text-[#3F2A35] truncate group-hover:text-[#E63946]">
                  {item.title}
                </p>
                {item.label && (
                  <p className="text-[9px] text-[#8C7783] mt-0.5 italic truncate">{item.label}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {incoming.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <ArrowLeft className="w-3 h-3 text-[#E63946]/70" />
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#8C7783]">
              Disebut oleh ({incoming.length})
            </p>
          </div>
          <div className="space-y-1">
            {incoming.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.noteId)}
                className="w-full text-left px-3 py-2 rounded-lg bg-white/70 hover:bg-white border border-[#FFB8C0]/20 hover:border-[#E63946]/30 hover:shadow-[0_2px_8px_rgba(230,57,70,0.08)] transition-all group"
              >
                <p className="text-xs font-medium text-[#3F2A35] truncate group-hover:text-[#E63946]">
                  {item.title}
                </p>
                {item.label && (
                  <p className="text-[9px] text-[#8C7783] mt-0.5 italic truncate">{item.label}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
