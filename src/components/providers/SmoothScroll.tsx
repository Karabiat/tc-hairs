"use client";

import * as React from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis smooth scroll, wired into GSAP's ticker so ScrollTrigger and Lenis
 * share a single animation loop. Disabled entirely for reduced motion.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.095,
      wheelMultiplier: 1,
      touchMultiplier: 1.3,
      smoothWheel: true,
    });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();

    /**
     * One delegated handler for both `#section` and same-page `/#section`
     * links. Capture phase means it runs before Next's Link handler, so
     * footer/nav anchors glide through Lenis instead of triggering a route
     * navigation and a hash jump. Links inside dialogs are left alone.
     */
    const onAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.closest('[role="dialog"]')) return;

      const href = anchor.getAttribute("href") ?? "";
      let id: string | null = null;
      if (href.startsWith("#")) id = href.slice(1);
      else if (href.startsWith("/#") && window.location.pathname === "/") id = href.slice(2);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -76, duration: 1.3 });
      try {
        window.history.replaceState(null, "", `/#${id}`);
      } catch {
        /* history can be unavailable in sandboxed frames */
      }
    };

    window.addEventListener("load", refresh);
    document.addEventListener("click", onAnchorClick, true);
    const delayed = window.setTimeout(refresh, 600);
    const afterTransition = window.setTimeout(refresh, 1300);
    document.fonts?.ready.then(refresh).catch(() => undefined);

    return () => {
      window.clearTimeout(delayed);
      window.clearTimeout(afterTransition);
      window.removeEventListener("load", refresh);
      document.removeEventListener("click", onAnchorClick, true);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // Recalculate pinned sections after client-side navigation, and honour hashes.
  React.useEffect(() => {
    const refresh = window.setTimeout(() => {
      ScrollTrigger.refresh();
      const hash = window.location.hash.slice(1);
      if (hash) {
        const target = document.getElementById(hash);
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 76;
          if (window.__lenis) window.__lenis.scrollTo(top, { immediate: true });
          else window.scrollTo({ top });
        }
      }
    }, 440);
    return () => window.clearTimeout(refresh);
  }, [pathname]);

  return null;
}
