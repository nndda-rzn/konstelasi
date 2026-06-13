"use client";

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
}

/**
 * WizardFooter - Back/Next button row.
 */
export function WizardFooter({
  currentStep,
  totalSteps,
  canProceed,
  onBack,
  onNext,
  nextLabel,
  backLabel,
}: WizardFooterProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const computedBackLabel = backLabel ?? (isFirst ? "Batal" : "Kembali");
  const computedNextLabel = nextLabel ?? (isLast ? "Buat Story" : "Lanjut");

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-[#FFB8C0]/10 dark:border-[#E63946]/10">
      <button
        onClick={onBack}
        className="px-4 py-2 text-sm text-[#5A3E4C]/60 dark:text-[#e2d9f3]/50 hover:text-[#5A3E4C] transition-colors"
      >
        {computedBackLabel}
      </button>
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="px-5 py-2 rounded-xl bg-candy-primary text-white text-sm font-medium transition-all shadow-candy hover:shadow-candy-lg disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {computedNextLabel}
      </button>
    </div>
  );
}
