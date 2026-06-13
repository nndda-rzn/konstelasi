"use client";

import { gql } from "@apollo/client";

export const GET_WRITING_STATISTICS = gql`
  query GetWritingStatistics($storyId: String!) {
    getWritingStatistics(storyId: $storyId) {
      totalNodes
      totalWords
      totalCharacters
      avgWordsPerNode
      readingTimeMinutes
      writingDays
      maxWritingStreak
      nodeTypeBreakdown {
        type
        count
      }
      moodBreakdown {
        mood
        count
      }
      mostCommonMood
      longestNode {
        id
        title
        wordCount
      }
      firstWriteDate
      lastWriteDate
    }
  }
`;

export const GET_EMOTIONAL_ARC = gql`
  query GetEmotionalArc($storyId: String!) {
    getEmotionalArc(storyId: $storyId) {
      dataPoints {
        index
        nodeId
        title
        mood
        score
        nodeType
        createdAt
      }
      overallMood
      overallScore
      emotionalRange
      peaks {
        index
        nodeId
        title
        mood
        score
        nodeType
      }
      valleys {
        index
        nodeId
        title
        mood
        score
        nodeType
      }
      trend
    }
  }
`;

export const GET_MEMORY_TIMELINE = gql`
  query GetMemoryTimeline($storyId: String!) {
    getMemoryTimeline(storyId: $storyId) {
      timelineItems {
        nodeId
        title
        nodeType
        mood
        eventDate
        eventLocation
        writeDate
        daysSinceEvent
        daysSinceWritten
        content
      }
      totalWithEventDate
      totalWithoutEventDate
      oldestMemory {
        title
        eventDate
        daysSince
      }
      newestMemory {
        title
        eventDate
        daysSince
      }
      avgDaysSinceEvent
      monthlyDistribution {
        month
        count
      }
    }
  }
`;

export const GET_STORY_VERSIONS = gql`
  query GetStoryVersions($storyId: String!) {
    getStoryVersions(storyId: $storyId) {
      id
      version
      label
      notes
      nodeCount
      wordCount
      createdAt
    }
  }
`;

export const GET_CHARACTER_PROFILE = gql`
  query GetCharacterProfile($storyId: String!) {
    getCharacterProfile(storyId: $storyId) {
      characters {
        nodeId
        name
        description
        mood
        totalMentions
        totalWords
        moodDistribution {
          mood
          count
        }
        nodeTypesAppearing {
          type
          count
        }
        appearances {
          nodeId
          title
          nodeType
          mood
          createdAt
        }
        firstAppearance
        lastAppearance
      }
      totalCharacters
      mostMentioned {
        name
        mentions
      }
    }
  }
`;
