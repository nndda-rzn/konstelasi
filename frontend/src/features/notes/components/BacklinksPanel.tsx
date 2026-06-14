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
    return found?.title || 'Untitled note';
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
      <div className="px-4 py-3 rounded-[12px] bg-[#F3ECE4]/50 border border-[rgba(47,39,48,0.08)]">
        <div className="flex items-center gap-2">
          <Link2 className="w-3.5 h-3.5 text-[#9A8F95]" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6F626A]">Related memories</p>
        </div>
        <p className="text-[11px] text-[#9A8F95] mt-2 leading-relaxed">
          No connections yet. Link notes on the canvas to build a memory network.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 rounded-[12px] bg-[#F3ECE4]/50 border border-[rgba(47,39,48,0.08)] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="w-3.5 h-3.5 text-[#B84A5A]" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6F626A]">Related memories</p>
        </div>
        <span className="text-[10px] text-[#9A8F95]">{incoming.length + outgoing.length}</span>
      </div>

      {outgoing.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <ArrowRight className="w-3 h-3 text-[#B84A5A]/70" />
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#9A8F95]">
              Linked to ({outgoing.length})
            </p>
          </div>
          <div className="space-y-1">
            {outgoing.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.noteId)}
                className="w-full text-left px-3 py-2 rounded-[10px] bg-[#FFFCF8]/80 hover:bg-white border border-[rgba(47,39,48,0.06)] hover:border-[#B84A5A]/25 transition-colors group"
              >
                <p className="text-xs font-medium text-[#2F2730] truncate group-hover:text-[#B84A5A]">
                  {item.title}
                </p>
                {item.label && (
                  <p className="text-[10px] text-[#9A8F95] mt-0.5 italic truncate">{item.label}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {incoming.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <ArrowLeft className="w-3 h-3 text-[#B84A5A]/70" />
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#9A8F95]">
              Referenced by ({incoming.length})
            </p>
          </div>
          <div className="space-y-1">
            {incoming.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.noteId)}
                className="w-full text-left px-3 py-2 rounded-[10px] bg-[#FFFCF8]/80 hover:bg-white border border-[rgba(47,39,48,0.06)] hover:border-[#B84A5A]/25 transition-colors group"
              >
                <p className="text-xs font-medium text-[#2F2730] truncate group-hover:text-[#B84A5A]">
                  {item.title}
                </p>
                {item.label && (
                  <p className="text-[10px] text-[#9A8F95] mt-0.5 italic truncate">{item.label}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
