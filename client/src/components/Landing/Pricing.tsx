import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/data";

export function Pricing() {
  return (
    <section id="pricing" className="flex min-h-screen items-center border-t border-stone-200 px-6 py-12 md:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="mx-auto max-w-4xl text-center"
      >
        <motion.p variants={staggerItem} className="eyebrow">Pricing</motion.p>
        <motion.h2 variants={staggerItem} className="mt-4 text-4xl leading-none text-charcoal-dark md:text-5xl">
          Entirely free. Always.
        </motion.h2>
        <motion.p variants={staggerItem} className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-charcoal-light">
          No tiers, no paywalls, no &ldquo;enterprise trial.&rdquo; Every feature we build is available to every engineer, every team, every organisation — free of charge. Code review quality shouldn&apos;t depend on your budget.
        </motion.p>
        <motion.p variants={staggerItem} className="mt-10 font-mono text-2xs uppercase tracking-[0.18em] text-charcoal-light/50">
          No credit card required. No time limits. No hidden costs.
        </motion.p>
      </motion.div>
    </section>
  );
}
