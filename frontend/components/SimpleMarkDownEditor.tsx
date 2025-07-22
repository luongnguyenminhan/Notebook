'use client';

import React, { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface SimpleMarkdownEditorProps {
  initialValue?: string;
  onChange?: (markdown: string) => void;
  onSave?: (markdown: string) => void;
  isSaving?: boolean;
  height?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  // Mode: 'edit' for textarea editing, 'view' for markdown preview
  mode?: 'edit' | 'view';
}

const SimpleMarkdownEditor: React.FC<SimpleMarkdownEditorProps> = ({
  initialValue = '',
  onChange,
  onSave,
  isSaving = false,
  height = '500px',
  placeholder = 'Nhập nội dung markdown...',
  className = '',
  disabled = false,
  mode = 'edit',
}) => {
  // Khi nhận initialValue, chuyển '\n' thành thực sự xuống dòng
  const [content, setContent] = useState(initialValue.replace(/\\n/g, '\n'));
  const [originalContent, setOriginalContent] = useState(
    initialValue.replace(/\\n/g, '\n'),
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Update content when initialValue changes
  useEffect(() => {
    setContent(initialValue.replace(/\\n/g, '\n'));
    setOriginalContent(initialValue.replace(/\\n/g, '\n'));
    setHasChanges(false);
  }, [initialValue]);

  // Calculate if there are unsaved changes
  useEffect(() => {
    setHasChanges(content !== originalContent);
  }, [content, originalContent]);

  // Handle content change
  const handleContentChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      setContent(newValue);

      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange],
  );

  // Handle save action
  const handleSave = useCallback(() => {
    if (!hasChanges || isSaving || !onSave) return;

    onSave(content);
    setOriginalContent(content);
    setHasChanges(false);
  }, [hasChanges, isSaving, onSave, content]);

  // Keyboard shortcut for save (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (hasChanges && !isSaving && mode === 'edit') {
          handleSave();
        }
      }
    };

    if (mode === 'edit') {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [mode, hasChanges, isSaving, handleSave]);

  return (
    <div className={`simple-markdown-editor ${className}`}>
      {/* Content area */}
      <div
        className="editor-content border border-gray-200 rounded-lg overflow-hidden bg-[var(--input-bg-light)] text-[var(--text-color-light)] dark:bg-[var(--input-bg-dark)] dark:text-[var(--text-color-dark)]"
        style={{ transition: 'all 0.2s' }}
      >
        {mode === 'edit' ? (
          /* Edit mode with textarea */
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            disabled={disabled || isSaving}
            className={`w-full resize-none border-0 outline-none p-4 font-mono text-sm leading-relaxed ${
              disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
            } bg-[var(--input-bg-light)] text-[var(--text-color-light)] dark:bg-[var(--input-bg-dark)] dark:text-[var(--text-color-dark)] dark:placeholder-gray-400 placeholder-gray-400 border border-gray-200 dark:border-gray-700`}
            style={{
              height,
              minHeight: '200px',
              whiteSpace: 'pre-wrap',
              overflowY: 'auto',
              transition: 'all 0.2s',
            }}
            rows={10}
            wrap="soft"
          />
        ) : (
          /* View mode with markdown preview */
          <div
            className="prose prose-sm max-w-none p-4 overflow-y-auto bg-[var(--input-bg-light)] text-[var(--text-color-light)] dark:bg-[var(--input-bg-dark)] dark:text-[var(--text-color-dark)] border border-gray-200 dark:border-gray-700"
            style={{ height, minHeight: '200px', transition: 'all 0.2s' }}
          >
            {content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                skipHtml={false}
                components={{
                  // Custom styling for markdown elements
                  h1: ({ children }) => (
                    <h1
                      className="text-2xl font-bold mb-5 mt-7 first:mt-0 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]"
                      style={{
                        borderBottom: '1px solid var(--border-color-light)',
                        borderBottomColor: 'var(--border-color-light)',
                        borderBottomWidth: 1,
                      }}
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold mb-4 mt-6 first:mt-0 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold mb-3 mt-5 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-md font-medium mb-2 mt-4 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="mb-2 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc ml-5 mb-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal ml-5 mb-2">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="mb-1 text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">
                      {children}
                    </em>
                  ),
                  code: ({ children }) => (
                    <code className="bg-[var(--input-bg-light)] dark:bg-[var(--input-bg-dark)] px-1 py-0.5 rounded text-sm font-mono text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] border border-[var(--border-color-light)] dark:border-[var(--border-color-dark)]">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-[var(--input-bg-light)] dark:bg-[var(--input-bg-dark)] p-3 rounded overflow-x-auto text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] border border-[var(--border-color-light)] dark:border-[var(--border-color-dark)]">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 pl-4 italic text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] border-[var(--border-color-light)] dark:border-[var(--border-color-dark)]">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <div className="flex items-center justify-center h-full text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">
                No content
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with shortcuts info */}
      {mode === 'edit' && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          <span>
            Nhấn <kbd className="px-1 py-0.5 bg-gray-200 rounded">Ctrl + S</kbd>{' '}
            để lưu nhanh
          </span>
        </div>
      )}
    </div>
  );
};

export default SimpleMarkdownEditor;
