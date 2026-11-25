"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { ButtonLink } from "@/components/ui/Button";
import { StarIcon } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/lib/hooks";

export function Hero() {
  const root = React.useRef<HTMLElement>(null);
  const eyebrow = React.useRef<HTMLParagraphElement>(null);
  const intro = React.useRef<HTMLParagraphElement>(null);
  const rating = React.useRef<HTMLDivElement>(null);
  const meta = React.useRef<HTMLDivElement>(null);
  const back = React.useRef<HTMLSpanElement>(null);
  const front = React.useRef<HTMLSpanElement>(null);
  const ctas = React.useRef<HTMLDivElement>(null);
  const cue = React.useRef<HTMLDivElement>(null);
  const rule = React.useRef<HTMLSpanElement>(null);
  const photo = React.useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  React.useLayoutEffect(() => {
    if (reduce || !root.current) return;
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ delay: 0.32, defaults: { ease: "power3.out" } });

      gsap.set([eyebrow.current, intro.current, rating.current, meta.current], { y: 16, opacity: 0 });
      gsap.set([ctas.current, cue.current], { y: 26, opacity: 0 });
      gsap.set(back.current, { yPercent: 16, opacity: 0 });
      gsap.set(front.current, { yPercent: 118 });
      gsap.set(photo.current, { opacity: 0, scale: 1.07 });

      timeline
        .to(rule.current, { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0)
        .to(photo.current, { opacity: 1, scale: 1, duration: 1.9, ease: "power2.out" }, 0.05)
        .to(eyebrow.current, { y: 0, opacity: 1, duration: 0.8 }, 0.15)
        .to(back.current, { yPercent: 0, opacity: 1, duration: 1.5 }, 0.2)
        .to(meta.current, { y: 0, opacity: 1, duration: 0.8 }, 0.5)
        .to(front.current, { yPercent: 0, duration: 1.25, ease: "power4.out" }, 0.48)
        .to(intro.current, { y: 0, opacity: 1, duration: 0.9 }, 0.72)
        .to(rating.current, { y: 0, opacity: 1, duration: 0.8 }, 0.84)
        .to(ctas.current, { y: 0, opacity: 1, duration: 0.9 }, 0.86)
        .to(cue.current, { y: 0, opacity: 1, duration: 0.8 }, 1.0);

      // A slow drift on the photograph as the page leaves the hero.
      gsap.to(photo.current, {
        yPercent: 7,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 glow-orange" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,#1b1412_0%,transparent_20%,transparent_74%,#1b1412_100%)]"
      />

      <h1 id="hero-title" className="sr-only">
        T&amp;C Hairs — luxury wigs and hair extensions, hand-finished in London
      </h1>

      {/* Oversized word behind the portrait */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[17vh] z-0 flex justify-center sm:top-[15vh]"
      >
        <div className="overflow-hidden pb-[0.06em]">
          <span
            ref={back}
            className="display block whitespace-nowrap text-[clamp(8rem,46vw,40rem)] leading-[0.62] text-bone/[0.1]"
          >
            T&amp;C
          </span>
        </div>
      </div>

      {/* Campaign portrait, feathered into the ink */}
      <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 top-[25vh] flex justify-center sm:top-0">
          <div
            ref={photo}
            className="relative h-full w-[92vw] max-w-[620px] sm:w-[66vw] lg:w-[38vw] lg:max-w-[560px]"
          >
            <Image
              src="/images/hero-editorial.jpg"
              alt="Model with a copper auburn bob, photographed against a terracotta backdrop"
              fill
              priority
              sizes="(min-width: 1024px) 38vw, (min-width: 640px) 66vw, 92vw"
              className="object-cover object-[50%_12%]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_right,#1b1412_0%,transparent_16%,transparent_84%,#1b1412_100%)]"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-ink via-ink/25 to-transparent sm:h-32 sm:via-ink/40"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink via-ink/60 to-transparent"
            />
          </div>
        </div>
      </div>

      {/* Oversized word in front of the portrait */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[196px] z-20 flex justify-center min-[390px]:bottom-[132px] sm:bottom-[92px]"
      >
        <div className="overflow-hidden pb-[0.1em]">
          <span
            ref={front}
            className="display block whitespace-nowrap text-[clamp(4.6rem,26vw,30rem)] leading-[0.78] text-bone sm:text-[clamp(6rem,30vw,30rem)]"
          >
            Hairs<span className="text-orange">.</span>
          </span>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-44 bg-gradient-to-t from-ink via-ink/55 to-transparent"
      />

      <div className="relative z-30 flex min-h-[100svh] flex-col justify-between px-5 pb-7 pt-[108px] sm:px-8 sm:pb-9 lg:px-12 lg:pt-[124px]">
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-[330px]">
            <p ref={eyebrow} className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              Luxury hair atelier — London
            </p>
            <p
              ref={intro}
              className="mt-5 hidden max-w-[280px] text-[13px] leading-relaxed text-bone/65 sm:block"
            >
              Single-donor hair. Hand-knotted HD lace. A mirror shine that reads as
              health — never effort.
            </p>
            <div
              ref={rating}
              className="mt-5 hidden items-center gap-2.5 font-serif text-[13px] italic tracking-[0.01em] text-bone/55 sm:flex"
            >
              <span className="flex gap-0.5 text-orange">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-2 w-2" />
                ))}
              </span>
              4.9 / 5 · 2,400+ crowns
            </div>
          </div>

          <div ref={meta} className="hidden text-right sm:block">
            <p className="font-serif text-sm italic tracking-[0.02em] text-bone/55">The Crown Edit</p>
            <p className="mt-1 font-serif text-xl italic text-bone/70">Vol. 01</p>
            <span
              ref={rule}
              className="mt-4 ml-auto block h-px w-16 origin-right bg-orange/60"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div ref={ctas} className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <ButtonLink href="/#collection" size="md" className="backdrop-blur-sm">
              Shop the Collection
            </ButtonLink>
            <ButtonLink href="/#story" variant="ghost" size="md">
              Our Story
            </ButtonLink>
          </div>

          <div ref={cue} className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-3">
            <span className="font-serif text-[13px] italic tracking-[0.02em] text-bone/55">
              Scroll to reveal
            </span>
            <span className="relative h-px w-14 overflow-hidden bg-white/15 sm:h-14 sm:w-px">
              <span className="absolute inset-0 animate-pulse bg-orange" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
