"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { CREATE_NOTE, CREATE_NOTE_LINK } from "@/graphql/mutations";
import { ADD_NODE_TO_STORY } from "@/graphql/story";
import { useStory } from "@/context/StoryContext";
import { getTemplateFor } from "../templates";

export interface StoryFormData {
  title: string;
  subtitle: string;
  description: string;
  storyType: string;
  privacyLevel: string;
  theme: string;
}

const initialFormData: StoryFormData = {
  title: "",
  subtitle: "",
  description: "",
  storyType: "custom",
  privacyLevel: "private",
  theme: "romantic",
};

/**
 * useStoryCreation - Manages the new-story form + creation logic.
 * Handles: form state, validation, story creation, template node/link wiring.
 */
export const useStoryCreation = () => {
  const router = useRouter();
  const { createStory } = useStory();
  const [createNote] = useMutation<{ createNote: { id: string } }>(
    CREATE_NOTE
  );
  const [createNoteLink] = useMutation(CREATE_NOTE_LINK);
  const [addNodeToStory] = useMutation(ADD_NODE_TO_STORY);

  const [formData, setFormData] = useState<StoryFormData>(initialFormData);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);

  const updateField = <K extends keyof StoryFormData>(
    key: K,
    value: StoryFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setFormData(initialFormData);
    setWizardStep(0);
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) return;

    const story = await createStory({
      title: formData.title,
      subtitle: formData.subtitle || undefined,
      description: formData.description || undefined,
      storyType: formData.storyType.toUpperCase(),
      privacyLevel: formData.privacyLevel.toUpperCase(),
      theme: formData.theme,
    });

    if (!story) return;

    // Apply template (non-fatal if it fails)
    const template = getTemplateFor(formData.storyType);
    if (template) {
      try {
        const created: { templateIdx: number; noteId: string }[] = [];
        const BASE_X = 400;
        const BASE_Y = 200;

        for (let i = 0; i < template.nodes.length; i++) {
          const tNode = template.nodes[i];
          const noteRes = await createNote({
            variables: {
              input: {
                title: tNode.title,
                positionX: BASE_X + tNode.position.x,
                positionY: BASE_Y + tNode.position.y,
                mood: tNode.mood,
              },
            },
          });
          const noteId = (noteRes.data as any)?.createNote?.id;
          if (!noteId) continue;
          await addNodeToStory({
            variables: {
              storyId: story.id,
              noteId,
              nodeType: tNode.nodeType,
            },
          });
          created.push({ templateIdx: i, noteId });
        }

        // Wire sequential connections
        for (let i = 1; i < created.length; i++) {
          const tNode = template.nodes[created[i].templateIdx];
          if (!tNode.connectFromPrevious) continue;
          const prev = created[i - 1];
          const curr = created[i];
          await createNoteLink({
            variables: {
              input: {
                sourceId: prev.noteId,
                targetId: curr.noteId,
                sourceHandle: "right",
                targetHandle: "left",
              },
            },
          });
        }
      } catch (err) {
        console.error("Failed to apply template:", err);
      }
    }

    router.push(`/story/${story.id}`);
  };

  return {
    formData,
    setFormData,
    updateField,
    showWizard,
    setShowWizard,
    wizardStep,
    setWizardStep,
    handleCreate,
    reset,
  };
};
