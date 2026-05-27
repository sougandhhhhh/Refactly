import { lazy, Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoldDivider } from "@/components/common/GoldDivider";

const MonacoEditorPanel = lazy(async () => {
  const module = await import("@/components/Editor/MonacoEditorPanel");
  return { default: module.MonacoEditorPanel };
});

export function EditorPreview() {
  const navigate = useNavigate();

  return (
    <section className="border-y border-stone-200 bg-stone-100/40 px-6 py-24 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 xl:grid-cols-[0.38fr_0.62fr]">
        <div className="pt-4">
          <p className="eyebrow">Live Demo</p>
          <h2 className="mt-5 text-5xl leading-none text-charcoal-dark">An editor worthy of serious review.</h2>
          <p className="mt-6 max-w-md text-xl leading-relaxed text-charcoal-light">
            Quiet visual hierarchy, AST-aware diagnostics, and review context that feels closer to an editorial desk than a startup dashboard.
          </p>
          <GoldDivider label="Callouts" />
          <div className="space-y-6">
            {[
              "Gold-lined diagnostics direct attention without shouting.",
              "Editorial sidebars keep AI feedback readable during deep sessions.",
              "Every code surface uses bespoke typography and restrained motion.",
            ].map((item) => (
              <div key={item} className="flex gap-4">
                <div className="mt-2 h-px w-10 bg-gold" />
                <p className="flex-1 text-xl text-charcoal-light">{item}</p>
              </div>
            ))}
          </div>
          <button
            className="mt-10 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-gold"
            onClick={() => navigate("/signin?redirect=%2Feditor%2Fsession-2048")}
          >
            Explore the live workspace
            <ArrowRight size={14} />
          </button>
        </div>
        <Suspense
          fallback={
            <div className="card-old-money flex h-[500px] items-center justify-center p-8">
              <div className="text-center">
                <p className="eyebrow">Loading Preview</p>
                <p className="mt-4 font-elegant text-3xl italic text-charcoal-light">
                  Preparing the review canvas.
                </p>
              </div>
            </div>
          }
        >
          <MonacoEditorPanel compact />
        </Suspense>
      </div>
    </section>
  );
}
