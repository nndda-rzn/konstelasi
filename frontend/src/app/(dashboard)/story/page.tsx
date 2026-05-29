'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import { Plus, BookOpen, Lock, Globe, Users, Calendar, Hourglass, Sparkles } from 'lucide-react';
import { ApolloWrapper } from '@/lib/apollo/ApolloWrapper';
import { Providers } from '@/lib/Providers';
import { StoryProvider, useStory } from '@/context/StoryContext';
import { GET_ON_THIS_DAY_MEMORIES, ADD_NODE_TO_STORY } from '@/graphql/story';
import { CREATE_NOTE, CREATE_NOTE_LINK } from '@/graphql/mutations';
import StoryWizard, { STORY_TYPES, type StoryWizardFormData } from '@/features/story/components/StoryWizard';
import StoryEmptyState from '@/features/story/components/StoryEmptyState';
import StorySkeleton from '@/features/story/components/StorySkeleton';
import { getTemplateFor } from '@/features/story/templates';

function stripHtml(value?: string | null) {
  return value?.replace(/<[^>]+>/g, '').trim() || '';
}

function formatMemoryDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
}

function StoryDashboard() {
  const router = useRouter();
  const { stories, loading, createStory } = useStory();
  const [createNote] = useMutation<any>(CREATE_NOTE);
  const [createNoteLink] = useMutation<any>(CREATE_NOTE_LINK);
  const [addNodeToStory] = useMutation<any>(ADD_NODE_TO_STORY);
  const { data: onThisDayData, loading: onThisDayLoading } = useQuery<any>(GET_ON_THIS_DAY_MEMORIES, {
    fetchPolicy: 'cache-and-network',
  });
  const onThisDayMemories = onThisDayData?.getOnThisDayMemories || [];
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
      privacyLevel: formData.privacyLevel.toUpperCase(),
      theme: formData.theme,
    });
    if (!story) return;

    // Apply template (if available) by creating starter nodes & links.
    // Failures here are non-fatal: user still gets an empty story.
    const template = getTemplateFor(formData.storyType);
    if (template) {
      try {
        const created: { templateIdx: number; noteId: string }[] = [];
        // Use a base position offset so nodes appear near the canvas origin.
        const BASE_X = 400;
        const BASE_Y = 200;

        for (let i = 0; i < template.nodes.length; i++) {
          const tNode = template.nodes[i];
          const noteRes = await createNote({
            variables: {
              input: {
                title: tNode.title,
                positionX: BASE_X + tNode.position.x,
                positionY: BASE_Y + tNode.position.y,
                mood: tNode.mood,
              },
            },
          });
          const noteId = (noteRes.data as any)?.createNote?.id;
          if (!noteId) continue;
          await addNodeToStory({
            variables: {
              storyId: story.id,
              noteId,
              nodeType: tNode.nodeType,
            },
          });
          created.push({ templateIdx: i, noteId });
        }

        // Wire up sequential connections based on `connectFromPrevious`.
        for (let i = 1; i < created.length; i++) {
          const tNode = template.nodes[created[i].templateIdx];
          if (!tNode.connectFromPrevious) continue;
          const prev = created[i - 1];
          const curr = created[i];
          await createNoteLink({
            variables: {
              input: {
                sourceId: prev.noteId,
                targetId: curr.noteId,
                sourceHandle: 'right',
                targetHandle: 'left',
              },
            },
          });
        }
      } catch (err) {
        console.error('Failed to apply template:', err);
      }
    }

    router.push(`/story/${story.id}`);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">Stories</h1>
              <p className="text-sm text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mt-1">Ceritakan kisah Anda melalui connected bubbles</p>
            </div>
          </div>
          {/* Hide header CTA when list is empty - StoryEmptyState already has its own CTA. */}
          {!loading && stories.length > 0 && (
            <button
              onClick={() => setShowWizard(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-candy-primary text-white font-medium text-sm transition-all shadow-candy hover:shadow-candy-lg hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              Buat Story Baru
            </button>
          )}
        </div>

        {/* On This Day */}
        <section className="mb-8 rounded-3xl border border-[#FFB8C0]/20 dark:border-[#E63946]/10 bg-gradient-to-br from-white/90 via-[#FFE5E8]/45 to-white/70 dark:from-[#2a2438]/90 dark:via-[#E63946]/10 dark:to-[#1a1625]/80 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-candy-primary text-white flex items-center justify-center shadow-candy">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">Hari Ini Dalam Cerita</h2>
                <p className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mt-0.5">Memory story yang terjadi pada tanggal ini di tahun lalu.</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-white/70 dark:bg-[#1a1625]/60 text-[10px] font-medium text-[#E63946] border border-[#FFB8C0]/20">
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
            </span>
          </div>

          {onThisDayLoading ? (
            <div className="flex items-center gap-2 text-xs text-[#5A3E4C]/45 dark:text-[#e2d9f3]/35">
              <div className="w-4 h-4 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" />
              Mencari kenangan hari ini...
            </div>
          ) : onThisDayMemories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {onThisDayMemories.map((memory: any) => {
                const preview = stripHtml(memory.content).slice(0, 120);
                return (
                  <button
                    key={memory.nodeId}
                    onClick={() => router.push(`/story/${memory.storyId}`)}
                    className="text-left p-4 rounded-2xl bg-white/75 dark:bg-[#1a1625]/55 border border-[#FFB8C0]/15 dark:border-[#E63946]/10 hover:border-[#E63946]/30 hover:shadow-lg hover:shadow-[#E63946]/5 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-[10px] font-semibold text-[#E63946] uppercase tracking-wider">
                        {memory.yearsAgo} tahun lalu
                      </span>
                      <span className="text-[9px] text-[#5A3E4C]/35 dark:text-[#e2d9f3]/25">
                        {formatMemoryDate(memory.eventDate)}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3] mb-1 truncate">{memory.title}</h3>
                    <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 mb-2 truncate">{memory.storyTitle}</p>
                    {memory.isTimeLocked ? (
                      <div className="flex items-center gap-2 text-[10px] text-[#E63946]/70">
                        <Hourglass className="w-3 h-3" />
                        Time Capsule masih tersegel
                      </div>
                    ) : preview ? (
                      <p className="text-xs leading-relaxed text-[#5A3E4C]/60 dark:text-[#e2d9f3]/45 line-clamp-2">{preview}</p>
                    ) : (
                      <p className="text-xs italic text-[#5A3E4C]/35 dark:text-[#e2d9f3]/25">Belum ada cuplikan konten.</p>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#FFB8C0]/25 dark:border-[#E63946]/15 bg-white/45 dark:bg-[#1a1625]/35 px-4 py-5 text-center">
              <Sparkles className="w-7 h-7 text-[#FFB8C0]/60 mx-auto mb-2" />
              <p className="text-sm font-medium text-[#4A2F3C]/60 dark:text-[#e2d9f3]/50">Belum ada memory lama untuk hari ini</p>
              <p className="text-[10px] text-[#5A3E4C]/35 dark:text-[#e2d9f3]/25 mt-1">Tambahkan event date pada node story agar muncul di sini tahun depan.</p>
            </div>
          )}
        </section>

        {/* Story Grid */}
        {loading ? (
          <StorySkeleton />
        ) : stories.length === 0 ? (
          <StoryEmptyState onCreate={() => setShowWizard(true)} />
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
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${story.status?.toLowerCase() === 'draft' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {story.status?.toLowerCase()}
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
