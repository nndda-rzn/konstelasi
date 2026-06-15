import { gql } from "@apollo/client";

/**
 * Shared GraphQL fragments for story queries.
 * - STORY_NODE_FIELDS - shape of a story node returned by all queries
 * - STORY_EDGE_FIELDS - shape of an edge (used inside nodes)
 * - STORY_TAG_FIELDS - shape of a tag inside a node
 * - STORY_IMAGE_FIELDS - shape of an image inside a node
 * - STORY_NODE_EDGES - incoming + outgoing edges of a node
 */
export const STORY_TAG_FIELDS = gql`
  fragment StoryTagFields on Tag {
    id
    name
    color
  }
`;

export const STORY_IMAGE_FIELDS = gql`
  fragment StoryImageFields on NoteImage {
    id
    imageUrl
    caption
  }
`;

export const STORY_EDGE_FIELDS = gql`
  fragment StoryEdgeFields on StoryEdge {
    id
    source {
      id
    }
    target {
      id
    }
    sourceHandle
    targetHandle
    label
    color
  }
`;

export const STORY_NODE_EDGES = gql`
  fragment StoryNodeEdges on StoryNode {
    outgoingEdges {
      ...StoryEdgeFields
    }
    incomingEdges {
      ...StoryEdgeFields
    }
  }
  ${STORY_EDGE_FIELDS}
`;

export const STORY_NODE_FIELDS = gql`
  fragment StoryNodeFields on StoryNode {
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
    storyNodeType
    storyMetadata
    isLocked
    unlockDate
    isTimeLocked
    eventDate
    eventLocation
    images {
      ...StoryImageFields
    }
    tags {
      ...StoryTagFields
    }
    createdAt
  }
  ${STORY_IMAGE_FIELDS}
  ${STORY_TAG_FIELDS}
`;

export const STORY_NODE_FULL = gql`
  fragment StoryNodeFull on StoryNode {
    ...StoryNodeFields
    outgoingEdges {
      ...StoryEdgeFields
    }
    incomingEdges {
      ...StoryEdgeFields
    }
  }
  ${STORY_NODE_FIELDS}
  ${STORY_EDGE_FIELDS}
`;
