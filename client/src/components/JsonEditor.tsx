'use client';

import { useEffect, useRef } from 'react';

interface JsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  placeholder?: string;
}

export default function JsonEditor({ 
  value, 
  onChange, 
  readOnly = false, 
  height = '300px',
  placeholder
}: JsonEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.value = value;
    }
  }, [value]);

  const handleChange = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.value);
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 rounded-md">
      <textarea
        ref={editorRef}
        className={`w-full h-full font-mono text-sm p-4 resize-none focus:outline-none
          bg-gray-900 text-gray-100
          ${readOnly ? 'opacity-90 cursor-default' : 'opacity-100'}
          rounded-md shadow-inner
          border border-gray-700
          placeholder-gray-500
          dark:bg-gray-800 
          dark:text-gray-200
          dark:border-gray-600
          focus:border-blue-500 dark:focus:border-blue-400`}
        onChange={handleChange}
        readOnly={readOnly}
        style={{ height, overflow: 'auto' }}
        spellCheck="false"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder={placeholder}
      />
    </div>
  );
} 