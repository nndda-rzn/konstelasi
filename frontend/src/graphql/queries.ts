/**
 * Re-export module for backward compatibility.
 * GraphQL queries are now distributed across feature api/ folders:
 * - features/canvas/api/notes.ts (note + streak queries)
 * - features/gallery/api/media.ts (media queries)
 * - features/story/api/analytics.ts (story analytics)
 * This file maintains the import path for existing consumers.
 */

export {
  GET_NOTES,
  GET_ARCHIVED_NOTES,
  GET_NOTE_VERSIONS,
  GET_WRITING_STREAK,
} from "@/features/canvas/api/notes";

export { GET_ALL_MEDIA } from "@/features/gallery/api/media";

export {
  GET_WRITING_STATISTICS,
  GET_EMOTIONAL_ARC,
  GET_MEMORY_TIMELINE,
  GET_STORY_VERSIONS,
  GET_CHARACTER_PROFILE,
} from "@/features/story/api/analytics";
