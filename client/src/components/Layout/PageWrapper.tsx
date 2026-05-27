import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PageWrapperProps = {
  children: ReactNode;
  className?: string;
};

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.main>
  );
}
