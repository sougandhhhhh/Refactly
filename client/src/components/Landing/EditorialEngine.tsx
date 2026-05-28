import { motion } from "framer-motion";
import { BookOpenText, FileText, GitBranch, Layers, ScrollText, Stethoscope } from "lucide-react";
import { GoldDivider } from "@/components/common/GoldDivider";
import { staggerContainer, staggerItem } from "@/lib/data";

const editorialFeatures = [
  { icon: ScrollText, title: "Manuscript-Grade Feedback", copy: "Every review reads like a senior engineer's editorial markup — contextual, precise, and structured as a narrative, not a lint report." },
  { icon: Layers, title: "Multi-Layer Analysis", copy: "AST-level, dependency-graph, and semantic-layer analysis stacked into a single editorial pass. No noise, only signal." },
  { icon: GitBranch, title: "Revision Tracking", copy: "Every review becomes a living document. Track changes, compare revisions, and preserve editorial history across every session." },
  { icon: Stethoscope, title: "Architectural Diagnostics", copy: "Beyond line-level feedback — surface coupling, cohesion drift, and structural debt before they become production incidents." },
  { icon: FileText, title: "Editorial Summaries", copy: "Auto-generated executive summaries that distill hours of review into a reading brief. Shareable, actionable, archival-grade." },
  { icon: BookOpenText, title: "Style Authority", copy: "Train the engine on your team's conventions. It learns your editorial voice and applies it consistently across every PR." },
];

export function EditorialEngine() {
  return (
    <section id="editorial-engine" className="flex min-h-screen items-center border-y border-stone-200 px-6 py-12 md:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="text-center">
          <p className="eyebrow">Editorial Engine</p>
          <h2 className="mt-3 text-4xl leading-none text-charcoal-dark md:text-5xl">
            Code review, reimagined as an editorial discipline.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl leading-relaxed text-charcoal-light">
            Refactly doesn&apos;t lint your code — it reads it. Built on a philosophy borrowed from print publishing, every review is structured, narrated, and curated like a manuscript edit.
          </p>
        </div>
        <GoldDivider label="Capabilities" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {editorialFeatures.map(({ icon: Icon, title, copy }) => (
            <motion.article
              key={title}
              variants={staggerItem}
              className="card-old-money group border-t-2 border-t-gold-muted p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold-glow"
            >
              <Icon className="h-5 w-5 text-gold" strokeWidth={1.4} />
              <h3 className="mt-3 text-2xl text-charcoal-dark">{title}</h3>
              <p className="mt-2 text-base leading-relaxed text-charcoal-light">{copy}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
