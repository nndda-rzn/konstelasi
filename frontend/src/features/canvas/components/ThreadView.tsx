'use client';

import { memo, useMemo } from 'react';
import NoteNode from '@/features/canvas/components/NoteNode';
import type { NoteNodeData } from '@/features/canvas/types';

interface ThreadNode {
  id: string;
  data: NoteNodeData;
}

interface Props {
  nodes: ThreadNode[];
  selectedNoteId?: string;
  onNodeClick: (nodeId: string) => void;
}

const OTHER_PERSON_TAGS = new Set([
  'crush',
  'dia',
  'him',
  'her',
  'quote',
  'kutipan',
]);

function ThreadView({ nodes, selectedNoteId, onNodeClick }: Props) {
  const visibleNodes = useMemo(
    () =>
      nodes
        .filter((node) => node.data.isMatch)
        .sort((a, b) => {
          const dateA = new Date(a.data.createdAt || 0).getTime();
          const dateB = new Date(b.data.createdAt || 0).getTime();
          return dateA - dateB;
        }),
    [nodes]
  );

  return (
    <div className="w-full h-full overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto py-12 px-6 flex flex-col gap-8">
        {visibleNodes.map((node) => {
          const tags = node.data.tags || [];
          const isOtherPerson = tags.some((t) =>
            OTHER_PERSON_TAGS.has(t.name.toLowerCase())
          );
          const alignClass = isOtherPerson ? 'justify-start' : 'justify-end';
          const incomingEdges = node.data.incomingEdges || [];

          return (
            <div
              key={node.id}
              className={`flex ${alignClass} animate-in fade-in slide-in-from-bottom-4 duration-500 w-full`}
            >
              <div className="flex flex-col max-w-[85%]">
                {incomingEdges.length > 0 && (
                  <div
                    className={`text-xs text-[#5A3E4C]/30 mb-1 px-2 flex flex-col gap-0.5 ${
                      isOtherPerson ? 'items-start' : 'items-end'
                    }`}
                  >
                    {incomingEdges.map((edge, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-50"
                        >
                          <path d="M15 3h6v6" />
                          <path d="M10 14 21 3" />
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        </svg>
                        Reply to: {edge.source?.title || 'a thought'}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onNodeClick(node.id)}
                  aria-label={`Buka catatan ${node.data.title || 'tanpa judul'}`}
                  className="cursor-pointer transition-transform hover:scale-[1.02] text-left focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/40 rounded-3xl"
                >
                  <NoteNode
                    data={{
                      ...node.data,
                      _threadAlign: isOtherPerson ? 'left' : 'right',
                    }}
                    isConnectable={false}
                    selected={selectedNoteId === node.id}
                    viewMode="thread"
                  />
                </button>
              </div>
            </div>
          );
        })}

        {visibleNodes.length === 0 && (
          <div className="text-center text-[#5A3E4C]/30 py-20">
            No thoughts match your search.
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ThreadView);
