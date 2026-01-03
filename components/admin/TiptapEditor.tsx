'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  Minus,
  Code
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export function TiptapEditor({ content, onChange, placeholder, onImageUpload }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Schreibe hier deinen Artikel...',
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-8',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-700 underline',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[600px] p-8',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (onImageUpload) {
        const url = await onImageUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
      } else {
        // Fallback: Local preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          editor.chain().focus().setImage({ src: url }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  const addLink = () => {
    const url = window.prompt('URL eingeben:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    active, 
    disabled, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    active?: boolean; 
    disabled?: boolean; 
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-all ${
        active 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex-wrap">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-3 border-r border-slate-200">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Fett (⌘B)"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Kursiv (⌘I)"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            title="Code (⌘E)"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 pr-3 border-r border-slate-200">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Überschrift 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 pr-3 border-r border-slate-200">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Aufzählung"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Nummerierte Liste"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Block Elements */}
        <div className="flex items-center gap-1 pr-3 border-r border-slate-200">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Zitat"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Trennlinie"
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Media & Links */}
        <div className="flex items-center gap-1 pr-3 border-r border-slate-200">
          <ToolbarButton
            onClick={addImage}
            title="Bild einfügen"
          >
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={addLink}
            active={editor.isActive('link')}
            title="Link einfügen"
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Rückgängig (⌘Z)"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Wiederholen (⌘⇧Z)"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
<<<<<<< HEAD
      
      {/* ✅ FOOTER KOMPLETT ENTFERNT! */}
    </div>
  );
}
=======

      {/* Footer Helper */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>💡 Tip: Markdown Shortcuts funktionieren!</span>
            <span>•</span>
            <span>**fett** für Fett</span>
            <span>•</span>
            <span>## für Überschrift</span>
          </div>
          <div>
            {editor.storage.characterCount?.characters() || 0} Zeichen
          </div>
        </div>
      </div>
    </div>
  );
}
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
