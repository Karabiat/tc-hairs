"use client";

import * as React from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Oversized typographic band that translates horizontally as the user scrolls.
 * Three copies make the drift seamless on any viewport width. This is the
 * "T&C HAIRS" moment between the hero and the story.
 */
export function ScrollTextBand({
  words = ["T&C HAIRS"],
  className,
  outline = true,
  speed = 0.35,
}: {
  words?: string[];
  className?: string;
  outline?: boolean;
  speed?: number;
}) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const track = React.useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  React.useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        track.current,
        { xPercent: 0 },
        {
          xPercent: -32,
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      );
    }, wrap);
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reduce, speed]);

  return (
    <div ref={wrap} className={cn("relative select-none overflow-hidden border-y border-white/10 bg-ink py-6 sm:py-8", className)}>
      <div ref={track} className="flex w-max items-center whitespace-nowrap will-change-transform">
        {[0, 1, 2].map((copy) => (
          <div key={copy} className="flex items-center" aria-hidden={copy !== 0}>
            {words.map((word, i) => (
              <React.Fragment key={`${copy}-${word}-${i}`}>
                <span
                  className={cn(
                    "display text-[clamp(3.8rem,12vw,11rem)] leading-[0.85]",
                    outline ? "text-outline" : "text-bone",
                  )}
                >
                  {word}
                </span>
                <span className="mx-6 inline-block h-3 w-3 rounded-full bg-orange sm:mx-10" />
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
