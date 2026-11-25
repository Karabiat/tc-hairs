"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText, Reveal } from "@/components/ui/RevealText";
import { SparkIcon } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/lib/hooks";

const CHAPTERS = [
  {
    index: "01",
    kicker: "The atelier",
    title: "Thirty-eight hours. One pair of hands.",
    body: "Each crown is built on a breathable lace cap, in a studio above a flower market in East London. Every knot is tied by hand. No production line, no shortcuts — just a quiet, obsessive ritual.",
    stat: "38 hrs",
    statLabel: "hand-tied per unit",
    image: "/images/story-craft.jpg",
    imageAlt:
      "The wig atelier, hung with bundles of hair, where a stylist in an orange dress arranges a long dark wig",
    captionTop: "The bench · East London",
    captionBottom: "Atelier series — 01",
  },
  {
    index: "02",
    kicker: "The source",
    title: "One donor. One direction.",
    body: "We buy raw, single-donor hair with the cuticle intact and aligned tip to root. It is the difference between hair that tangles by noon and hair that falls like water for years.",
    stat: "100%",
    statLabel: "cuticle aligned",
    image: "/images/story-source.jpg",
    imageAlt:
      "Long, dark, single-donor hair falling down a model's back in soft daylight",
    captionTop: "Single donor · virgin Remy",
    captionBottom: "Source series — 02",
  },
  {
    index: "03",
    kicker: "The confidence",
    title: "Measured to your crown.",
    body: "Your head is not a size. We map circumference, density and hairline, then adjust the cap, the part and the cut before it leaves the atelier. The first time you catch your reflection and don't adjust it — that's the point.",
    stat: "05",
    statLabel: "fittings to your head",
    image: "/images/story-fit.jpg",
    imageAlt:
      "Copper auburn bob wig in profile, on a bare-shouldered model against a bone backdrop",
    captionTop: "The fitting · by appointment",
    captionBottom: "Fit series — 03",
  },
];

export function Story() {
  const section = React.useRef<HTMLElement>(null);
  const pin = React.useRef<HTMLDivElement>(null);
  const stepsRef = React.useRef<HTMLDivElement>(null);
  const bar = React.useRef<HTMLSpanElement>(null);
  const chapterRef = React.useRef(0);
  const [chapter, setChapter] = React.useState(0);
  const reduce = usePrefersReducedMotion();

  React.useLayoutEffect(() => {
    if (reduce || !pin.current || !stepsRef.current) return;

    const steps = Array.from(stepsRef.current.querySelectorAll<HTMLElement>(".story-step"));
    const mm = gsap.matchMedia();

    const update = (value: number) => {
      if (bar.current) bar.current.style.transform = `scaleX(${value})`;
      const next = value < 0.34 ? 0 : value < 0.67 ? 1 : 2;
      if (next !== chapterRef.current) {
        chapterRef.current = next;
        setChapter(next);
      }
    };

    // Desktop: a pinned, scrubbed three-chapter timeline.
    mm.add("(min-width: 1024px)", () => {
      gsap.set(steps, { autoAlpha: 0, y: 36 });
      gsap.set(steps[0], { autoAlpha: 1, y: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: pin.current,
          start: "top top",
          end: "+=3000",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => update(self.progress),
        },
      });

      tl.to(steps[0], { autoAlpha: 0, y: -36, duration: 0.9 }, 1)
        .to(steps[1], { autoAlpha: 1, y: 0, duration: 0.9 }, 1.15)
        .to(steps[1], { autoAlpha: 0, y: -36, duration: 0.9 }, 2.45)
        .to(steps[2], { autoAlpha: 1, y: 0, duration: 0.9 }, 2.6);

      return () => {
        tl.kill();
        gsap.set(steps, { clearProps: "all" });
      };
    });

    // Mobile: photographs stay at the top of the narrative, chapters reveal.
    mm.add("(max-width: 1023px)", () => {
      const st = ScrollTrigger.create({
        trigger: pin.current,
        start: "top 70%",
        end: "bottom bottom",
        onUpdate: (self) => update(self.progress),
      });

      const tweens = steps.map((step) =>
        gsap.from(step, {
          opacity: 0,
          y: 26,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: step, start: "top 88%", once: true },
        }),
      );

      return () => {
        st.kill();
        tweens.forEach((tween) => tween.kill());
      };
    });

    return () => mm.revert();
  }, [reduce]);

  const active = CHAPTERS[chapter];

  return (
    <section ref={section} id="story" className="relative overflow-hidden bg-ink">
      <div className="container-x relative z-10 pb-14 pt-20 sm:pt-28 lg:pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <SectionLabel index="01">The making of a crown</SectionLabel>
            <h2 className="mt-7">
              <RevealText
                as="span"
                text="Made like"
                className="display block text-[clamp(3.4rem,9vw,8.4rem)] leading-[0.82]"
              />
              <span className="mt-1 block overflow-hidden">
                <RevealText
                  as="span"
                  text="it's yours."
                  className="block font-serif text-[clamp(3.6rem,9.5vw,9rem)] italic leading-[0.9] tracking-[-0.02em] text-orange"
                  delay={0.1}
                />
              </span>
            </h2>
          </div>
          <Reveal className="max-w-sm lg:pb-3" delay={0.15}>
            <p className="text-sm leading-relaxed text-bone/70">
              A crown is not an accessory. It&apos;s the first thing people see and the last
              thing you think about. So we build it the long way — by hand, by appointment,
              and only once.
            </p>
            <div className="mt-7 flex items-center gap-3 font-serif text-[13px] italic tracking-[0.02em] text-bone/55">
              <span className="h-px w-10 bg-orange" />
              London atelier — est. 2016
            </div>
          </Reveal>
        </div>
      </div>

      <div ref={pin} className="relative border-t border-white/10 lg:h-[100svh]">
        <div className="grid lg:h-full lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative flex flex-col justify-between px-5 pb-10 pt-12 sm:px-8 lg:px-12 lg:pb-12 lg:pt-28">
            <div className="flex items-center justify-between gap-4">
              <p className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                Chapter {active.index} — {active.kicker}
              </p>
              <span className="text-[9px] uppercase tracking-[0.28em] text-bone/35 lg:hidden">
                {active.index} / 03
              </span>
            </div>

            <div ref={stepsRef} className="relative mt-10 lg:mt-0 lg:min-h-[440px]">
              {CHAPTERS.map((step, i) => (
                <div
                  key={step.index}
                  className="story-step lg:absolute lg:inset-0 lg:flex lg:flex-col lg:justify-center"
                  data-visible={i === 0 ? "true" : "false"}
                >
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="font-display text-[clamp(3.5rem,7vw,6.5rem)] leading-none text-orange">
                      {step.index}
                    </span>
                    <span className="font-serif text-[13px] italic tracking-[0.02em] text-bone/55">
                      {step.kicker}
                    </span>
                  </div>
                  <h3 className="mt-6 max-w-lg font-display text-[clamp(2.4rem,4.4vw,4.6rem)] leading-[1.02] tracking-[-0.01em]">
                    {step.title}
                  </h3>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-bone/70">{step.body}</p>
                  <div className="mt-7 flex items-center gap-4">
                    <span className="font-serif text-[clamp(1.8rem,3vw,2.8rem)] italic leading-none text-bone/90">
                      {step.stat}
                    </span>
                    <span className="max-w-[130px] text-[9px] uppercase leading-relaxed tracking-[0.16em] text-bone/50">
                      {step.statLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-5 lg:mt-0">
              <div className="relative h-px flex-1 overflow-hidden bg-white/10">
                <span
                  ref={bar}
                  className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-orange"
                />
              </div>
              <span className="text-[9px] uppercase tracking-[0.28em] text-bone/35">
                {active.index} / 03
              </span>
            </div>

            <div className="mt-8 hidden items-center gap-2 font-serif text-[13px] italic tracking-[0.02em] text-bone/45 lg:flex">
              <SparkIcon className="h-2.5 w-2.5 text-orange" />
              Keep scrolling — three chapters, one crown
            </div>
          </div>

          <div className="relative h-[54svh] min-h-[380px] overflow-hidden border-t border-white/10 bg-ink-soft sm:h-[60svh] lg:h-full lg:min-h-0 lg:border-l lg:border-t-0">
            <div aria-hidden className="absolute inset-0 glow-orange opacity-70" />

            <AnimatePresence initial={false}>
              <motion.div
                key={active.index}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0, scale: 1.045 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={active.image}
                  alt={active.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 49vw, 100vw"
                  className="object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(27,20,18,0.55)_0%,transparent_28%,transparent_66%,rgba(27,20,18,0.85)_100%)]"
            />

            <span
              aria-hidden
              className="pointer-events-none absolute -left-6 top-1/2 hidden -translate-y-1/2 -rotate-90 text-[9px] uppercase tracking-[0.4em] text-bone/30 lg:block"
            >
              The atelier — in stills
            </span>

            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-7">
              <span className="rounded-full border border-white/15 bg-ink/35 px-3 py-1.5 text-[8px] uppercase tracking-[0.24em] text-bone/60 backdrop-blur">
                {active.captionBottom}
              </span>
              <span className="text-[8px] uppercase tracking-[0.24em] text-orange/80">
                {active.index} / 03
              </span>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-7">
              <span className="max-w-[60%] text-[8px] uppercase tracking-[0.22em] text-bone/55">
                {active.captionTop}
              </span>
              <span className="text-[8px] uppercase tracking-[0.22em] text-bone/40">
                Hand-finished · London
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
