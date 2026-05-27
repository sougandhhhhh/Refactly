import { motion } from "framer-motion";
import { featureCards, staggerContainer, staggerItem } from "@/lib/data";

export function Features() {
  return (
    <section id="features" className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-10 md:px-10">
      <p className="eyebrow">The Platform</p>
      <h2 className="mt-3 max-w-2xl text-4xl leading-none text-charcoal-dark md:text-5xl">
        Everything you need. Nothing you don&apos;t.
      </h2>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {featureCards.map(({ title, copy, icon: Icon }) => (
          <motion.article
            key={title}
            variants={staggerItem}
            className="card-old-money group border-t-2 border-t-gold-muted p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold-glow"
          >
            <Icon className="h-4 w-4 text-gold" strokeWidth={1.4} />
            <h3 className="mt-3 text-2xl text-charcoal-dark">{title}</h3>
            <p className="mt-2 text-base leading-relaxed text-charcoal-light">{copy}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
