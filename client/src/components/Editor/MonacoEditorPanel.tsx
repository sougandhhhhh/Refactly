import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Editor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { oldMoneyTheme } from "@/lib/monacoTheme";

const languages = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "typescript", label: "TypeScript" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go (Golang)" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
];

export { languages };

export type MonacoEditorHandle = {
  getCode: () => string;
  setCode: (code: string) => void;
  applyFix: (line: number, newCode: string) => void;
};

type MonacoEditorPanelProps = {
  compact?: boolean;
  code?: string;
  language?: string;
  onLanguageChange?: (lang: string) => void;
  needsReview?: boolean;
  onReviewClick?: () => void;
  onCodeChange?: () => void;
};

export const MonacoEditorPanel = forwardRef<MonacoEditorHandle, MonacoEditorPanelProps>(
  ({ compact = false, code, language = "typescript", onLanguageChange, needsReview, onReviewClick, onCodeChange }, ref) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<typeof import("monaco-editor") | null>(null);

    // Sync external code changes to the editor
    useEffect(() => {
      if (code !== undefined) editorRef.current?.setValue(code);
    }, [code]);

    useImperativeHandle(ref, () => ({
      getCode: () => editorRef.current?.getValue() || "",
      setCode: (code: string) => {
        const ed = editorRef.current;
        if (ed) {
          const model = ed.getModel();
          if (model) model.setValue(code);
        }
      },
      applyFix: (line: number, newCode: string) => {
        const ed = editorRef.current;
        const monaco = monacoRef.current;
        if (!ed || !monaco) return;
        const model = ed.getModel();
        if (!model) return;
        const fixLines = newCode.split("\n");
        const endLine = Math.min(line + fixLines.length - 1, model.getLineCount());
        const endCol = model.getLineMaxColumn(endLine);
        ed.executeEdits("fix", [{
          range: new monaco.Range(line, 1, endLine, endCol),
          text: newCode,
        }]);
      },
    }));

    const handleMount: OnMount = (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;
      monaco.editor.defineTheme("old-money-theme", oldMoneyTheme);
      monaco.editor.setTheme("old-money-theme");
      if (code) editor.setValue(code);
      // Ensure context menu actions work by keeping editor focused
      editor.getContainerDomNode().addEventListener("contextmenu", () => {
        setTimeout(() => editor.focus(), 0);
      });
    };

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
            {needsReview && (
              <button
                onClick={onReviewClick}
                className="animate-pulse-gold rounded-sm bg-gold px-3 py-1 font-mono text-2xs uppercase tracking-[0.18em] text-cream-50 shadow-gold-glow"
              >
                Review Code
              </button>
            )}
          </div>
        </div>
        <div className={compact ? "h-[500px]" : "h-[calc(100vh-120px)]"}>
          <Editor
            key={language}
            language={language}
            onMount={handleMount}
            onChange={() => onCodeChange?.()}
            options={{
              fontFamily: "JetBrains Mono",
              fontSize: 13,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              padding: { top: 18, bottom: 18 },
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 14,
              contextmenu: true,
              'semanticHighlighting.enabled': true,
            }}
          />
        </div>
      </div>
    );
  },
);

MonacoEditorPanel.displayName = "MonacoEditorPanel";
