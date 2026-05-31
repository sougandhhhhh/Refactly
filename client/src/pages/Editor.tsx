import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
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

function generateTitleFromCode(code: string): string {
  const lines = code.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    const fnMatch = trimmed.match(/(?:def|function|fn|func)\s+(\w+)/);
    if (fnMatch) return fnMatch[1];
    const classMatch = trimmed.match(/class\s+(\w+)/);
    if (classMatch) return classMatch[1];
    const commentMatch = trimmed.match(/#\s*(.+)/);
    if (commentMatch) return commentMatch[1].slice(0, 60);
  }
  const words = code.replace(/[^a-zA-Z ]/g, " ").split(/\s+/).filter(Boolean);
  return words.slice(0, 6).join(" ").slice(0, 60) || "Untitled Session";
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
  const editorRef = useRef<MonacoEditorHandle>(null);
  const titleRef = useRef(title);
  titleRef.current = title;

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
      fetchSession(sessionId)
        .then((s) => {
          setDbSessionId(s.id);
          setTitle(s.title);
          setLanguage(s.language);
        })
        .catch(() => {
          createSession({ language, code: editorRef.current?.getCode() })
            .then((s) => {
              setDbSessionId(s.id);
              navigate(`/editor/${s.id}`, { replace: true });
            })
            .catch(() => {/* silently fail */});
        });
    }
  }, [sessionId]);

  const onFixApplied = (line: number, message: string) => {
    const key = `${line}-${message}`;
    setFixedKeys((prev) => new Set(prev).add(key));
    setNeedsReview(true);
  };

  const handleNewSession = useCallback(() => {
    createSession({ language, code: editorRef.current?.getCode() })
      .then((s) => {
        setDbSessionId(s.id);
        setTitle("Untitled Session");
        setReviewResult(null);
        setReviewError(null);
        setFixedKeys(new Set());
        setNeedsReview(false);
        navigate(`/editor/${s.id}`);
      })
      .catch(() => showOldMoneyToast("Failed to create new session"));
  }, [language, navigate]);

  const handleReview = async () => {
    setNeedsReview(false);
    const code = editorRef.current?.getCode();
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
              language={language}
              onLanguageChange={setLanguage}
              needsReview={needsReview}
              onReviewClick={handleReview}
              onCodeChange={() => setNeedsReview(true)}
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
