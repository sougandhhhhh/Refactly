import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorToolbar } from "@/components/Editor/EditorToolbar";
import type { MonacoEditorHandle } from "@/components/Editor/MonacoEditorPanel";
import { AppLayout } from "@/components/Layout/AppLayout";
import { AIFeedbackPanel } from "@/components/Review/AIFeedbackPanel";
import { ASTViewer } from "@/components/Review/ASTViewer";
import { ComplexityPanel } from "@/components/Review/ComplexityPanel";
import { SecurityPanel } from "@/components/Review/SecurityPanel";
import { showOldMoneyToast } from "@/components/common/Toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSession, fetchSession, triggerReview, updateSession, warmUpServer, type ReviewResult } from "@/lib/api";

const tabs = ["AI Review", "Security", "Complexity", "AST"] as const;
const MonacoEditorPanel = lazy(async () => {
  const module = await import("@/components/Editor/MonacoEditorPanel");
  return { default: module.MonacoEditorPanel };
});

const LS_LAST_SESSION = "refactly_last_session";

const SAMPLE_CODES: Record<string, string> = {
  python: `def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("World"))`,
  javascript: `function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println(greet("World"));
    }

    static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`,
  cpp: `#include <iostream>
#include <string>

std::string greet(const std::string& name) {
    return "Hello, " + name + "!";
}

int main() {
    std::cout << greet("World") << std::endl;
    return 0;
}`,
  c: `#include <stdio.h>
#include <string.h>

void greet(const char* name, char* out) {
    sprintf(out, "Hello, %s!", name);
}

int main() {
    char result[50];
    greet("World", result);
    printf("%s\\n", result);
    return 0;
}`,
  typescript: `function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
  csharp: `using System;

class Program {
    static string Greet(string name) {
        return $"Hello, {name}!";
    }

    static void Main() {
        Console.WriteLine(Greet("World"));
    }
}`,
  go: `package main

import "fmt"

func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

func main() {
    fmt.Println(greet("World"))
}`,
  rust: `fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    println!("{}", greet("World"));
}`,
  php: `<?php
function greet(string $name): string {
    return "Hello, $name!";
}

echo greet("World");`,
};

function getCodeKey(sid: string) {
  return `refactly_code_${sid}`;
}

function generateTitleFromCode(code: string): string {
  const lines = code.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    const fnMatch = trimmed.match(/(?:def|function|fn|func)\s+(\w+)/);
    if (fnMatch) return fnMatch[1];
    const classMatch = trimmed.match(/class\s+(\w+)/);
    if (classMatch) return classMatch[1];
  }
  return "Untitled Session";
}

export function EditorPage() {
  useEffect(() => { warmUpServer(); }, []);

  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [language, setLanguage] = useState("python");
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [fixedKeys, setFixedKeys] = useState<Set<string>>(new Set());
  const [needsReview, setNeedsReview] = useState(false);
  const [title, setTitle] = useState("Untitled Session");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [dbSessionId, setDbSessionId] = useState<string | null>(null);
  const [editorCode, setEditorCode] = useState(SAMPLE_CODES.python);
  const editorRef = useRef<MonacoEditorHandle>(null);
  const titleRef = useRef(title);
  titleRef.current = title;
  const codeRef = useRef(editorCode);
  codeRef.current = editorCode;

  // Persist last session id whenever dbSessionId changes
  useEffect(() => {
    if (dbSessionId) localStorage.setItem(LS_LAST_SESSION, dbSessionId);
  }, [dbSessionId]);

  // Load or create session on mount
  useEffect(() => {
    if (!sessionId || sessionId === "session-2048") {
      createSession({ language, code: editorRef.current?.getCode() })
        .then((s) => {
          setDbSessionId(s.id);
          navigate(`/editor/${s.id}`, { replace: true });
        })
        .catch(() => {/* silently fail */});
    } else {
      // Restore code from localStorage
      const saved = localStorage.getItem(getCodeKey(sessionId));
      if (saved) setEditorCode(saved);
      fetchSession(sessionId)
        .then((s) => {
          setDbSessionId(s.id);
          setTitle(s.title || "Untitled Session");
          setLanguage(s.language);
          if (s.code && !saved) setEditorCode(s.code);
        })
        .catch(() => {
          // Ephemeral or failed fetch — keep the id, use defaults
          setDbSessionId(sessionId);
        });
    }
  }, [sessionId]);

  // Apply loaded code to editor when it becomes available
  useEffect(() => {
    if (editorCode) editorRef.current?.setCode(editorCode);
  }, [editorCode, dbSessionId]);

  const handleLanguageChange = useCallback((newLang: string) => {
    const currentCode = editorRef.current?.getCode() || editorCode;
    const oldSample = SAMPLE_CODES[language];
    // If user is still on the old sample code, swap to new language's sample
    if (oldSample && currentCode.trim() === oldSample.trim()) {
      const newSample = SAMPLE_CODES[newLang] || "";
      setEditorCode(newSample);
      if (dbSessionId) localStorage.setItem(getCodeKey(dbSessionId), newSample);
    }
    setLanguage(newLang);
  }, [language, editorCode, dbSessionId]);

  const handleCodeChange = useCallback(() => {
    setNeedsReview(true);
    const code = editorRef.current?.getCode() || "";
    setEditorCode(code);
    if (dbSessionId) localStorage.setItem(getCodeKey(dbSessionId), code);
  }, [dbSessionId]);

  const onFixApplied = (line: number, message: string) => {
    const key = `${line}-${message}`;
    setFixedKeys((prev) => new Set(prev).add(key));
    setNeedsReview(true);
    // Save code after fix
    const code = editorRef.current?.getCode() || "";
    setEditorCode(code);
    if (dbSessionId) localStorage.setItem(getCodeKey(dbSessionId), code);
  };

  const handleNewSession = useCallback(() => {
    const defaultLang = "python";
    const defaultCode = SAMPLE_CODES[defaultLang];
    createSession({ language: defaultLang, code: defaultCode })
      .then((s) => {
        setDbSessionId(s.id);
        setEditorCode(defaultCode);
        setTitle("Untitled Session");
        setLanguage(defaultLang);
        setReviewResult(null);
        setReviewError(null);
        setFixedKeys(new Set());
        setNeedsReview(false);
        navigate(`/editor/${s.id}`);
      })
      .catch(() => showOldMoneyToast("Failed to create new session"));
  }, [navigate]);

  const handleReview = async () => {
    setNeedsReview(false);
    const code = editorRef.current?.getCode() || codeRef.current;
    if (!code) {
      showOldMoneyToast("No code to review.");
      return;
    }
    setIsReviewing(true);
    setReviewError(null);
    setReviewResult(null);
    setActiveTab("AI Review");
    try {
      const result = await triggerReview(code, language, dbSessionId ?? undefined);
      setReviewResult(result);

      // Persist session id from response
      if (result.sessionId && result.sessionId !== dbSessionId) {
        setDbSessionId(result.sessionId);
        localStorage.setItem(getCodeKey(result.sessionId), code);
        navigate(`/editor/${result.sessionId}`, { replace: true });
      }

      // Auto-name session if still untitled
      if (titleRef.current === "Untitled Session") {
        const generated = generateTitleFromCode(code);
        setTitle(generated);
        const sid = result.sessionId || dbSessionId;
        if (sid) updateSession(sid, { title: generated }).catch(() => {});
      }

      showOldMoneyToast(`Review complete — score: ${result.review.score}/100`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Review failed";
      const friendly = msg === "Failed to fetch"
        ? "Server is not responding — Render free tier may be waking up. Please wait ~30s and try again."
        : msg;
      setReviewError(friendly);
      showOldMoneyToast(friendly);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleFinishEdit = () => {
    setIsEditingTitle(false);
    if (dbSessionId && title !== "Untitled Session") {
      updateSession(dbSessionId, { title }).catch(() => {});
    }
  };

  return (
    <AppLayout>
      <EditorToolbar
        title={title}
        isEditingTitle={isEditingTitle}
        onStartEdit={() => setIsEditingTitle(true)}
        onTitleChange={handleTitleChange}
        onFinishEdit={handleFinishEdit}
        onReviewClick={handleReview}
        onNewSession={handleNewSession}
        isReviewing={isReviewing}
      />
      <div className="grid min-h-[calc(100vh-64px)] xl:grid-cols-[1.55fr_1fr]">
        <div className="border-r border-stone-200 p-3 sm:p-4">
          <Suspense
            fallback={
              <div className="card-old-money flex h-[calc(100vh-120px)] items-center justify-center">
                <div className="text-center">
                  <p className="eyebrow">Loading Editor</p>
                  <p className="mt-4 font-elegant text-3xl italic text-charcoal-light">
                    Assembling the workspace.
                  </p>
                </div>
              </div>
            }
          >
            <MonacoEditorPanel
              ref={editorRef}
              code={editorCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              needsReview={needsReview}
              onReviewClick={handleReview}
              onCodeChange={handleCodeChange}
            />
          </Suspense>
        </div>
        <aside className="overflow-y-auto border-t border-stone-200 bg-cream-100/80 xl:border-t-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="sticky top-0 z-10 border-b border-stone-200 bg-cream-100/95 px-6 pt-5 backdrop-blur-sm">
              <TabsList>
                {tabs.map((item) => (
                  <TabsTrigger key={item} value={item}>
                    {item}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="p-6">
              <TabsContent value="AI Review">
                <AIFeedbackPanel
                  review={reviewResult?.review ?? null}
                  isLoading={isReviewing && activeTab === "AI Review"}
                  error={reviewError}
                  editorRef={editorRef}
                  fixedKeys={fixedKeys}
                  onFixApplied={onFixApplied}
                />
              </TabsContent>
              <TabsContent value="Security">
                <SecurityPanel
                  issues={reviewResult?.review.securityIssues ?? null}
                  isLoading={isReviewing && activeTab === "Security"}
                  error={reviewError}
                />
              </TabsContent>
              <TabsContent value="Complexity">
                <ComplexityPanel
                  complexity={reviewResult?.review.complexity ?? null}
                  isLoading={isReviewing && activeTab === "Complexity"}
                  error={reviewError}
                />
              </TabsContent>
              <TabsContent value="AST">
                <ASTViewer
                  ast={reviewResult?.ast ?? null}
                  isLoading={isReviewing && activeTab === "AST"}
                  error={reviewError}
                />
              </TabsContent>
            </div>
          </Tabs>
        </aside>
      </div>
    </AppLayout>
  );
}
