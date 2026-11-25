"use client";

import * as React from "react";

/** Respect reduced-motion at the component level, not just in CSS. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export type QualityTier = "high" | "medium" | "low";

/**
 * Conservative device capability sniffing: phones and low-core machines get a
 * lighter strand count, capped DPR and fewer shadow passes. Never removes the
 * scene entirely — the 3D moment is the product.
 */
export function useSceneQuality() {
  const [tier, setTier] = React.useState<QualityTier>("medium");

  React.useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

    if (saveData || cores <= 2 || memory <= 2) setTier("low");
    else if (coarse || narrow || cores <= 4 || memory <= 4 || window.innerWidth < 1024) setTier("medium");
    else setTier("high");
  }, []);

  return tier;
}

/** Shared pointer state for the 3D scene; normalised to -0.5…0.5. */
export function useNormalizedPointer(enabled = true) {
  const pointer = React.useRef({ x: 0, y: 0 });
  React.useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);
  return pointer;
}

export function useLockBodyScroll(locked: boolean) {
  React.useEffect(() => {
    if (!locked) return;
    const lenis = window.__lenis;
    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      lenis?.start();
    };
  }, [locked]);
}

/**
 * Accessible dialog behaviour for the cart, menu and search overlays:
 * initial focus, Tab trapping, Escape to close, focus restoration and scroll
 * locking. Applied only while the overlay is open.
 */
export function useDialog(open: boolean, onClose: () => void, ref: React.RefObject<HTMLElement | null>) {
  useLockBodyScroll(open);

  React.useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;

    const focusables = () => {
      const root = ref.current;
      if (!root) return [] as HTMLElement[];
      return Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
    };

    const first = focusables()[0];
    const t = window.setTimeout(() => first?.focus(), 120);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose, ref]);
}

/** Smooth-scroll to an anchor through Lenis when available. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -72, duration: 1.25 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
