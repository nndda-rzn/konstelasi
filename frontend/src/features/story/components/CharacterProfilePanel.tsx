'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { X, User, Heart, MessageCircle, Calendar, PenTool, Star } from 'lucide-react';
import { GET_CHARACTER_PROFILE } from '@/graphql/queries';

const NODE_COLORS: Record<string, string> = {
  scene: '#FF6B8B', memory: '#7C83FD', character: '#C074DF', dialogue: '#38D9A9',
  moment: '#FF922B', feeling: '#F03E3E', timeline_event: '#4DABF7', media: '#CC5DE8',
  quote: '#FCC419', reflection: '#3BC9DB',
};

const MOOD_COLORS: Record<string, string> = {
  happy: '#FF922B', sad: '#7C83FD', excited: '#FF6B8B', peaceful: '#38D9A9',
  romantic: '#C074DF', melancholic: '#4DABF7', nostalgic: '#CC5DE8', hopeful: '#3BC9DB',
};

interface CharacterProfilePanelProps {
  storyId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CharacterProfilePanel({ storyId, isOpen, onClose }: CharacterProfilePanelProps) {
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  const { data, loading } = useQuery<any>(GET_CHARACTER_PROFILE, {
    variables: { storyId },
    skip: !isOpen,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  });

  if (!isOpen) return null;

  const profile = data?.getCharacterProfile;
  const characters = profile?.characters || [];
  const activeChar = selectedChar ? characters.find((c: any) => c.nodeId === selectedChar) : null;

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="absolute top-0 right-0 h-full w-[380px] bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-xl border-l border-[#FFB8C0]/15 dark:border-[#E63946]/10 shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB8C0]/10 dark:border-[#E63946]/10">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#C074DF]" />
          <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">
            {activeChar ? activeChar.name : 'Character Profile'}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {activeChar && (
            <button onClick={() => setSelectedChar(null)} className="px-2 py-1 rounded-lg text-[10px] text-[#5A3E4C]/60 hover:bg-[#FFB8C0]/10 transition-colors">
              Kembali
            </button>
          )}
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFB8C0]/10 transition-colors">
            <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-5 h-5 border-2 border-[#C074DF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center py-10">
            <User className="w-8 h-8 text-[#5A3E4C]/20 dark:text-[#e2d9f3]/20 mx-auto mb-2" />
            <p className="text-xs text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Tambahkan node bertipe "Character" untuk melihat profil</p>
          </div>
        ) : !activeChar ? (
          /* Character List */
          <>
            {/* Summary */}
            <div className="p-3 rounded-xl bg-[#C074DF]/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">Total Characters</span>
                <span className="text-sm font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{profile.totalCharacters}</span>
              </div>
              {profile.mostMentioned && (
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">Paling sering disebut</span>
                  <span className="text-[10px] font-semibold text-[#C074DF]">{profile.mostMentioned.name} ({profile.mostMentioned.mentions}x)</span>
                </div>
              )}
            </div>

            {/* Character Cards */}
            <div className="space-y-2.5">
              {characters.map((char: any) => (
                <button
                  key={char.nodeId}
                  onClick={() => setSelectedChar(char.nodeId)}
                  className="w-full text-left p-3 rounded-xl border border-[#FFB8C0]/10 dark:border-[#E63946]/5 bg-white/50 dark:bg-white/5 hover:border-[#C074DF]/30 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#C074DF]/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-[#C074DF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#4A2F3C] dark:text-[#e2d9f3] truncate">{char.name}</p>
                      <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">{char.totalMentions} mentions · {char.totalWords.toLocaleString()} kata</p>
                    </div>
                    {char.mood && (
                      <span className="text-[9px] capitalize px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${MOOD_COLORS[char.mood]}15`, color: MOOD_COLORS[char.mood] }}>{char.mood}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Character Detail */
          <>
            {/* Character Header */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#C074DF]/10 flex items-center justify-center mx-auto mb-2">
                <User className="w-7 h-7 text-[#C074DF]" />
              </div>
              <h4 className="text-sm font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{activeChar.name}</h4>
              {activeChar.mood && (
                <span className="text-[10px] capitalize px-2 py-0.5 rounded-full mt-1 inline-block" style={{ backgroundColor: `${MOOD_COLORS[activeChar.mood]}15`, color: MOOD_COLORS[activeChar.mood] }}>{activeChar.mood}</span>
              )}
            </div>

            {/* Description */}
            {activeChar.description && (
              <div className="p-3 rounded-xl bg-[#C074DF]/5">
                <p className="text-[10px] text-[#5A3E4C]/60 dark:text-[#e2d9f3]/50 leading-relaxed">{activeChar.description}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-[#FF6B8B]/5 text-center">
                <p className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{activeChar.totalMentions}</p>
                <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Mentions</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#7C83FD]/5 text-center">
                <p className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{activeChar.totalWords.toLocaleString()}</p>
                <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Kata</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#38D9A9]/5 text-center">
                <p className="text-[10px] font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">{formatDate(activeChar.firstAppearance)}</p>
                <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Pertama</p>
              </div>
            </div>

            {/* Mood Distribution */}
            {activeChar.moodDistribution?.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Mood saat disebut</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeChar.moodDistribution.map((item: any) => (
                    <span key={item.mood} className="px-2 py-1 rounded-full text-[9px] font-medium capitalize" style={{ backgroundColor: `${MOOD_COLORS[item.mood] || '#94a3b8'}15`, color: MOOD_COLORS[item.mood] || '#94a3b8' }}>
                      {item.mood} ({item.count})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Appearances */}
            {activeChar.appearances?.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 font-semibold mb-2">Muncul di</h4>
                <div className="space-y-1.5">
                  {activeChar.appearances.map((app: any) => (
                    <div key={app.nodeId} className="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-white/5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: NODE_COLORS[app.nodeType] || '#94a3b8' }} />
                      <span className="text-[10px] text-[#4A2F3C] dark:text-[#e2d9f3] flex-1 truncate">{app.title}</span>
                      <span className="text-[9px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20">{formatDate(app.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
