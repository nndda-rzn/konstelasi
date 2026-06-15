import { gql } from "@apollo/client";

/**
 * Story analytics.
 */
export const GET_WRITING_STATISTICS = gql`
  query GetWritingStatistics($storyId: String!) {
    getWritingStatistics(storyId: $storyId) {
      totalWords
      totalNodes
      averageNodeLength
      longestNode
      writingStreak
    }
  }
`;

export const GET_EMOTIONAL_ARC = gql`
  query GetEmotionalArc($storyId: String!) {
    getEmotionalArc(storyId: $storyId) {
      nodeId
      nodeTitle
      mood
      intensity
      position
    }
  }
`;

export const GET_MEMORY_TIMELINE = gql`
  query GetMemoryTimeline($storyId: String!) {
    getMemoryTimeline(storyId: $storyId) {
      eventId
      eventDate
      title
      description
      linkedNodeId
      type
    }
  }
`;

export const GET_STORY_VERSIONS = gql`
  query GetStoryVersions($storyId: String!) {
    getStoryVersions(storyId: $storyId) {
      id
      versionNumber
      createdAt
      changeDescription
    }
  }
`;

export const GET_CHARACTER_PROFILE = gql`
  query GetCharacterProfile($storyId: String!) {
    getCharacterProfile(storyId: $storyId) {
      name
      appearances
      traits
      description
    }
  }
`;

export const GET_STORY_ANALYTICS = gql`
  query GetStoryAnalytics($storyId: String!) {
    getStoryAnalytics(storyId: $storyId) {
      totalNodes
      totalWords
      averageNodeLength
      completionRate
      sentimentBreakdown {
        positive
        neutral
        negative
      }
      topTags {
        id
        name
        count
      }
      nodeTypeDistribution {
        type
        count
      }
    }
  }
`;
