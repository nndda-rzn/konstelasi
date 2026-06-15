/**
 * Barrel re-export for story GraphQL operations.
 * Consumers can import from `@/graphql/story` (preferred) or
 * directly from this file. The actual operations are split into
 * fragments, queries, mutations, engagement, and analytics.
 */

export {
  STORY_NODE_FIELDS,
  STORY_EDGE_FIELDS,
  STORY_TAG_FIELDS,
  STORY_IMAGE_FIELDS,
  STORY_NODE_FULL,
  STORY_NODE_EDGES,
} from "./fragments";

export {
  GET_STORIES,
  GET_STORY,
  GET_ON_THIS_DAY_MEMORIES,
  GET_PUBLIC_STORY,
  GET_STORY_ACCESS,
} from "./queries";

export {
  CREATE_STORY,
  UPDATE_STORY,
  DELETE_STORY,
  GRANT_STORY_ACCESS,
  REVOKE_STORY_ACCESS,
  ADD_NODE_TO_STORY,
  REMOVE_NODE_FROM_STORY,
  TOGGLE_NODE_LOCK,
} from "./mutations";

export {
  TOGGLE_BOOKMARK,
  ADD_BADGE,
  RECORD_VIEW,
  GET_BOOKMARKS,
} from "./engagement";

export {
  GET_WRITING_STATISTICS,
  GET_EMOTIONAL_ARC,
  GET_MEMORY_TIMELINE,
  GET_STORY_VERSIONS,
  GET_CHARACTER_PROFILE,
  GET_STORY_ANALYTICS,
} from "./analytics";
