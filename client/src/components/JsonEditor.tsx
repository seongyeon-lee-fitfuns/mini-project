'use client';

import { useEffect, useRef } from 'react';

interface JsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export default function JsonEditor({ value, onChange, readOnly = false, height = '300px' }: JsonEditorProps) {
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
    <div className="w-full h-full">
      <textarea
        ref={editorRef}
        className="w-full h-full font-mono text-sm p-2 resize-none border-0 focus:outline-none"
        onChange={handleChange}
        readOnly={readOnly}
        style={{ height, overflow: 'auto' }}
        spellCheck="false"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
} 