"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PlusIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export function Accordion({
  items,
  className,
}: {
  items: { title: string; body: string | React.ReactNode }[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <div className={cn("divide-y divide-white/10 border-y border-white/10", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${i}`}
              id={`accordion-trigger-${i}`}
            >
              <span className="font-serif text-[15px] italic tracking-[0.01em]">{item.title}</span>
              <PlusIcon
                className={cn(
                  "h-4 w-4 shrink-0 text-bone/60 transition-transform duration-500 ease-expo",
                  isOpen && "rotate-45 text-orange",
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-panel-${i}`}
                  role="region"
                  aria-labelledby={`accordion-trigger-${i}`}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pr-8 text-sm leading-relaxed text-bone/70">{item.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
