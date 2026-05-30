import { Activity, BookOpenText, Braces, ChartSpline, Lock, ScanSearch } from "lucide-react";

export const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const slideIn = {
  hidden: { x: 20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const featureCards = [
  { title: "AI Review Engine", copy: "Context-aware reviews that read like senior engineering feedback, not generic lint output.", icon: BookOpenText },
  { title: "Real-time Collab", copy: "Presence, comments, and shared sessions for teams reviewing critical code together.", icon: Activity },
  { title: "AST Visualizer", copy: "See the architecture beneath the syntax with editorial-grade structure maps.", icon: Braces },
  { title: "Security Scanner", copy: "Quietly opinionated security checks that surface exploit paths before deployment.", icon: Lock },
  { title: "Complexity Analysis", copy: "Function-level complexity views for engineers who care about long-term maintainability.", icon: ChartSpline },
  { title: "Code Quality Score", copy: "A weighted score blending readability, correctness, performance, and security.", icon: ScanSearch },
];
