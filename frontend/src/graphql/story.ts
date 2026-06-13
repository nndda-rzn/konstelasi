/**
 * Re-export module for backward compatibility.
 * Story GraphQL operations are now defined in `features/story/api/`.
 * This file maintains the import path for existing consumers.
 */

export {
  GET_STORIES,
  GET_STORY,
  GET_ON_THIS_DAY_MEMORIES,
  GET_PUBLIC_STORY,
  GET_STORY_ACCESS,
  CREATE_STORY,
  UPDATE_STORY,
  DELETE_STORY,
  GRANT_STORY_ACCESS,
  REVOKE_STORY_ACCESS,
  ADD_NODE_TO_STORY,
  REMOVE_NODE_FROM_STORY,
  TOGGLE_NODE_LOCK,
  TOGGLE_BOOKMARK,
  ADD_BADGE,
  RECORD_VIEW,
  GET_BOOKMARKS,
  GET_STORY_ANALYTICS,
} from "@/features/story/api/stories";
