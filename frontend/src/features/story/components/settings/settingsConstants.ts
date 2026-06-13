/**
 * Story settings constants - privacy, status, and access options.
 */

import { Lock, Users, Globe } from "lucide-react";

export const PRIVACY_OPTIONS = [
  { value: "PRIVATE", label: "Private", icon: Lock, desc: "Hanya Anda" },
  {
    value: "FRIENDS_ONLY",
    label: "Friends Only",
    icon: Users,
    desc: "Teman yang diundang",
  },
  { value: "PUBLIC", label: "Public", icon: Globe, desc: "Siapa saja" },
];

export const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft", color: "amber" },
  { value: "PUBLISHED", label: "Published", color: "emerald" },
  { value: "ARCHIVED", label: "Archived", color: "gray" },
];
