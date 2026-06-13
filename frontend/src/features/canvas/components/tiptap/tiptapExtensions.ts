/**
 * Tiptap editor extensions configuration.
 */
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

export const tiptapExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    codeBlock: false,
  }),
  CodeBlockLowlight.configure({ lowlight }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Link.configure({
    openOnClick: true,
    HTMLAttributes: {
      class: "text-[#FF8FA3] underline cursor-pointer",
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
    alignments: ["left", "center", "right"],
    defaultAlignment: "left",
  }),
  TextStyle,
  FontFamily.configure({ types: ["textStyle"] }),
];

export { lowlight };
