"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/cn";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Word-by-word masked reveal. Each word sits in an overflow-hidden sleeve so
 * it rises from below its own baseline. Screen readers get one clean label.
 */
export function RevealText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.055,
  once = true,
}: {
  text: string;
  as?: React.ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      {/*
        The observer must sit on an untransformed element. Each word is
        translated outside its overflow-hidden sleeve before it animates, so
        observing the word itself would report zero intersection forever.
      */}
      <motion.span
        aria-hidden
        className="block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-8% 0px -8% 0px" }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden pb-[0.09em] -mb-[0.09em] align-bottom"
          >
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: "115%", opacity: 0 },
                visible: { y: "0%", opacity: 1 },
              }}
              transition={{ duration: 0.9, delay: delay + i * stagger, ease }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Simple fade/rise for supporting content. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn(className)}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Clip-path image/scene reveal used for editorial panels. */
export function RevealMask({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 1.25, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {/*
        The clip lives on an inner element: a clip-path of inset(0 0 100%) gives
        the element zero intersection area, so an IntersectionObserver on it
        would never report it as visible and the reveal would never run.
      */}
      <motion.div
        className="h-full w-full overflow-hidden"
        variants={{
          hidden: { clipPath: "inset(0 0 100% 0)" },
          shown: { clipPath: "inset(0 0 0% 0)" },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
