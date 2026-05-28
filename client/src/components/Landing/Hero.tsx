import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/data";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden border-b border-stone-200">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-20 md:px-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mx-auto flex flex-1 max-w-4xl flex-col items-center justify-center text-center"
        >
          <motion.h1 variants={staggerItem} className="mt-6 max-w-4xl text-display-sm text-charcoal-dark md:text-display-lg">
            Your Code, Reviewed
            <br />
            with Precision.
          </motion.h1>
          <motion.p variants={staggerItem} className="mt-8 max-w-2xl font-elegant text-3xl italic leading-tight text-charcoal-light md:text-4xl">
            Real-time collaboration. AI-powered feedback.
            <br />
            Built for engineers who take craft seriously.
          </motion.p>
          <motion.div variants={staggerItem} className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link to="/signin?redirect=%2Fdashboard" className="btn-gold">
              Start Reviewing
            </Link>
            <Link to="/signin?redirect=%2Feditor%2Fsession-2048" className="btn-ghost-gold">
              View Demo
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
