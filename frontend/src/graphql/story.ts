import { gql } from '@apollo/client';

// Queries
export const GET_STORIES = gql`
  query GetStories {
    getStories {
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
      isArchived
      createdAt
      updatedAt
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
      nodes {
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
        images { id imageUrl caption }
        tags { id name color }
        outgoingEdges { id source { id } target { id } sourceHandle targetHandle label color }
        incomingEdges { id source { id } target { id } sourceHandle targetHandle label color }
        createdAt
      }
      createdAt
      updatedAt
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
      user { id email }
      nodes {
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
        images { id imageUrl caption }
        tags { id name color }
        outgoingEdges { id source { id } target { id } sourceHandle targetHandle label color }
        incomingEdges { id source { id } target { id } sourceHandle targetHandle label color }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_STORY_ACCESS = gql`
  query GetStoryAccess($storyId: String!) {
    getStoryAccess(storyId: $storyId) {
      id
      grantedTo { id email }
      accessLevel
      grantedAt
      expiresAt
    }
  }
`;

// Mutations
export const CREATE_STORY = gql`
  mutation CreateStory($input: CreateStoryInput!) {
    createStory(input: $input) {
      id
      title
      subtitle
      storyType
      status
      privacyLevel
      createdAt
    }
  }
`;

export const UPDATE_STORY = gql`
  mutation UpdateStory($input: UpdateStoryInput!) {
    updateStory(input: $input) {
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
      updatedAt
    }
  }
`;

export const DELETE_STORY = gql`
  mutation DeleteStory($id: String!) {
    deleteStory(id: $id)
  }
`;

export const GRANT_STORY_ACCESS = gql`
  mutation GrantStoryAccess($storyId: String!, $email: String!, $level: AccessLevel!) {
    grantStoryAccess(storyId: $storyId, email: $email, level: $level) {
      id
      grantedTo { id email }
      accessLevel
      grantedAt
    }
  }
`;

export const REVOKE_STORY_ACCESS = gql`
  mutation RevokeStoryAccess($storyId: String!, $accessId: String!) {
    revokeStoryAccess(storyId: $storyId, accessId: $accessId)
  }
`;

export const ADD_NODE_TO_STORY = gql`
  mutation AddNodeToStory($storyId: String!, $noteId: String!, $nodeType: String, $metadata: String) {
    addNodeToStory(storyId: $storyId, noteId: $noteId, nodeType: $nodeType, metadata: $metadata) {
      id
      storyNodeType
      storyMetadata
    }
  }
`;

export const REMOVE_NODE_FROM_STORY = gql`
  mutation RemoveNodeFromStory($noteId: String!) {
    removeNodeFromStory(noteId: $noteId) {
      id
      storyNodeType
      storyMetadata
    }
  }
`;

export const TOGGLE_NODE_LOCK = gql`
  mutation ToggleNodeLock($noteId: String!) {
    toggleNodeLock(noteId: $noteId) {
      id
      isLocked
    }
  }
`;
