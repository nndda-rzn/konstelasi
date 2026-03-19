import { gql } from '@apollo/client/core';

export const CREATE_NOTE = gql`
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      id
      title
      content
      type
      positionX
      positionY
      width
      height
      color
    }
  }
`;

export const UPDATE_NOTE_POSITION = gql`
  mutation UpdateNotePosition($input: UpdateNotePositionInput!) {
    updateNotePosition(input: $input) {
      id
      positionX
      positionY
    }
  }
`;

export const CREATE_NOTE_LINK = gql`
  mutation CreateNoteLink($input: CreateNoteLinkInput!) {
    createNoteLink(input: $input) {
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
  }
`;

export const DELETE_NOTE_LINK = gql`
  mutation DeleteNoteLink($id: String!) {
    deleteNoteLink(id: $id)
  }
`;

export const UPDATE_NOTE_LINK = gql`
  mutation UpdateNoteLink($input: UpdateNoteLinkInput!) {
    updateNoteLink(input: $input) {
      id
      label
      color
    }
  }
`;

export const UPDATE_NOTE_CONTENT = gql`
  mutation UpdateNoteContent($input: UpdateNoteContentInput!) {
    updateNoteContent(input: $input) {
      id
      title
      content
      color
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: String!) {
    deleteNote(id: $id)
  }
`;

export const ADD_NOTE_IMAGE = gql`
  mutation AddNoteImage($input: AddNoteImageInput!) {
    addNoteImage(input: $input) {
      id
      imageUrl
      caption
      order
    }
  }
`;

export const DELETE_NOTE_IMAGE = gql`
  mutation DeleteNoteImage($id: String!) {
    deleteNoteImage(id: $id)
  }
`;
