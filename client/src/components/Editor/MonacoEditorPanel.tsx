import { forwardRef, useImperativeHandle, useRef } from "react";
import Editor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { oldMoneyTheme } from "@/lib/monacoTheme";

export type MonacoEditorHandle = {
  getCode: () => string;
};

type MonacoEditorPanelProps = {
  compact?: boolean;
  language?: string;
  minimapEnabled?: boolean;
};

const DEFAULT_CODE = `// Write or paste your code here, then click "Review Code"
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
`;

export const MonacoEditorPanel = forwardRef<MonacoEditorHandle, MonacoEditorPanelProps>(
  ({ compact = false, language = "typescript", minimapEnabled = !compact }, ref) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

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
        <div className="border-b border-stone-200 bg-cream-100/80 px-5 py-3 font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">
          live-review.{language}
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
