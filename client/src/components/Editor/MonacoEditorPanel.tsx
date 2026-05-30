import { forwardRef, useImperativeHandle, useRef } from "react";
import Editor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { CollabCursors } from "@/components/Editor/CollabCursors";
import { editorSample } from "@/lib/data";
import { oldMoneyTheme } from "@/lib/monacoTheme";

export type MonacoEditorHandle = {
  getCode: () => string;
};

type MonacoEditorPanelProps = {
  compact?: boolean;
  language?: string;
  minimapEnabled?: boolean;
};

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

      const model = editor.getModel();
      if (!model) return;

      const markers = [
        {
          startLineNumber: 18,
          endLineNumber: 18,
          startColumn: 9,
          endColumn: 24,
          severity: monaco.MarkerSeverity.Warning,
          message: "Potential null access when provider metadata is absent.",
        },
        {
          startLineNumber: 20,
          endLineNumber: 20,
          startColumn: 9,
          endColumn: 46,
          severity: monaco.MarkerSeverity.Error,
          message: "Cache key should be tenant scoped.",
        },
      ];

      monaco.editor.setModelMarkers(model, "owner", markers);
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
            defaultValue={editorSample}
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
        {!compact ? <CollabCursors /> : null}
        <div className="flex items-center justify-between border-t border-stone-200 bg-cream-100/80 px-5 py-2 font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">
          <span>{langLabel}</span>
          <span>Ln 18, Col 12</span>
          <span>2.4 KB</span>
        </div>
      </div>
    );
  },
);

MonacoEditorPanel.displayName = "MonacoEditorPanel";
