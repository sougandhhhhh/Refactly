import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Editor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { oldMoneyTheme } from "@/lib/monacoTheme";

const languages = [
  { value: "typescript", label: "TypeScript" },
  { value: "go", label: "Go" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
];

export type MonacoEditorHandle = {
  getCode: () => string;
};

type MonacoEditorPanelProps = {
  compact?: boolean;
  language?: string;
  onLanguageChange?: (lang: string) => void;
};

const DEFAULT_CODE = `// Write or paste your code here, then click "Review Code"
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
`;

export const MonacoEditorPanel = forwardRef<MonacoEditorHandle, MonacoEditorPanelProps>(
  ({ compact = false, language = "typescript", onLanguageChange }, ref) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const [minimapEnabled, setMinimapEnabled] = useState(true);

    useImperativeHandle(ref, () => ({
      getCode: () => editorRef.current?.getValue() || "",
    }));

    const handleMount: OnMount = (editor, monaco) => {
      editorRef.current = editor;
      monaco.editor.defineTheme("old-money-theme", oldMoneyTheme);
      monaco.editor.setTheme("old-money-theme");
    };

    const langLabel = language.charAt(0).toUpperCase() + language.slice(1);

    return (
      <div className="card-old-money relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-200 bg-cream-100/80 px-5 py-3">
          <span className="font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">
            live-review.{language}
          </span>
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => onLanguageChange?.(e.target.value)}
              className="cursor-pointer bg-transparent font-mono text-2xs uppercase tracking-[0.18em] text-stone-500 outline-none hover:text-stone-700"
            >
              {languages.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <button
              onClick={() => setMinimapEnabled((v) => !v)}
              className="flex h-6 w-6 items-center justify-center rounded-sm text-stone-500 hover:bg-stone-200/60"
              aria-label={minimapEnabled ? "Hide minimap" : "Show minimap"}
            >
              {minimapEnabled ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>
        </div>
        <div className={compact ? "h-[500px]" : "h-[calc(100vh-120px)]"}>
          <Editor
            key={language}
            language={language}
            defaultValue={DEFAULT_CODE}
            onMount={handleMount}
            options={{
              fontFamily: "JetBrains Mono",
              fontSize: 13,
              minimap: { enabled: minimapEnabled },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              padding: { top: 18, bottom: 18 },
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 14,
            }}
          />
        </div>
        <div className="flex items-center justify-between border-t border-stone-200 bg-cream-100/80 px-5 py-2 font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">
          <span>{langLabel}</span>
        </div>
      </div>
    );
  },
);

MonacoEditorPanel.displayName = "MonacoEditorPanel";
