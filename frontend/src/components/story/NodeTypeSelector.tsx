'use client';

import { useState } from 'react';
import { X, MapPin, Star, Heart, MessageCircle, Lightbulb, Calendar, Image, Quote, PenTool } from 'lucide-react';

const NODE_TYPES = [
  { value: 'scene', label: 'Scene', icon: MapPin, color: '#FF6B8B', desc: 'Lokasi & waktu kejadian' },
  { value: 'memory', label: 'Memory', icon: Star, color: '#7C83FD', desc: 'Kenangan spesial' },
  { value: 'character', label: 'Character', icon: Heart, color: '#C074DF', desc: 'Profil seseorang' },
  { value: 'dialogue', label: 'Dialogue', icon: MessageCircle, color: '#38D9A9', desc: 'Percakapan/kutipan' },
  { value: 'moment', label: 'Moment', icon: Lightbulb, color: '#FF922B', desc: 'Momen penting' },
  { value: 'feeling', label: 'Feeling', icon: Heart, color: '#F03E3E', desc: 'Perasaan/emosi' },
  { value: 'timeline_event', label: 'Event', icon: Calendar, color: '#4DABF7', desc: 'Kejadian bertanggal' },
  { value: 'media', label: 'Media', icon: Image, color: '#CC5DE8', desc: 'Foto/video/audio' },
  { value: 'quote', label: 'Quote', icon: Quote, color: '#FCC419', desc: 'Kutipan bermakna' },
  { value: 'reflection', label: 'Reflection', icon: PenTool, color: '#3BC9DB', desc: 'Pemikiran pribadi' },
];

const EMOTIONS = [
  { value: 'happy', label: 'Happy', color: '#FF922B' },
  { value: 'sad', label: 'Sad', color: '#7C83FD' },
  { value: 'excited', label: 'Excited', color: '#FF6B8B' },
  { value: 'peaceful', label: 'Peaceful', color: '#38D9A9' },
  { value: 'romantic', label: 'Romantic', color: '#C074DF' },
  { value: 'melancholic', label: 'Melancholic', color: '#4DABF7' },
  { value: 'nostalgic', label: 'Nostalgic', color: '#CC5DE8' },
  { value: 'hopeful', label: 'Hopeful', color: '#3BC9DB' },
];

interface NodeTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (nodeType: string, title: string, emotion: string, metadata: any) => void;
}

export default function NodeTypeSelector({ isOpen, onClose, onSelect }: NodeTypeSelectorProps) {
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState('scene');
  const [title, setTitle] = useState('');
  const [emotion, setEmotion] = useState('');
  const [metadata, setMetadata] = useState<any>({});

  if (!isOpen) return null;

  const handleCreate = () => {
    onSelect(selectedType, title || 'Untitled', emotion, metadata);
    setStep(0);
    setTitle('');
    setEmotion('');
    setMetadata({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[480px] max-w-[90vw] bg-white dark:bg-[#2a2438] rounded-2xl border border-[#FFB4A2]/20 dark:border-[#FF8FA3]/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10">
          <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">
            {step === 0 ? 'Pilih Tipe Node' : 'Detail Node'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFB4A2]/10 transition-colors">
            <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
          </button>
        </div>

        <div className="p-5">
          {/* Step 0: Select Type */}
          {step === 0 && (
            <div className="grid grid-cols-2 gap-2">
              {NODE_TYPES.map(type => {
                const Icon = type.icon;
                return (
                  <button key={type.value}
                    onClick={() => { setSelectedType(type.value); setStep(1); }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[#FFB4A2]/15 hover:border-[#FF8FA3]/30 hover:bg-[#FF8FA3]/5 transition-all text-left">
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${type.color}20` }}>
                      <Icon className="w-4 h-4" style={{ color: type.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">{type.label}</p>
                      <p className="text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">{type.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 1: Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-1.5">Judul</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder={`Judul ${NODE_TYPES.find(t => t.value === selectedType)?.label}...`}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#FFB4A2]/20 bg-white/50 dark:bg-[#1a1625]/50 text-sm text-[#4A2F3C] dark:text-[#e2d9f3] placeholder:text-[#5A3E4C]/30 focus:outline-none focus:border-[#FF8FA3]/50" />
              </div>

              {/* Scene-specific fields */}
              {selectedType === 'scene' && (
                <>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-1.5">Lokasi</label>
                    <input type="text" value={metadata.sceneLocation || ''} onChange={e => setMetadata({ ...metadata, sceneLocation: e.target.value })}
                      placeholder="Dimana kejadian ini berlangsung..."
                      className="w-full px-3 py-2.5 rounded-xl border border-[#FFB4A2]/20 bg-white/50 dark:bg-[#1a1625]/50 text-sm text-[#4A2F3C] dark:text-[#e2d9f3] placeholder:text-[#5A3E4C]/30 focus:outline-none focus:border-[#FF8FA3]/50" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-1.5">Waktu</label>
                    <input type="text" value={metadata.sceneTime || ''} onChange={e => setMetadata({ ...metadata, sceneTime: e.target.value })}
                      placeholder="Kapan kejadian ini..."
                      className="w-full px-3 py-2.5 rounded-xl border border-[#FFB4A2]/20 bg-white/50 dark:bg-[#1a1625]/50 text-sm text-[#4A2F3C] dark:text-[#e2d9f3] placeholder:text-[#5A3E4C]/30 focus:outline-none focus:border-[#FF8FA3]/50" />
                  </div>
                </>
              )}

              {/* Character-specific fields */}
              {selectedType === 'character' && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-1.5">Nama Karakter</label>
                  <input type="text" value={metadata.characterName || ''} onChange={e => setMetadata({ ...metadata, characterName: e.target.value })}
                    placeholder="Nama orang ini..."
                    className="w-full px-3 py-2.5 rounded-xl border border-[#FFB4A2]/20 bg-white/50 dark:bg-[#1a1625]/50 text-sm text-[#4A2F3C] dark:text-[#e2d9f3] placeholder:text-[#5A3E4C]/30 focus:outline-none focus:border-[#FF8FA3]/50" />
                </div>
              )}

              {/* Emotion selector */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-2">Emosi</label>
                <div className="flex flex-wrap gap-1.5">
                  {EMOTIONS.map(em => (
                    <button key={em.value} onClick={() => setEmotion(emotion === em.value ? '' : em.value)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${emotion === em.value ? 'ring-1 ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                      style={{ backgroundColor: `${em.color}25`, color: em.color }}>
                      {em.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10">
            <button onClick={() => setStep(0)} className="px-4 py-2 text-sm text-[#5A3E4C]/60 hover:text-[#5A3E4C] transition-colors">
              Kembali
            </button>
            <button onClick={handleCreate}
              className="px-5 py-2 rounded-xl bg-[#FF8FA3] hover:bg-[#FF8FA3]/90 text-white text-sm font-medium transition-all">
              Buat Node
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
