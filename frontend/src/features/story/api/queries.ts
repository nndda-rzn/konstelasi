import { gql } from "@apollo/client";
import { STORY_NODE_FULL } from "./fragments";

/**
 * Story queries.
 */
export const GET_STORIES = gql`
  query GetStories {
    getStories {
      id
      title
      subtitle
      description
    }
  }
`;

export const GET_STORY = gql`
  query GetStory($id: String!) {
    getStory(id: $id) {
      id
      title
      subtitle
      description
      coverImage
      storyType
      status
      privacyLevel
      theme
      authorNote
      scrapbookTheme
      nodes {
        ...StoryNodeFull
      }
      createdAt
      updatedAt
    }
  }
  ${STORY_NODE_FULL}
`;

export const GET_ON_THIS_DAY_MEMORIES = gql`
  query GetOnThisDayMemories {
    getOnThisDayMemories {
      nodeId
      title
      content
      storyId
      storyTitle
      nodeType
      mood
      eventDate
      yearsAgo
      unlockDate
      isTimeLocked
    }
  }
`;

export const GET_PUBLIC_STORY = gql`
  query GetPublicStory($id: String!) {
    getPublicStory(id: $id) {
      id
      title
      subtitle
      description
      coverImage
      storyType
      status
      privacyLevel
      theme
      authorNote
      scrapbookTheme
      user {
        id
        email
      }
      nodes {
        ...StoryNodeFull
      }
      createdAt
      updatedAt
    }
  }
  ${STORY_NODE_FULL}
`;

export const GET_STORY_ACCESS = gql`
  query GetStoryAccess($storyId: String!) {
    getStoryAccess(storyId: $storyId) {
      id
      grantedTo {
        id
        email
      }
      accessLevel
      grantedAt
      expiresAt
    }
  }
`;
