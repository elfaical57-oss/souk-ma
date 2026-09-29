import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35 } },
};

export const stagger = (delayChildren = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delayChildren } },
});

/** Subtle entrance that never hides content if whileInView misses. */
export const cardVariant: Variants = {
  hidden: { opacity: 1, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
};
