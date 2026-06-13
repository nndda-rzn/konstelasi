/**
 * Wizard types - shared type definitions.
 */
export interface StoryTypeOption {
  value: string;
  label: string;
  icon: any;
  color: string;
  desc: string;
}

export interface PrivacyOption {
  value: string;
  label: string;
  icon: any;
  desc: string;
}

export interface StoryWizardFormData {
  title: string;
  subtitle: string;
  description: string;
  storyType: string;
  privacyLevel: string;
  theme: string;
}
