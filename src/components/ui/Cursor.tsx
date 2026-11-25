"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import * as React from "react";
import { useMediaQuery } from "@/lib/hooks";

/**
 * A single orange cursor: a small dot that grows into a 64px disc over
 * interactive elements, with an optional label ("VIEW", "DRAG").
 * Only mounts for fine pointers and never replaces keyboard focus.
 */
export function Cursor() {
  const fine = useMediaQuery("(pointer: fine)");
  const reduce = useReducedMotion();
  const [hover, setHover] = React.useState(false);
  const [label, setLabel] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { stiffness: 700, damping: 48, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 700, damping: 48, mass: 0.35 });

  React.useEffect(() => {
    if (!fine || reduce) return;
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor]",
      );
      if (target) {
        setHover(true);
        setLabel(target.dataset.cursorLabel ?? "");
      } else {
        setHover(false);
        setLabel("");
      }
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [fine, reduce, rawX, rawY]);

  if (!fine || reduce) return null;

  const size = label ? 74 : hover ? 56 : 26;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[220]"
      style={{ x, y, opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
        animate={{
          width: size,
          height: size,
          scale: pressed ? 0.86 : 1,
          backgroundColor: hover ? "rgba(255,90,0,1)" : "rgba(255,90,0,0)",
          borderColor: hover ? "rgba(243,237,228,0.9)" : "rgba(255,90,0,0.65)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.5 }}
      >
        {label ? (
          <span className="select-none text-[10px] font-semibold tracking-[0.04em] text-ink">
            {label}
          </span>
        ) : (
          <motion.span
            className="block rounded-full bg-orange"
            animate={{ width: hover ? 5 : 4, height: hover ? 5 : 4 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
