// components/admin/RichTextEditor.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  List,
  Heading2,
  Quote,
  Minus,
  Eye,
  Type
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Format text with markdown
  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      (selectedText || 'Text') +
      after +
      value.substring(end);

    onChange(newText);

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + (selectedText ? selectedText.length : 4);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertHeading = () => insertFormatting('## ', '\n\n');
  const insertBold = () => insertFormatting('**', '**');
  const insertItalic = () => insertFormatting('*', '*');
  const insertList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newText = value.substring(0, lineStart) + '- ' + value.substring(lineStart);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2);
    }, 0);
  };

  const insertHighlight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const selectedText = value.substring(start, textarea.selectionEnd);
    const newText =
      value.substring(0, start) +
      '\n---\n' +
      (selectedText || 'Wichtiger Punkt') +
      '\n---\n\n' +
      value.substring(textarea.selectionEnd);
    
    onChange(newText);
    setTimeout(() => textarea.focus(), 0);
  };

  const insertDivider = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + '\n\n---\n\n' + value.substring(start);
    onChange(newText);
    setTimeout(() => textarea.focus(), 0);
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
        <button
          type="button"
          onClick={insertHeading}
          className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600 hover:text-slate-900"
          title="Überschrift (##)"
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={insertBold}
          className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600 hover:text-slate-900"
          title="Fett (**text**)"
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={insertItalic}
          className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600 hover:text-slate-900"
          title="Kursiv (*text*)"
        >
          <Italic className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={insertList}
          className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600 hover:text-slate-900"
          title="Liste (- item)"
        >
          <List className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={insertHighlight}
          className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600 hover:text-slate-900"
          title="Highlight Box (---)"
        >
          <Quote className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={insertDivider}
          className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600 hover:text-slate-900"
          title="Trennlinie"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            showPreview
              ? 'bg-blue-100 text-blue-700'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Eye className="h-3.5 w-3.5 inline mr-1" />
          {showPreview ? 'Editor' : 'Vorschau'}
        </button>
      </div>

      {/* Content Area */}
      <div className="relative">
        {!showPreview ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-[600px] p-6 text-base text-slate-700 resize-none focus:outline-none leading-relaxed font-sans"
            placeholder={placeholder || 'Schreibe hier...'}
          />
        ) : (
          <div className="p-6 h-[600px] overflow-y-auto prose prose-slate max-w-none">
            <PreviewContent content={value} />
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Type className="h-3 w-3" />
            Markdown wird unterstützt
          </span>
          <span>•</span>
          <span>Nutze die Toolbar für schnelle Formatierung</span>
        </div>
      </div>
    </div>
  );
}

// Simple preview component
function PreviewContent({ content }: { content: string }) {
  if (!content) return <p className="text-slate-400">Keine Vorschau verfügbar</p>;

  // Very basic markdown parsing for preview
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let inHighlight = false;
  let highlightContent: string[] = [];

  lines.forEach((line, idx) => {
    if (line.trim() === '---') {
      if (inHighlight) {
        elements.push(
          <div key={idx} className="my-4 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
            {highlightContent.join(' ')}
          </div>
        );
        highlightContent = [];
        inHighlight = false;
      } else {
        inHighlight = true;
      }
      return;
    }

    if (inHighlight) {
      highlightContent.push(line);
      return;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={idx} className="text-2xl font-bold mt-6 mb-3 text-slate-900">
          {line.substring(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={idx} className="text-xl font-semibold mt-4 mb-2 text-slate-900">
          {line.substring(4)}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={idx} className="ml-4">
          {line.substring(2)}
        </li>
      );
    } else if (line.trim() === '') {
      elements.push(<br key={idx} />);
    } else {
      // Parse bold and italic
      let text = line;
      text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
      
      elements.push(
        <p key={idx} className="mb-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />
      );
    }
  });

  return <>{elements}</>;
}
