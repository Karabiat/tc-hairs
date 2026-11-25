"use client";

import * as React from "react";
import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText, Reveal, RevealMask } from "@/components/ui/RevealText";
import { SparkIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const FEATURES = [
  {
    index: "01",
    title: "A hairline that disappears",
    body: "Each hair is knotted by hand into Swiss HD lace — one at a time, in the direction it grows. No bulk, no grid, no tell.",
    stat: "0.08mm",
    statLabel: "knot gauge",
    callout: "13×6 HD lace frontal",
    x: 34,
    y: 26,
  },
  {
    index: "02",
    title: "One donor. One direction.",
    body: "Cuticle-aligned virgin Remy, traced to a single donor. The cuticles all face the same way, so the hair reflects light as one sheet and never tangles against itself.",
    stat: "100%",
    statLabel: "cuticle aligned",
    callout: "Single-donor Remy",
    x: 57,
    y: 54,
  },
  {
    index: "03",
    title: "Density you can feel",
    body: "180–200% density, distributed by hand. Full at the crown, feather-light at the ear. It moves like your own hair because it is built like it.",
    stat: "200%",
    statLabel: "max density",
    callout: "Hand-placed density",
    x: 28,
    y: 72,
  },
];

const STATS = [
  { value: "38", unit: "hrs", label: "Hand-tied per crown" },
  { value: "4×", unit: "", label: "Magnification inspection" },
  { value: "05", unit: "", label: "Fit points measured" },
  { value: "30", unit: "days", label: "Wear-it-home trial" },
];

export function Quality() {
  const [active, setActive] = React.useState(0);

  return (
    <section
      id="quality"
      aria-labelledby="quality-title"
      className="relative overflow-hidden border-t border-white/10 bg-ink-deep"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 glow-orange opacity-60" />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 top-10 select-none font-display text-[24vw] leading-none text-bone/[0.035]"
      >
        02
      </span>

      <div className="container-x relative z-10 pb-16 pt-20 sm:pt-28 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <SectionLabel index="02">The standard</SectionLabel>
            <h2 id="quality-title" className="mt-7">
              <RevealText
                as="span"
                text="Detail is"
                className="display block text-[clamp(3.4rem,9vw,8.4rem)] leading-[0.82]"
              />
              <span className="mt-1 block overflow-hidden">
                <RevealText
                  as="span"
                  text="the difference."
                  className="block font-serif text-[clamp(3.3rem,8.8vw,8.2rem)] italic leading-[0.92] tracking-[-0.02em] text-orange"
                  delay={0.08}
                />
              </span>
            </h2>
          </div>
          <Reveal className="max-w-sm lg:pb-4" delay={0.12}>
            <p className="text-sm leading-relaxed text-bone/70">
              Luxury is not a label. It is the knot you cannot see, the cuticle that
              still faces the right way, the weight that feels like nothing at all.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-bone/50">
              Every crown is inspected under magnification before it is signed,
              boxed and sent to you.
            </p>
            <div className="mt-7 flex items-center gap-3 font-serif text-[13px] italic tracking-[0.02em] text-bone/55">
              <SparkIcon className="h-3 w-3 text-orange" />
              Signed by the maker
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          {/* Macro panel with interactive callouts. */}
          <RevealMask className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/10 bg-ink-soft sm:aspect-[5/5] lg:aspect-[4/5]">
              <Image
                src="/images/quality-lace.jpg"
                alt="Lace-front wig with the transparent HD mesh visible along the hairline under warm studio light"
                fill
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover object-center brightness-[1.28] contrast-[1.06] saturate-[1.02]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,transparent_20%,rgba(16,12,11,0.55)_100%)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-deep via-ink-deep/30 to-transparent"
              />

              <div className="pointer-events-none absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-ink/40 px-3 py-1.5 text-[8px] uppercase tracking-[0.22em] text-bone/70 backdrop-blur sm:left-6 sm:top-6">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange" />
                Hairline study — 04
              </div>

              {/* Callouts are decorative duplicates of the feature copy below. */}
              <div aria-hidden className="hidden lg:block">
                {FEATURES.map((feature, i) => (
                  <div
                    key={feature.index}
                    className={cn(
                      "absolute z-20 -translate-y-1/2 transition-opacity duration-500",
                      active === i ? "opacity-100" : "opacity-30",
                    )}
                    style={{ left: `${feature.x}%`, top: `${feature.y}%` }}
                  >
                    <span className="relative flex h-3 w-3 items-center justify-center">
                      {active === i && (
                        <span className="absolute inset-0 animate-ping rounded-full border border-orange/70" />
                      )}
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full transition-colors duration-500",
                          active === i ? "bg-orange" : "bg-bone/60",
                        )}
                      />
                    </span>
                    <span className="absolute left-1.5 top-1/2 h-px w-10 origin-left bg-orange/50" />
                    <span className="absolute left-12 top-1/2 w-[130px] -translate-y-1/2 text-[8px] uppercase leading-relaxed tracking-[0.16em] text-bone/70">
                      {feature.callout}
                    </span>
                  </div>
                ))}
              </div>

              <div className="absolute inset-x-4 bottom-4 z-20 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.3em] text-orange">The lace</p>
                  <p className="mt-1 max-w-[220px] text-[11px] leading-relaxed text-bone/70">
                    Swiss HD mesh, tinted to disappear against every skin tone.
                  </p>
                </div>
                <p className="hidden shrink-0 text-right text-[8px] uppercase leading-relaxed tracking-[0.2em] text-bone/35 sm:block">
                  Hand-tied
                  <br />
                  London atelier
                </p>
              </div>
            </div>
          </RevealMask>

          {/* Feature list drives the callouts. */}
          <div className="flex flex-col justify-between gap-8">
            <div>
              {FEATURES.map((feature, i) => {
                const isActive = active === i;
                return (
                  <button
                    key={feature.index}
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-pressed={isActive}
                    className={cn(
                      "group block w-full border-t border-white/10 py-6 text-left transition-colors duration-500 first:border-t-0 first:pt-0 sm:py-7",
                      isActive ? "text-bone" : "text-bone/55 hover:text-bone/80",
                    )}
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex items-baseline gap-4">
                        <span
                          className={cn(
                            "font-display text-lg leading-none transition-colors duration-500",
                            isActive ? "text-orange" : "text-bone/25",
                          )}
                        >
                          {feature.index}
                        </span>
                        <span className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.05] tracking-[-0.01em]">
                          {feature.title}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "mt-1 hidden shrink-0 font-serif text-[12px] italic tracking-[0.02em] transition-opacity duration-500 sm:block",
                          isActive ? "text-orange opacity-100" : "opacity-0",
                        )}
                      >
                        On the image
                      </span>
                    </div>
                    <p className="mt-4 max-w-md text-[13px] leading-relaxed text-bone/60">
                      {feature.body}
                    </p>
                    <div className="mt-5 flex items-center gap-5">
                      <span className="font-serif text-2xl italic leading-none text-bone/85">
                        {feature.stat}
                      </span>
                      <span className="text-[9px] uppercase leading-relaxed tracking-[0.16em] text-bone/50">
                        {feature.statLabel}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "ml-auto h-px bg-orange transition-all duration-700 ease-expo",
                          isActive ? "w-10 opacity-100" : "w-0 opacity-0",
                        )}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="font-serif text-[16px] italic leading-relaxed text-bone/65">
                “You should not be able to find where it starts.”
              </p>
              <p className="mt-2 font-serif text-lg italic text-bone/75">— The atelier standard</p>
            </div>
          </div>
        </div>

        <Reveal className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 sm:mt-16 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-ink-deep px-5 py-6 sm:px-6 sm:py-7">
              <p className="font-display text-[clamp(2.2rem,3.6vw,3.4rem)] leading-none tracking-[-0.01em]">
                {stat.value}
                {stat.unit && <span className="ml-1 text-[0.42em] text-orange">{stat.unit}</span>}
              </p>
              <p className="mt-3 text-[8px] uppercase leading-relaxed tracking-[0.2em] text-bone/40">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
