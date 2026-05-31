import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { EditorToolbar } from "@/components/Editor/EditorToolbar";
import type { MonacoEditorHandle } from "@/components/Editor/MonacoEditorPanel";
import { AppLayout } from "@/components/Layout/AppLayout";
import { AIFeedbackPanel } from "@/components/Review/AIFeedbackPanel";
import { ASTViewer } from "@/components/Review/ASTViewer";
import { ComplexityPanel } from "@/components/Review/ComplexityPanel";
import { SecurityPanel } from "@/components/Review/SecurityPanel";
import { showOldMoneyToast } from "@/components/common/Toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { triggerReview, warmUpServer, type ReviewResult } from "@/lib/api";

const tabs = ["AI Review", "Security", "Complexity", "AST"] as const;
const MonacoEditorPanel = lazy(async () => {
  const module = await import("@/components/Editor/MonacoEditorPanel");
  return { default: module.MonacoEditorPanel };
});

export function EditorPage() {
  useEffect(() => { warmUpServer(); }, []);

  const [language, setLanguage] = useState("python");
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [fixedKeys, setFixedKeys] = useState<Set<string>>(new Set());
  const editorRef = useRef<MonacoEditorHandle>(null);

  const onFixApplied = (line: number, message: string) => {
    const key = `${line}-${message}`;
    setFixedKeys((prev) => new Set(prev).add(key));
  };

  const handleReview = async () => {
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
      const result = await triggerReview(code, language);
      setReviewResult(result);
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

  return (
    <AppLayout>
      <EditorToolbar onReviewClick={handleReview} isReviewing={isReviewing} />
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
            <MonacoEditorPanel ref={editorRef} language={language} onLanguageChange={setLanguage} />
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
