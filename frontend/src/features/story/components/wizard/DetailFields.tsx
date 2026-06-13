"use client";

import { StoryWizardFormData } from "./wizardTypes";

interface DetailFieldsProps {
  formData: StoryWizardFormData;
  setFormData: (data: StoryWizardFormData) => void;
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-[#FFB8C0]/20 bg-white/50 dark:bg-[#1a1625]/50 text-sm text-[#4A2F3C] dark:text-[#e2d9f3] placeholder:text-[#5A3E4C]/30 focus:outline-none focus:border-[#E63946]/50";

const labelClass =
  "block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-1.5";

export function DetailFields({ formData, setFormData }: DetailFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Judul *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Judul cerita Anda..."
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Subtitle</label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          placeholder="Subtitle opsional..."
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Deskripsi</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Ceritakan sedikit tentang story ini..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>
    </div>
  );
}
