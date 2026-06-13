"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { tiptapExtensions } from "./tiptap/tiptapExtensions";
import { MenuBar } from "./tiptap/MenuBar";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const EDITOR_CLASSES =
  "prose prose-sm prose-dark focus:outline-none min-h-[250px] p-4 max-w-none prose-headings:font-bold prose-headings:text-[#4A2F3C] prose-p:text-[#5A3E4C]/70 prose-p:leading-relaxed prose-a:text-[#FF8FA3] prose-strong:text-[#4A2F3C]";

const PROSE_STYLES = `
  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
  [&_blockquote]:border-l-2 [&_blockquote]:border-[#FF8FA3]/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#5A3E4C]/50
  [&_pre]:bg-[#1e1e2e] [&_pre]:text-[#cdd6f4] [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-2 [&_pre]:text-sm [&_pre]:overflow-x-auto
  [&_code]:bg-[#FFB4A2]/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-[#FF8FA3]
  [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit
  [&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:pl-0
  [&_ul[data-type=taskList]_li]:flex [&_ul[data-type=taskList]_li]:items-start [&_ul[data-type=taskList]_li]:gap-2
  [&_hr]:border-[#FFB4A2]/20 [&_hr]:my-4
  [&_a]:text-[#FF8FA3] [&_a]:underline
`;

/**
 * TiptapEditor - Rich text editor with formatting toolbar.
 */
export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: tiptapExtensions,
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: EDITOR_CLASSES },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external content changes (e.g. from auto-save reset)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  return (
    <div className="w-full border border-[#FFB4A2]/20 rounded-xl bg-white/50 overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-[#FF8FA3]/20 focus-within:border-[#FF8FA3]/20 transition-all">
      <MenuBar editor={editor} />
      <div
        className="flex-1 bg-transparent hover:bg-white/30 transition-colors cursor-text"
        onClick={() => editor?.commands.focus()}
      >
        <div className={PROSE_STYLES}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
