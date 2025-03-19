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
    <div className="w-full h-full bg-gray-50 rounded-md">
      <textarea
        ref={editorRef}
        className={`w-full h-full font-mono text-sm p-4 resize-none focus:outline-none
          bg-[#1e1e1e] text-gray-200
          ${readOnly ? 'bg-opacity-90 cursor-default' : 'bg-opacity-95'}
          rounded-md shadow-inner
          border border-gray-700
          placeholder-gray-500`}
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