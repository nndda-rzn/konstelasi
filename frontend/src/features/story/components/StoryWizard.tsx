"use client";

import { BookOpen, Heart, Layers, Lock, Sparkles, Star, User, Users, Globe, Compass } from "lucide-react";
import { getTemplateFor } from "@/features/story/templates";
import {
  WizardProgressBar,
  WizardStepHeader,
  TemplateBanner,
} from "./wizard/WizardHelpers";
import { StoryTypeGrid } from "./wizard/StoryTypeGrid";
import { PrivacyGrid } from "./wizard/PrivacyGrid";
import { DetailFields } from "./wizard/DetailFields";
import { WizardFooter } from "./wizard/WizardFooter";
import type {
  StoryWizardFormData,
  StoryTypeOption,
  PrivacyOption,
} from "./wizard/wizardTypes";

export type { StoryWizardFormData } from "./wizard/wizardTypes";

export const STORY_TYPES: StoryTypeOption[] = [
  { value: "love_story", label: "Love Story", icon: Heart, color: "#E63946", desc: "Cerita tentang perasaan & hubungan" },
  { value: "biography", label: "Biography", icon: User, color: "#B5EAD7", desc: "Kisah hidup seseorang" },
  { value: "memory_collection", label: "Memories", icon: Star, color: "#C7CEEA", desc: "Koleksi momen & kenangan" },
  { value: "adventure", label: "Adventure", icon: Compass, color: "#FFD6A5", desc: "Petualangan bersama" },
  { value: "character_study", label: "Character", icon: Sparkles, color: "#E0BBE4", desc: "Mengenal seseorang lebih dalam" },
  { value: "custom", label: "Custom", icon: BookOpen, color: "#FFB8C0", desc: "Cerita bebas sesuka hati" },
];

export const PRIVACY_OPTIONS: PrivacyOption[] = [
  { value: "private", label: "Private", icon: Lock, desc: "Hanya Anda yang bisa melihat" },
  { value: "friends_only", label: "Friends Only", icon: Users, desc: "Hanya teman yang diundang" },
  { value: "public", label: "Public", icon: Globe, desc: "Siapa saja bisa melihat" },
];

interface Props {
  formData: StoryWizardFormData;
  setFormData: (data: StoryWizardFormData) => void;
  wizardStep: number;
  setWizardStep: (step: number) => void;
  onClose: () => void;
  onCreate: () => void;
}

const TOTAL_STEPS = 3;

export default function StoryWizard({
  formData,
  setFormData,
  wizardStep,
  setWizardStep,
  onClose,
  onCreate,
}: Props) {
  const canProceed =
    wizardStep !== 1 || formData.title.trim().length > 0;

  const handleBack = () => {
    if (wizardStep === 0) onClose();
    else setWizardStep(wizardStep - 1);
  };

  const handleNext = () => {
    if (wizardStep === TOTAL_STEPS - 1) onCreate();
    else setWizardStep(wizardStep + 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[520px] max-w-[90vw] bg-white dark:bg-[#2a2438] rounded-2xl border border-[#FFB8C0]/20 dark:border-[#E63946]/10 shadow-2xl overflow-hidden">
        <WizardProgressBar
          currentStep={wizardStep}
          totalSteps={TOTAL_STEPS}
        />

        <div className="p-6">
          {wizardStep === 0 && (
            <Step1Type
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {wizardStep === 1 && (
            <Step2Details
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {wizardStep === 2 && (
            <Step3Privacy
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </div>

        <WizardFooter
          currentStep={wizardStep}
          totalSteps={TOTAL_STEPS}
          canProceed={canProceed}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}

function Step1Type({
  formData,
  setFormData,
}: {
  formData: StoryWizardFormData;
  setFormData: (data: StoryWizardFormData) => void;
}) {
  return (
    <div>
      <WizardStepHeader
        title="Pilih Jenis Cerita"
        description="Tentukan jenis cerita yang ingin Anda buat"
      />
      <StoryTypeGrid
        types={STORY_TYPES}
        selected={formData.storyType}
        onSelect={(v) => setFormData({ ...formData, storyType: v })}
      />
      <TemplateBanner storyType={formData.storyType} />
    </div>
  );
}

function Step2Details({
  formData,
  setFormData,
}: {
  formData: StoryWizardFormData;
  setFormData: (data: StoryWizardFormData) => void;
}) {
  return (
    <div>
      <WizardStepHeader
        title="Detail Cerita"
        description="Beri nama dan deskripsi untuk cerita Anda"
      />
      <DetailFields formData={formData} setFormData={setFormData} />
    </div>
  );
}

function Step3Privacy({
  formData,
  setFormData,
}: {
  formData: StoryWizardFormData;
  setFormData: (data: StoryWizardFormData) => void;
}) {
  return (
    <div>
      <WizardStepHeader
        title="Privasi"
        description="Siapa yang bisa melihat cerita ini?"
      />
      <PrivacyGrid
        options={PRIVACY_OPTIONS}
        selected={formData.privacyLevel}
        onSelect={(v) => setFormData({ ...formData, privacyLevel: v })}
      />
    </div>
  );
}
