import Editor from '@monaco-editor/react';
import { useState } from 'react';

export function CodeEditor({
  language = 'typescript',
  value = '',
  onChange,
}: {
  language?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const [code, setCode] = useState(value);
  return (
    <div className="rounded-2xl overflow-hidden border border-neutral-800">
      <Editor
        height="400px"
        defaultLanguage={language}
        value={code}
        onChange={(v) => {
          const next = v ?? '';
          setCode(next);
          onChange?.(next);
        }}
      />
    </div>
  );
}

export function SnippetsPage() {
  const [code, setCode] = useState('// Start typing...');
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Snippets</h2>
      <CodeEditor value={code} onChange={setCode} />
      <button className="px-3 py-2 rounded-lg bg-neutral-200 text-neutral-900">
        Save (stub)
      </button>
    </div>
  );
}
