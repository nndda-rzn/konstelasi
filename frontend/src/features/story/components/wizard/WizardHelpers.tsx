"use client";

import { BookOpen, Layers } from "lucide-react";
import { getTemplateFor } from "@/features/story/templates";

interface WizardProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgressBar({
  currentStep,
  totalSteps,
}: WizardProgressBarProps) {
  return (
    <div className="flex gap-1 px-6 pt-5">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-1 rounded-full transition-all ${
            i <= currentStep ? "bg-[#E63946]" : "bg-[#FFB8C0]/15"
          }`}
        />
      ))}
    </div>
  );
}

interface WizardStepHeaderProps {
  title: string;
  description: string;
}

export function WizardStepHeader({
  title,
  description,
}: WizardStepHeaderProps) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3] mb-1">
        {title}
      </h2>
      <p className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">
        {description}
      </p>
    </div>
  );
}

interface TemplateBannerProps {
  storyType: string;
}

export function TemplateBanner({ storyType }: TemplateBannerProps) {
  if (!storyType) return null;
  const tmpl = getTemplateFor(storyType);
  if (!tmpl) {
    return (
      <div className="mt-3 px-3 py-2 rounded-lg bg-[#5A3E4C]/5 border border-[#5A3E4C]/10 flex items-start gap-2">
        <BookOpen className="w-3.5 h-3.5 text-[#5A3E4C]/40 mt-0.5 shrink-0" />
        <p className="text-[11px] text-[#5A3E4C]/60 dark:text-[#e2d9f3]/50 leading-relaxed">
          Mulai dari kanvas kosong. Tambahkan scene sesuai keinginanmu.
        </p>
      </div>
    );
  }
  return (
    <div className="mt-3 px-3 py-2 rounded-lg bg-[#FFB8C0]/8 border border-[#FFB8C0]/20 flex items-start gap-2">
      <Layers className="w-3.5 h-3.5 text-[#E63946] mt-0.5 shrink-0" />
      <p className="text-[11px] text-[#5A3E4C]/70 dark:text-[#e2d9f3]/60 leading-relaxed">
        <span className="font-medium">Template:</span> {tmpl.description}.
        Cerita akan dibuat dengan {tmpl.nodes.length} scene awal yang sudah
        terhubung.
      </p>
    </div>
  );
}
