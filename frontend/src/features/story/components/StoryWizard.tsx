'use client';

import { Heart, User, Compass, Star, Sparkles, BookOpen, Lock, Globe, Users, Layers } from 'lucide-react';
import { getTemplateFor } from '@/features/story/templates';

export interface StoryWizardFormData {
  title: string;
  subtitle: string;
  description: string;
  storyType: string;
  privacyLevel: string;
  theme: string;
}

export const STORY_TYPES = [
  { value: 'love_story', label: 'Love Story', icon: Heart, color: '#E63946', desc: 'Cerita tentang perasaan & hubungan' },
  { value: 'biography', label: 'Biography', icon: User, color: '#B5EAD7', desc: 'Kisah hidup seseorang' },
  { value: 'memory_collection', label: 'Memories', icon: Star, color: '#C7CEEA', desc: 'Koleksi momen & kenangan' },
  { value: 'adventure', label: 'Adventure', icon: Compass, color: '#FFD6A5', desc: 'Petualangan bersama' },
  { value: 'character_study', label: 'Character', icon: Sparkles, color: '#E0BBE4', desc: 'Mengenal seseorang lebih dalam' },
  { value: 'custom', label: 'Custom', icon: BookOpen, color: '#FFB8C0', desc: 'Cerita bebas sesuka hati' },
];

export const PRIVACY_OPTIONS = [
  { value: 'private', label: 'Private', icon: Lock, desc: 'Hanya Anda yang bisa melihat' },
  { value: 'friends_only', label: 'Friends Only', icon: Users, desc: 'Hanya teman yang diundang' },
  { value: 'public', label: 'Public', icon: Globe, desc: 'Siapa saja bisa melihat' },
];

interface Props {
  formData: StoryWizardFormData;
  setFormData: (data: StoryWizardFormData) => void;
  wizardStep: number;
  setWizardStep: (step: number) => void;
  onClose: () => void;
  onCreate: () => void;
}

export default function StoryWizard({
  formData,
  setFormData,
  wizardStep,
  setWizardStep,
  onClose,
  onCreate,
}: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[520px] max-w-[90vw] bg-white dark:bg-[#2a2438] rounded-2xl border border-[#FFB8C0]/20 dark:border-[#E63946]/10 shadow-2xl overflow-hidden">
        {/* Progress */}
        <div className="flex gap-1 px-6 pt-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all ${
                i <= wizardStep ? 'bg-[#E63946]' : 'bg-[#FFB8C0]/15'
              }`}
            />
          ))}
        </div>

        <div className="p-6">
          {wizardStep === 0 && (
            <div>
              <h2 className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3] mb-1">Pilih Jenis Cerita</h2>
              <p className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mb-5">
                Tentukan jenis cerita yang ingin Anda buat
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {STORY_TYPES.map((type) => {
                  const Icon = type.icon;
                  const selected = formData.storyType === type.value;
                  const template = getTemplateFor(type.value);
                  return (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, storyType: type.value })}
                      aria-pressed={selected}
                      className={`relative p-3.5 rounded-xl border text-left transition-all ${
                        selected
                          ? 'border-[#E63946] bg-[#E63946]/5 shadow-sm'
                          : 'border-[#FFB8C0]/15 hover:border-[#E63946]/30'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-2" style={{ color: type.color }} />
                      <p className="text-xs font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">{type.label}</p>
                      <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 mt-0.5">{type.desc}</p>
                      {template && (
                        <span
                          className="absolute top-2 right-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#E63946]/10 text-[#E63946] text-[9px] font-semibold tabular-nums"
                          title={`Auto-generate ${template.nodes.length} starter scenes`}
                        >
                          <Layers className="w-2.5 h-2.5" />
                          +{template.nodes.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {formData.storyType && (() => {
                const tmpl = getTemplateFor(formData.storyType);
                return tmpl ? (
                  <div className="mt-3 px-3 py-2 rounded-lg bg-[#FFB8C0]/8 border border-[#FFB8C0]/20 flex items-start gap-2">
                    <Layers className="w-3.5 h-3.5 text-[#E63946] mt-0.5 shrink-0" />
                    <p className="text-[11px] text-[#5A3E4C]/70 dark:text-[#e2d9f3]/60 leading-relaxed">
                      <span className="font-medium">Template:</span> {tmpl.description}.
                      Cerita akan dibuat dengan {tmpl.nodes.length} scene awal yang sudah terhubung.
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 px-3 py-2 rounded-lg bg-[#5A3E4C]/5 border border-[#5A3E4C]/10 flex items-start gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#5A3E4C]/40 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-[#5A3E4C]/60 dark:text-[#e2d9f3]/50 leading-relaxed">
                      Mulai dari kanvas kosong. Tambahkan scene sesuai keinginanmu.
                    </p>
                  </div>
                );
              })()}
            </div>
          )}

          {wizardStep === 1 && (
            <div>
              <h2 className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3] mb-1">Detail Cerita</h2>
              <p className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mb-5">
                Beri nama dan deskripsi untuk cerita Anda
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-1.5">
                    Judul *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Judul cerita Anda..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#FFB8C0]/20 bg-white/50 dark:bg-[#1a1625]/50 text-sm text-[#4A2F3C] dark:text-[#e2d9f3] placeholder:text-[#5A3E4C]/30 focus:outline-none focus:border-[#E63946]/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-1.5">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Subtitle opsional..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#FFB8C0]/20 bg-white/50 dark:bg-[#1a1625]/50 text-sm text-[#4A2F3C] dark:text-[#e2d9f3] placeholder:text-[#5A3E4C]/30 focus:outline-none focus:border-[#E63946]/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-1.5">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ceritakan sedikit tentang story ini..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#FFB8C0]/20 bg-white/50 dark:bg-[#1a1625]/50 text-sm text-[#4A2F3C] dark:text-[#e2d9f3] placeholder:text-[#5A3E4C]/30 focus:outline-none focus:border-[#E63946]/50 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div>
              <h2 className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3] mb-1">Privasi</h2>
              <p className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mb-5">
                Siapa yang bisa melihat cerita ini?
              </p>
              <div className="space-y-2.5">
                {PRIVACY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = formData.privacyLevel === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setFormData({ ...formData, privacyLevel: opt.value })}
                      aria-pressed={selected}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                        selected
                          ? 'border-[#E63946] bg-[#E63946]/5'
                          : 'border-[#FFB8C0]/15 hover:border-[#E63946]/30'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${selected ? 'text-[#E63946]' : 'text-[#5A3E4C]/40'}`} />
                      <div>
                        <p className="text-sm font-medium text-[#4A2F3C] dark:text-[#e2d9f3]">{opt.label}</p>
                        <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#FFB8C0]/10 dark:border-[#E63946]/10">
          <button
            onClick={wizardStep === 0 ? onClose : () => setWizardStep(wizardStep - 1)}
            className="px-4 py-2 text-sm text-[#5A3E4C]/60 dark:text-[#e2d9f3]/50 hover:text-[#5A3E4C] transition-colors"
          >
            {wizardStep === 0 ? 'Batal' : 'Kembali'}
          </button>
          <button
            onClick={wizardStep === 2 ? onCreate : () => setWizardStep(wizardStep + 1)}
            disabled={wizardStep === 1 && !formData.title.trim()}
            className="px-5 py-2 rounded-xl bg-candy-primary text-white text-sm font-medium transition-all shadow-candy hover:shadow-candy-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {wizardStep === 2 ? 'Buat Story' : 'Lanjut'}
          </button>
        </div>
      </div>
    </div>
  );
}
