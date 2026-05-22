'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import { common, createLowlight } from 'lowlight';
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, Heading2, Heading3, Code, CheckSquare, Link as LinkIcon, Minus } from 'lucide-react';
import { useEffect } from 'react';

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const btnClass = (active: boolean) =>
    `p-1.5 rounded-lg transition-all duration-200 ${
      active
        ? 'bg-[#FF8FA3]/15 text-[#FF8FA3] shadow-sm shadow-[#FF8FA3]/10'
        : 'text-[#5A3E4C]/30 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-[#FFB4A2]/15 bg-[#FFF5F0]/30">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive('bold'))}
        title="Bold"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive('italic'))}
        title="Italic"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={btnClass(editor.isActive('strike'))}
        title="Strikethrough"
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>
      
      <div className="w-px h-4 bg-[#FFB4A2]/15 mx-1" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive('heading', { level: 3 }))}
        title="Heading 3"
      >
        <Heading3 className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive('bulletList'))}
        title="Bullet List"
      >
        <List className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive('orderedList'))}
        title="Ordered List"
      >
        <ListOrdered className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive('blockquote'))}
        title="Quote"
      >
        <Quote className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-4 bg-[#FFB4A2]/15 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={btnClass(editor.isActive('codeBlock'))}
        title="Code Block"
      >
        <Code className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={btnClass(editor.isActive('taskList'))}
        title="Task List"
      >
        <CheckSquare className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('URL:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className={btnClass(editor.isActive('link'))}
        title="Link"
      >
        <LinkIcon className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btnClass(false)}
        title="Horizontal Rule"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        codeBlock: false, // Diganti dengan CodeBlockLowlight
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-[#FF8FA3] underline cursor-pointer',
        },
      }),
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm prose-dark focus:outline-none min-h-[250px] p-4 max-w-none prose-headings:font-bold prose-headings:text-[#4A2F3C] prose-p:text-[#5A3E4C]/70 prose-p:leading-relaxed prose-a:text-[#FF8FA3] prose-strong:text-[#4A2F3C]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

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
        <div className="[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-[#FF8FA3]/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#5A3E4C]/50 [&_pre]:bg-[#1e1e2e] [&_pre]:text-[#cdd6f4] [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-2 [&_pre]:text-sm [&_pre]:overflow-x-auto [&_code]:bg-[#FFB4A2]/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-[#FF8FA3] [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:pl-0 [&_ul[data-type=taskList]_li]:flex [&_ul[data-type=taskList]_li]:items-start [&_ul[data-type=taskList]_li]:gap-2 [&_hr]:border-[#FFB4A2]/20 [&_hr]:my-4 [&_a]:text-[#FF8FA3] [&_a]:underline">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
