"use client";

import * as React from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";
import {
  COLORS,
  TEXTURES,
  colorHex,
  products,
  type Category,
  type ColorName,
  type Texture,
} from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText, Reveal } from "@/components/ui/RevealText";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, SparkIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type LengthKey = "all" | "petite" | "classic" | "long" | "xl";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "wigs", label: "Wigs" },
  { value: "extensions", label: "Extensions" },
];

const LENGTHS: { key: LengthKey; label: string; min: number; max: number }[] = [
  { key: "all", label: "All", min: 0, max: 60 },
  { key: "petite", label: "≤ 14\"", min: 0, max: 14 },
  { key: "classic", label: "16–20\"", min: 15, max: 20 },
  { key: "long", label: "22–26\"", min: 21, max: 26 },
  { key: "xl", label: "28\"+", min: 27, max: 60 },
];

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-serif text-[13px] italic tracking-[0.02em] text-bone/55">{label}</span>
      <div className="flex flex-wrap items-center gap-1.5">{children}</div>
    </div>
  );
}

const chip =
  "rounded-full border px-3.5 py-1.5 text-[11px] tracking-[0.05em] transition-colors duration-300";

export function Collection() {
  const [category, setCategory] = React.useState<Category>("wigs");
  const [texture, setTexture] = React.useState<Texture | "all">("all");
  const [length, setLength] = React.useState<LengthKey>("all");
  const [color, setColor] = React.useState<ColorName | "all">("all");

  const pinRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();

  const bucket = LENGTHS.find((item) => item.key === length) ?? LENGTHS[0];

  const filtered = React.useMemo(
    () =>
      products.filter((product) => {
        if (product.category !== category) return false;
        if (texture !== "all" && product.texture !== texture) return false;
        if (color !== "all" && !product.colors.includes(color)) return false;
        if (
          length !== "all" &&
          !product.lengths.some((n) => n >= bucket.min && n <= bucket.max)
        ) {
          return false;
        }
        return true;
      }),
    [category, texture, color, length, bucket.min, bucket.max],
  );

  const hasFilters = texture !== "all" || length !== "all" || color !== "all";

  const reset = () => {
    setTexture("all");
    setLength("all");
    setColor("all");
  };

  /**
   * Desktop: pin the gallery and translate the track with scrubbed scroll.
   * The matchMedia block means phones keep native, momentum-friendly
   * horizontal scrolling and reduced-motion users never get a pinned section.
   * Rebuilt when the filtered set changes so the travel distance is exact.
   */
  React.useLayoutEffect(() => {
    if (reduce) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const pin = pinRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!pin || !viewport || !track) return;

      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      if (distance() < 40) return;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance() + 260}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "transform" });
        if (barRef.current) barRef.current.style.transform = "scaleX(0)";
      };
    });

    return () => mm.revert();
  }, [reduce, filtered]);

  // Filtering changes track width; recalculate pin distance after layout settles.
  React.useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(t);
  }, [filtered]);

  return (
    <section
      id="collection"
      aria-labelledby="collection-title"
      className="relative overflow-hidden border-t border-white/10 bg-ink"
    >
      <div className="container-x relative z-10 pt-20 sm:pt-28">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <SectionLabel index="03">The crown edit</SectionLabel>
            <h2 id="collection-title" className="mt-7">
              <RevealText
                as="span"
                text="Find your"
                className="display block text-[clamp(3.4rem,9vw,8.4rem)] leading-[0.82]"
              />
              <span className="mt-1 block overflow-hidden">
                <RevealText
                  as="span"
                  text="crown."
                  className="block font-serif text-[clamp(3.4rem,9vw,8.6rem)] italic leading-[0.9] tracking-[-0.02em] text-orange"
                  delay={0.08}
                />
              </span>
            </h2>
          </div>
          <Reveal className="max-w-sm lg:pb-4" delay={0.12}>
            <p className="text-sm leading-relaxed text-bone/70">
              Four wigs. Four extension systems. One standard. Filter by texture,
              length or colour — every piece is ready to ship, or made to order in
              ten days.
            </p>
            <div className="mt-6 flex items-center gap-3 font-serif text-[13px] italic tracking-[0.02em] text-bone/55">
              <SparkIcon className="h-3 w-3 text-orange" />
              Complimentary express shipping over $300
            </div>
          </Reveal>
        </div>

        {/* Filters */}
        <div className="mt-11 border-y border-white/10 py-5 sm:mt-14">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div
              role="group"
              aria-label="Product category"
              className="flex w-fit items-center gap-1 rounded-full border border-white/12 p-1"
            >
              {CATEGORIES.map((item) => {
                const active = category === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setCategory(item.value)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-full px-4 py-2 text-[11px] font-medium tracking-[0.04em] transition-colors duration-300 sm:px-5",
                      active
                        ? "bg-orange text-ink"
                        : "text-bone/55 hover:bg-white/5 hover:text-bone",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <FilterGroup label="Texture">
                <button
                  type="button"
                  onClick={() => setTexture("all")}
                  aria-pressed={texture === "all"}
                  className={cn(
                    chip,
                    texture === "all"
                      ? "border-orange bg-orange text-ink"
                      : "border-white/12 text-bone/65 hover:border-bone/40 hover:text-bone",
                  )}
                >
                  All
                </button>
                {TEXTURES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setTexture(item.value)}
                    aria-pressed={texture === item.value}
                    className={cn(
                      chip,
                      texture === item.value
                        ? "border-orange bg-orange text-ink"
                        : "border-white/12 text-bone/65 hover:border-bone/40 hover:text-bone",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </FilterGroup>

              <FilterGroup label="Length">
                {LENGTHS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setLength(item.key)}
                    aria-pressed={length === item.key}
                    className={cn(
                      chip,
                      length === item.key
                        ? "border-orange bg-orange text-ink"
                        : "border-white/12 text-bone/65 hover:border-bone/40 hover:text-bone",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </FilterGroup>

              <FilterGroup label="Colour">
                <button
                  type="button"
                  onClick={() => setColor("all")}
                  aria-pressed={color === "all"}
                  className={cn(
                    chip,
                    color === "all"
                      ? "border-orange bg-orange text-ink"
                      : "border-white/12 text-bone/65 hover:border-bone/40 hover:text-bone",
                  )}
                >
                  All
                </button>
                {COLORS.map((item) => {
                  const active = color === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setColor(item.name)}
                      aria-label={`Filter by ${item.name}`}
                      aria-pressed={active}
                      title={item.name}
                      className={cn(
                        "h-5 w-5 rounded-full ring-1 ring-inset ring-white/25 transition-transform duration-300 hover:scale-110",
                        active && "ring-2 ring-orange ring-offset-2 ring-offset-ink",
                      )}
                      style={{ backgroundColor: colorHex(item.name) }}
                    >
                      <span className="sr-only">{item.name}</span>
                    </button>
                  );
                })}
              </FilterGroup>
            </div>

            <div className="flex items-center justify-between gap-4 text-[11px] tracking-[0.05em] text-bone/45 xl:justify-end">
              <span aria-live="polite" className="tabular-nums text-bone/65">
                {String(filtered.length).padStart(2, "0")} piece{filtered.length === 1 ? "" : "s"}
              </span>
              <button
                type="button"
                onClick={reset}
                disabled={!hasFilters}
                className={cn(
                  "transition-colors duration-300 hover:text-orange disabled:cursor-not-allowed disabled:opacity-30",
                )}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div ref={pinRef} className="relative mt-8 sm:mt-10 lg:mt-0 lg:h-[100svh]">
        <div className="flex h-full flex-col justify-center py-6 lg:justify-between lg:py-0 lg:pb-7 lg:pt-[112px]">
          <div className="container-x flex items-end justify-between gap-4 pb-5 lg:pb-7">
            <p className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              The edit — {category === "wigs" ? "wigs" : "extensions"}
            </p>
            <p className="hidden items-center gap-2 font-serif text-[12px] italic tracking-[0.02em] text-bone/45 lg:flex">
              Scroll to move
              <ArrowRight className="h-3.5 w-3.5 text-orange" />
            </p>
            <p className="font-serif text-[12px] italic tracking-[0.02em] text-bone/45 lg:hidden">
              Swipe to explore
            </p>
          </div>

          <div
            ref={viewportRef}
            className="no-scrollbar snap-x snap-mandatory overflow-x-auto lg:overflow-hidden"
          >
            {filtered.length > 0 ? (
              <div
                ref={trackRef}
                className="flex w-max items-stretch gap-4 px-5 pb-2 sm:gap-6 sm:px-8 lg:gap-7 lg:px-12"
              >
                {filtered.map((product, i) => (
                  <div
                    key={product.slug}
                    className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[clamp(280px,25vw,384px)]"
                  >
                    <ProductCard product={product} index={i} priority={i < 2} />
                  </div>
                ))}

                <div className="flex w-[68vw] max-w-[400px] shrink-0 snap-start flex-col justify-end border-l border-white/10 pl-6 sm:pl-8 lg:w-[26vw]">
                  <span className="font-display text-[clamp(2.4rem,4.2vw,4rem)] leading-[1.02] tracking-[-0.01em]">
                    Not sure
                    <br />
                    where to
                    <br />
                    <span className="font-serif lowercase italic text-orange">start?</span>
                  </span>
                  <p className="mt-5 max-w-[240px] text-[13px] leading-relaxed text-bone/60">
                    Send us a photo, your length and your density. A stylist will
                    match the crown before you buy it.
                  </p>
                  <ButtonLink
                    href="mailto:atelier@tchairs.com"
                    variant="ghost"
                    size="md"
                    className="mt-6 w-fit"
                  >
                    Book a fitting
                  </ButtonLink>
                </div>
                <span aria-hidden className="w-5 shrink-0 sm:w-8 lg:w-12" />
              </div>
            ) : (
              <div className="container-x">
                <div className="flex min-h-[42vh] flex-col items-start justify-center gap-5 border border-white/10 px-6 py-14 sm:px-10">
                  <p className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.01em]">
                    No crowns in this cut.
                  </p>
                  <p className="max-w-md text-sm leading-relaxed text-bone/65">
                    The combination is a little too specific. Clear a filter — or let
                    the atelier source it from the next single-donor batch.
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-1 inline-flex items-center gap-2 rounded-full border border-orange px-5 py-3 text-[11px] font-medium tracking-[0.05em] text-orange transition-colors duration-300 hover:bg-orange hover:text-ink"
                  >
                    Reset filters
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="container-x flex items-center gap-5 pt-5 lg:pt-7">
            <div className="relative h-px flex-1 overflow-hidden bg-white/10">
              <span ref={barRef} className="absolute inset-0 origin-left bg-orange" style={{ transform: "scaleX(0)" }} />
            </div>
            <span className="font-serif text-[12px] italic tracking-[0.02em] text-bone/45">
              {filtered.length ? String(filtered.length).padStart(2, "0") : "00"} looks
            </span>
            <span className="hidden font-serif text-[12px] italic tracking-[0.02em] text-bone/35 sm:block">
              {category === "wigs" ? "Wigs" : "Extensions"} / Crown edit
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
