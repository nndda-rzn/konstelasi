/**
 * Barrel re-export for note + canvas mutations.
 * Consumers can import from `@/graphql/mutations` (preferred) or
 * directly from this file. The actual operations are split into
 * per-domain files.
 */

export {
  CREATE_NOTE,
  UPDATE_NOTE_CONTENT,
  DELETE_NOTE,
} from "./note-crud";

export {
  UPDATE_NOTE_POSITION,
  UPDATE_NOTE_SIZE,
  BATCH_UPDATE_NOTES,
} from "./note-position";

export {
  CREATE_NOTE_LINK,
  DELETE_NOTE_LINK,
  UPDATE_NOTE_LINK,
} from "./note-links";

export { ADD_NOTE_IMAGE, DELETE_NOTE_IMAGE } from "./note-images";

export {
  ARCHIVE_NOTE,
  UNARCHIVE_NOTE,
  ARCHIVE_CANVAS,
  UNARCHIVE_CANVAS,
  RESTORE_NOTE_VERSION,
} from "./note-archive";

export { MOVE_CANVAS } from "./canvas-mutations";
