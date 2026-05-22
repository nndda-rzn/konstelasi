'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, BookOpen, Heart, User, Compass, Star, Sparkles, Lock, Globe, Users, ArrowLeft } from 'lucide-react';
import { ApolloWrapper } from '@/lib/apollo/ApolloWrapper';
import { Providers } from '@/lib/Providers';
import { StoryProvider, useStory } from '@/context/StoryContext';

const STORY_TYPES = [
  { value: 'love_story', label: 'Love Story', icon: Heart, color: '#E63946', desc: 'Cerita tentang perasaan & hubungan' },
  { value: 'biography', label: 'Biography', icon: User, color: '#B5EAD7', desc: 'Kisah hidup seseorang' },
  { value: 'memory_collection', label: 'Memories', icon: Star, color: '#C7CEEA', desc: 'Koleksi momen & kenangan' },
  { value: 'adventure', label: 'Adventure', icon: Compass, color: '#FFD6A5', desc: 'Petualangan bersama' },
  { value: 'character_study', label: 'Character', icon: Sparkles, color: '#E0BBE4', desc: 'Mengenal seseorang lebih dalam' },
  { value: 'custom', label: 'Custom', icon: BookOpen, color: '#FFB8C0', desc: 'Cerita bebas sesuka hati' },
];

const PRIVACY_OPTIONS = [
  { value: 'private', label: 'Private', icon: Lock, desc: 'Hanya Anda yang bisa melihat' },
  { value: 'friends_only', label: 'Friends Only', icon: Users, desc: 'Hanya teman yang diundang' },
  { value: 'public', label: 'Public', icon: Globe, desc: 'Siapa saja bisa melihat' },
];

function StoryDashboard() {
  const router = useRouter();
  const { stories, loading, createStory } = useStory();
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    storyType: 'custom',
    privacyLevel: 'private',
    theme: 'romantic',
  });

  const handleCreate = async () => {
    if (!formData.title.trim()) return;
    const story = await createStory({
      title: formData.title,
      subtitle: formData.subtitle || undefined,
      description: formData.description || undefined,
      storyType: formData.storyType.toUpperCase(),
    });
    if (story) {
      router.push(`/story/${story.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/canvas')} className="p-2 rounded-lg hover:bg-[#FFB8C0]/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">Stories</h1>
              <p className="text-sm text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mt-1">Ceritakan kisah Anda melalui connected bubbles</p>
            </div>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E63946] hover:bg-[#E63946]/90 text-white font-medium text-sm transition-all shadow-lg shadow-[#E63946]/20"
          >
            <Plus className="w-4 h-4" />
            Buat Story Baru
          </button>
        </div>

        {/* Story Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-[#FFB8C0]/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#4A2F3C]/60 dark:text-[#e2d9f3]/50 mb-2">Belum ada story</h3>
            <p className="text-sm text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 mb-6">Mulai ceritakan kisah pertama Anda</p>
            <button
              onClick={() => setShowWizard(true)}
              className="px-5 py-2.5 rounded-xl bg-[#E63946]/10 hover:bg-[#E63946]/20 text-[#E63946] font-medium text-sm transition-all"
            >
              Buat Story Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stories.map((story: any) => {
              const typeInfo = STORY_TYPES.find(t => t.value === story.storyType?.toLowerCase()) || STORY_TYPES[5];
              const TypeIcon = typeInfo.icon;
              return (
                <button
                  key={story.id}
                  onClick={() => router.push(`/story/${story.id}`)}
                  className="text-left p-5 rounded-2xl border border-[#FFB8C0]/15 dark:border-[#E63946]/10 bg-white/80 dark:bg-[#2a2438]/80 hover:shadow-lg hover:shadow-[#E63946]/5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${typeInfo.color}20` }}>
                      <TypeIcon className="w-4 h-4" style={{ color: typeInfo.color }} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {story.privacyLevel === 'private' && <Lock className="w-3 h-3 text-[#5A3E4C]/30" />}
                      {story.privacyLevel === 'friends_only' && <Users className="w-3 h-3 text-[#5A3E4C]/30" />}
                      {story.privacyLevel === 'public' && <Globe className="w-3 h-3 text-[#5A3E4C]/30" />}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${story.status === 'draft' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {story.status}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3] mb-1 group-hover:text-[#E63946] transition-colors">
                    {story.title}
                  </h3>
                  {story.subtitle && (
                    <p className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mb-2">{story.subtitle}</p>
                  )}
                  <p className="text-[10px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20">
                    {new Date(story.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Creation Wizard Modal */}
      {showWizard && (
        <StoryWizard
          formData={formData}
          setFormData={setFormData}
          wizardStep={wizardStep}
          setWizardStep={setWizardStep}
          onClose={() => { setShowWizard(false); setWizardStep(0); }}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

function StoryWizard({ formData, setFormData, wizardStep, setWizardStep, onClose, onCreate }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[520px] max-w-[90vw] bg-white dark:bg-[#2a2438] rounded-2xl border border-[#FFB8C0]/20 dark:border-[#E63946]/10 shadow-2xl overflow-hidden">
        {/* Progress */}
        <div className="flex gap-1 px-6 pt-5">
          {[0, 1, 2].map(i => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= wizardStep ? 'bg-[#E63946]' : 'bg-[#FFB8C0]/15'}`} />
          ))}
        </div>

        <div className="p-6">
          {/* Step 0: Story Type */}
          {wizardStep === 0 && (
            <div>
              <h2 className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3] mb-1">Pilih Jenis Cerita</h2>
              <p className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mb-5">Tentukan jenis cerita yang ingin Anda buat</p>
              <div className="grid grid-cols-2 gap-2.5">
                {STORY_TYPES.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, storyType: type.value })}
                      className={`p-3.5 rounded-xl border text-left transition-all ${formData.storyType === type.value ? 'border-[#E63946] bg-[#E63946]/5 shadow-sm' : 'border-[#FFB8C0]/15 hover:border-[#E63946]/30'}`}
                    >
                      <Icon className="w-5 h-5 mb-2" style={{ color: type.color }} />
                      <p className="text-xs font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">{type.label}</p>
                      <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 mt-0.5">{type.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 1: Title & Description */}
          {wizardStep === 1 && (
            <div>
              <h2 className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3] mb-1">Detail Cerita</h2>
              <p className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mb-5">Beri nama dan deskripsi untuk cerita Anda</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-1.5">Judul *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Judul cerita Anda..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#FFB8C0]/20 bg-white/50 dark:bg-[#1a1625]/50 text-sm text-[#4A2F3C] dark:text-[#e2d9f3] placeholder:text-[#5A3E4C]/30 focus:outline-none focus:border-[#E63946]/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-1.5">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Subtitle opsional..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#FFB8C0]/20 bg-white/50 dark:bg-[#1a1625]/50 text-sm text-[#4A2F3C] dark:text-[#e2d9f3] placeholder:text-[#5A3E4C]/30 focus:outline-none focus:border-[#E63946]/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-1.5">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ceritakan sedikit tentang story ini..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#FFB8C0]/20 bg-white/50 dark:bg-[#1a1625]/50 text-sm text-[#4A2F3C] dark:text-[#e2d9f3] placeholder:text-[#5A3E4C]/30 focus:outline-none focus:border-[#E63946]/50 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Privacy */}
          {wizardStep === 2 && (
            <div>
              <h2 className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3] mb-1">Privasi</h2>
              <p className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mb-5">Siapa yang bisa melihat cerita ini?</p>
              <div className="space-y-2.5">
                {PRIVACY_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setFormData({ ...formData, privacyLevel: opt.value })}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${formData.privacyLevel === opt.value ? 'border-[#E63946] bg-[#E63946]/5' : 'border-[#FFB8C0]/15 hover:border-[#E63946]/30'}`}
                    >
                      <Icon className={`w-5 h-5 ${formData.privacyLevel === opt.value ? 'text-[#E63946]' : 'text-[#5A3E4C]/40'}`} />
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
            className="px-5 py-2 rounded-xl bg-[#E63946] hover:bg-[#E63946]/90 text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {wizardStep === 2 ? 'Buat Story' : 'Lanjut'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StoryPage() {
  return (
    <ApolloWrapper>
      <Providers>
        <StoryProvider>
          <StoryDashboard />
        </StoryProvider>
      </Providers>
    </ApolloWrapper>
  );
}
