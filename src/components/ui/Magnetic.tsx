"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/cn";

/** Wraps a CTA and nudges it toward the cursor with a soft spring. */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 180, damping: 16, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 180, damping: 16, mass: 0.35 });

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    rawY.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={reduce ? undefined : { x, y }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.span>
  );
}
