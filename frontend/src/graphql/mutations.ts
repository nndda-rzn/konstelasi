/**
 * Re-export module for backward compatibility.
 * GraphQL mutations are now distributed across feature api/ folders:
 * - features/canvas/api/notes-mutations.ts (note CRUD, links, archive, etc.)
 * - features/story/api/story-versions.ts (story versioning)
 * This file maintains the import path for existing consumers.
 */

export {
  CREATE_NOTE,
  UPDATE_NOTE_CONTENT,
  DELETE_NOTE,
  UPDATE_NOTE_POSITION,
  UPDATE_NOTE_SIZE,
  BATCH_UPDATE_NOTES,
  CREATE_NOTE_LINK,
  DELETE_NOTE_LINK,
  UPDATE_NOTE_LINK,
  ADD_NOTE_IMAGE,
  DELETE_NOTE_IMAGE,
  ARCHIVE_NOTE,
  UNARCHIVE_NOTE,
  ARCHIVE_CANVAS,
  UNARCHIVE_CANVAS,
  MOVE_CANVAS,
  RESTORE_NOTE_VERSION,
} from "@/features/canvas/api/notes-mutations";

export {
  CREATE_STORY_VERSION,
  RESTORE_STORY_VERSION,
  DELETE_STORY_VERSION,
} from "@/features/story/api/story-versions";
