import { gql } from "@apollo/client";

/**
 * Engagement operations: bookmarks, badges, views.
 */
export const TOGGLE_BOOKMARK = gql`
  mutation ToggleBookmark($storyId: String!, $nodeId: String) {
    toggleBookmark(storyId: $storyId, nodeId: $nodeId)
  }
`;

export const ADD_BADGE = gql`
  mutation AddBadge($storyId: String!, $badge: String!) {
    addBadge(storyId: $storyId, badge: $badge)
  }
`;

export const RECORD_VIEW = gql`
  mutation RecordView($storyId: String!) {
    recordView(storyId: $storyId)
  }
`;

export const GET_BOOKMARKS = gql`
  query GetBookmarks {
    getBookmarks {
      id
      storyId
      nodeId
      createdAt
    }
  }
`;
