"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Each navigation gets a quick editorial "curtain lift" while the new page
 * settles in. Kept short so it never feels like a blocker.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[85] origin-top bg-orange"
        initial={reduce ? { scaleY: 0 } : { scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
      />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        {children}
      </motion.div>
    </>
  );
}
