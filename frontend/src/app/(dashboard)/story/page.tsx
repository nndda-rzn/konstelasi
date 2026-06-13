"use client";

import { useQuery } from "@apollo/client/react";
import {
  BookOpen,
  Globe,
  Lock,
  Plus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { Providers } from "@/lib/Providers";
import { StoryProvider, useStory } from "@/context/StoryContext";
import { GET_ON_THIS_DAY_MEMORIES } from "@/graphql/story";
import StoryWizard from "@/features/story/components/StoryWizard";
import StoryEmptyState from "@/features/story/components/StoryEmptyState";
import StorySkeleton from "@/features/story/components/StorySkeleton";
import { useStoryCreation } from "@/features/story/hooks/useStoryCreation";
import { DashboardHeader } from "@/features/story/components/storyList/DashboardHeader";
import { OnThisDaySection } from "@/features/story/components/storyList/OnThisDaySection";
import { StoryGrid } from "@/features/story/components/storyList/StoryGrid";

function StoryDashboard() {
  const router = useRouter();
  const { stories, loading } = useStory();
  const {
    formData,
    setFormData,
    showWizard,
    setShowWizard,
    wizardStep,
    setWizardStep,
    handleCreate,
  } = useStoryCreation();

  const { data: onThisDayData, loading: onThisDayLoading } = useQuery<any>(
    GET_ON_THIS_DAY_MEMORIES,
    { fetchPolicy: "cache-and-network" }
  );
  const onThisDayMemories = onThisDayData?.getOnThisDayMemories || [];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">
      <div className="max-w-5xl mx-auto">
        <DashboardHeader
          showCreate={!loading && stories.length > 0}
          onCreate={() => setShowWizard(true)}
        />

        <OnThisDaySection
          loading={onThisDayLoading}
          memories={onThisDayMemories}
          onNavigate={(storyId) => router.push(`/story/${storyId}`)}
        />

        {loading ? (
          <StorySkeleton />
        ) : stories.length === 0 ? (
          <StoryEmptyState onCreate={() => setShowWizard(true)} />
        ) : (
          <StoryGrid
            stories={stories}
            onNavigate={(storyId) => router.push(`/story/${storyId}`)}
          />
        )}
      </div>

      {showWizard && (
        <StoryWizard
          formData={formData}
          setFormData={setFormData}
          wizardStep={wizardStep}
          setWizardStep={setWizardStep}
          onClose={() => {
            setShowWizard(false);
            setWizardStep(0);
          }}
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
