import { lazy, Suspense } from "react";
import { EditorToolbar } from "@/components/Editor/EditorToolbar";
import { AppLayout } from "@/components/Layout/AppLayout";
import { AIFeedbackPanel } from "@/components/Review/AIFeedbackPanel";
import { ASTViewer } from "@/components/Review/ASTViewer";
import { ComplexityPanel } from "@/components/Review/ComplexityPanel";
import { SecurityPanel } from "@/components/Review/SecurityPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = ["AI Review", "Security", "Complexity", "AST"] as const;
const MonacoEditorPanel = lazy(async () => {
  const module = await import("@/components/Editor/MonacoEditorPanel");
  return { default: module.MonacoEditorPanel };
});

export function EditorPage() {
  return (
    <AppLayout>
      <EditorToolbar />
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
            <MonacoEditorPanel />
          </Suspense>
        </div>
        <aside className="overflow-y-auto border-t border-stone-200 bg-cream-100/80 xl:border-t-0">
          <Tabs defaultValue={tabs[0]} className="h-full">
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
                <AIFeedbackPanel />
              </TabsContent>
              <TabsContent value="Security">
                <SecurityPanel />
              </TabsContent>
              <TabsContent value="Complexity">
                <ComplexityPanel />
              </TabsContent>
              <TabsContent value="AST">
                <ASTViewer />
              </TabsContent>
            </div>
          </Tabs>
        </aside>
      </div>
    </AppLayout>
  );
}
