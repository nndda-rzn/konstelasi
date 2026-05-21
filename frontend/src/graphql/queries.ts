import { gql } from '@apollo/client/core';

export const GET_NOTES = gql`
  query GetNotes($canvasId: String, $tagIds: [String!]) {
    getNotes(canvasId: $canvasId, tagIds: $tagIds) {
      id
      title
      content
      type
      positionX
      positionY
      width
      height
      color
      mood
      isArchived
      createdAt
      canvas {
        id
        name
      }
      tags {
        id
        name
        color
      }
      images {
        id
        imageUrl
        caption
        order
      }
      outgoingEdges {
        id
        source { id }
        target { id }
        sourceHandle
        targetHandle
        type
        animated
        label
        color
      }
      incomingEdges {
        id
        source {
          id
          title
        }
      }
    }
  }
`;

export const GET_ARCHIVED_NOTES = gql`
  query GetArchivedNotes($canvasId: String) {
    getArchivedNotes(canvasId: $canvasId) {
      id
      title
      content
      type
      color
      mood
      isArchived
      archivedAt
      createdAt
      canvas {
        id
        name
      }
      tags {
        id
        name
        color
      }
      images {
        id
        imageUrl
        caption
        order
      }
    }
  }
`;

export const GET_WRITING_STREAK = gql`
  query GetWritingStreak {
    getWritingStreak {
      id
      currentStreak
      longestStreak
      totalWriteDays
      lastWriteDate
    }
  }
`;

export const GET_CHILD_CANVASES = gql`
  query ChildCanvases($parentId: String!) {
    childCanvases(parentId: $parentId) {
      id
      name
      description
      level
      order
      isArchived
      createdAt
    }
  }
`;

export const GET_ROOT_CANVASES = gql`
  query RootCanvases {
    rootCanvases {
      id
      name
      description
      level
      order
      isArchived
      createdAt
    }
  }
`;

export const GET_NOTE_VERSIONS = gql`
  query GetNoteVersions($noteId: String!) {
    getNoteVersions(noteId: $noteId) {
      id
      title
      content
      color
      mood
      version
      createdAt
    }
  }
`;

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
      nodeTypeBreakdown { type count }
      moodBreakdown { mood count }
      mostCommonMood
      longestNode { id title wordCount }
      firstWriteDate
      lastWriteDate
    }
  }
`;

export const GET_EMOTIONAL_ARC = gql`
  query GetEmotionalArc($storyId: String!) {
    getEmotionalArc(storyId: $storyId) {
      dataPoints { index nodeId title mood score nodeType createdAt }
      overallMood
      overallScore
      emotionalRange
      peaks { index nodeId title mood score nodeType }
      valleys { index nodeId title mood score nodeType }
      trend
    }
  }
`;

export const GET_MEMORY_TIMELINE = gql`
  query GetMemoryTimeline($storyId: String!) {
    getMemoryTimeline(storyId: $storyId) {
      timelineItems {
        nodeId title nodeType mood
        eventDate eventLocation writeDate
        daysSinceEvent daysSinceWritten content
      }
      totalWithEventDate
      totalWithoutEventDate
      oldestMemory { title eventDate daysSince }
      newestMemory { title eventDate daysSince }
      avgDaysSinceEvent
      monthlyDistribution { month count }
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
