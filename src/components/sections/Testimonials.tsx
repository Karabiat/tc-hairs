"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText, Reveal, RevealMask } from "@/components/ui/RevealText";
import { Marquee } from "@/components/ui/Marquee";
import { ArrowRight, CheckIcon, SparkIcon, StarIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const QUOTES = [
  {
    quote: "I stopped checking my hairline in every photo. That is the whole review.",
    name: "Amara O.",
    city: "London",
    detail: "Wearing Onyx Curl · 20″",
  },
  {
    quote: "It is the first hair I have worn that feels like a decision, not a cover-up.",
    name: "Noémie R.",
    city: "Paris",
    detail: "Wearing Midnight Silk · 24″",
  },
  {
    quote: "My stylist asked who did my hair. I said East London. She said, obviously.",
    name: "Simone A.",
    city: "New York",
    detail: "Wearing Sienna Wave · 22″",
  },
  {
    quote: "Three years, two crowns, zero bad hair days. I have stopped counting the cost per wear.",
    name: "Priya M.",
    city: "Dubai",
    detail: "Wearing Midnight Silk · 30″",
  },
];

const TICKER = [
  "The lace disappeared under studio lights",
  "My clients ask for the T&C hairline by name",
  "Softest bundles I have installed in ten years",
  "No shedding. No tangling. No adjusting.",
  "It matched my base colour better than my own dye",
  "The first wig my boyfriend did not clock",
  "Worth every penny, and I am not a wig person",
  "Thirty-eight hours of work you can actually feel",
];

const TICKER_TWO = [
  "London — verified",
  "Paris — verified",
  "New York — verified",
  "Lagos — verified",
  "Dubai — verified",
  "Accra — verified",
  "Milan — verified",
  "Toronto — verified",
  "Berlin — verified",
  "Los Angeles — verified",
];

const STATS = [
  ["4.9", "Average rating"],
  ["2,400+", "Verified crowns"],
  ["96%", "Would buy again"],
];

export function Testimonials() {
  const [index, setIndex] = React.useState(0);
  const reduce = useReducedMotion();
  const active = QUOTES[index];

  const step = (direction: number) =>
    setIndex((current) => (current + direction + QUOTES.length) % QUOTES.length);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="relative overflow-hidden border-t border-white/10 bg-ink"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 glow-orange opacity-50" />

      <div className="container-x relative z-10 pb-16 pt-20 sm:pt-28">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <SectionLabel index="05">The club</SectionLabel>
            <h2 id="testimonials-title" className="mt-7">
              <RevealText
                as="span"
                text="Seen."
                className="display block text-[clamp(3.4rem,9vw,8.4rem)] leading-[0.82]"
              />
              <span className="mt-1 block overflow-hidden">
                <RevealText
                  as="span"
                  text="never spotted."
                  className="block font-serif text-[clamp(3.2rem,8.6vw,8rem)] italic leading-[0.9] tracking-[-0.02em] text-orange"
                  delay={0.08}
                />
              </span>
            </h2>
          </div>
          <Reveal className="max-w-sm lg:pb-4" delay={0.12}>
            <div className="flex items-center gap-3">
              <span className="flex gap-0.5 text-orange">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-3 w-3" />
                ))}
              </span>
              <span className="font-serif text-[13px] italic tracking-[0.02em] text-bone/60">
                4.9 / 5 — 2,400+ crowns
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-bone/70">
              We do not pay for reviews and we do not edit them. These are the words
              of people who wear the work — on set, on stage, on the school run.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          {/* Portrait */}
          <RevealMask className="relative hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-ink-soft">
              <Image
                src="/images/editorial-profile.jpg"
                alt="Editorial profile of a model wearing a glossy T&C Hairs wig, lit from behind with a warm orange rim"
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover object-center saturate-[0.85]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/10"
              />
              <span className="absolute left-5 top-5 flex items-center gap-2 text-[8px] uppercase tracking-[0.24em] text-bone/70">
                <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                The club — portrait 01
              </span>
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 border-t border-white/20 pt-4">
                <div>
                  <p className="font-display text-2xl leading-none text-bone">Amara O.</p>
                  <p className="mt-1.5 font-serif text-[13px] italic tracking-[0.02em] text-bone/60">
                    London · Onyx Curl
                  </p>
                </div>
                <span className="flex gap-0.5 text-orange">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="h-2 w-2" />
                  ))}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-4 flex items-center gap-3 border border-orange/40 bg-ink px-4 py-3 sm:-right-6">
              <SparkIcon className="h-4 w-4 text-orange" />
              <p className="max-w-[150px] font-serif text-[12px] italic leading-relaxed tracking-[0.02em] text-bone/60">
                Photographed in the East London atelier
              </p>
            </div>
          </RevealMask>

          {/* Quote carousel */}
          <div className="flex min-h-[420px] flex-col justify-between border-t border-white/10 pt-7 lg:min-h-0 lg:border-t-0 lg:pt-0">
            <div className="flex items-center justify-between gap-4">
              <p className="font-serif text-[13px] italic tracking-[0.02em] text-bone/50">
                Verified review — {active.city}
              </p>
              <span className="inline-flex items-center gap-1.5 font-serif text-[12px] italic tracking-[0.02em] text-orange">
                <CheckIcon className="h-3 w-3" />
                Verified buyer
              </span>
            </div>

            <div className="relative mt-8 flex-1">
              <span
                aria-hidden
                className="pointer-events-none absolute -left-2 -top-10 select-none font-serif text-[9rem] leading-none text-orange/20"
              >
                “
              </span>
              <div aria-live="polite" className="relative">
                <AnimatePresence mode="wait">
                  <motion.figure
                    key={active.name}
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <blockquote>
                      <p className="max-w-3xl font-serif text-[clamp(1.9rem,3.9vw,3.9rem)] italic leading-[1.05] tracking-[-0.01em] text-bone">
                        {active.quote}
                      </p>
                    </blockquote>
                    <figcaption className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="font-display text-xl leading-none">
                        {active.name}
                      </span>
                      <span className="h-px w-8 bg-orange" />
                      <span className="font-serif text-[13px] italic tracking-[0.02em] text-bone/55">
                        {active.detail}
                      </span>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between gap-6 border-t border-white/10 pt-5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous review"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-bone/65 transition-colors duration-300 hover:border-orange hover:text-orange"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next review"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-bone/65 transition-colors duration-300 hover:border-orange hover:text-orange"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {QUOTES.map((quote, i) => (
                    <button
                      key={quote.name}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Show review ${i + 1} of ${QUOTES.length}`}
                      aria-pressed={i === index}
                      className="group px-1 py-3"
                    >
                      <span
                        className={cn(
                          "block h-px transition-all duration-500",
                          i === index
                            ? "w-9 bg-orange"
                            : "w-5 bg-bone/20 group-hover:bg-bone/50",
                        )}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-[9px] tabular-nums tracking-[0.2em] text-bone/35">
                  {String(index + 1).padStart(2, "0")} / {String(QUOTES.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Reveal className="mt-16 grid grid-cols-3 divide-x divide-white/10 border-y border-white/10">
          {STATS.map(([value, label]) => (
            <div key={label} className="px-3 py-6 sm:px-6 sm:py-7">
              <p className="font-display text-[clamp(1.9rem,3.6vw,3.2rem)] leading-none tracking-[-0.01em]">
                {value}
              </p>
              <p className="mt-2 font-serif text-[12px] italic tracking-[0.02em] text-bone/50">
                {label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Dual review ticker */}
      <div className="relative z-10 border-t border-white/10">
        <Marquee speed={78} className="border-b border-white/10 py-4">
          {TICKER.map((item) => (
            <span key={item} className="flex items-center">
              <span className="whitespace-nowrap px-6 font-serif text-[13px] italic tracking-[0.02em] text-bone/55 sm:px-9">
                {item}
              </span>
              <StarIcon className="h-2 w-2 shrink-0 text-orange" />
            </span>
          ))}
        </Marquee>
        <Marquee speed={96} reverse className="py-4">
          {TICKER_TWO.map((item) => (
            <span key={item} className="flex items-center">
              <span className="whitespace-nowrap px-6 font-serif text-[12px] italic tracking-[0.03em] text-bone/40 sm:px-9">
                {item}
              </span>
              <span className="h-1 w-1 shrink-0 rounded-full bg-orange/70" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
