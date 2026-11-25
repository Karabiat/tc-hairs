"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/lib/cart";
import {
  colorHex,
  formatPrice,
  getProduct,
  priceForLength,
  type ColorName,
  type Product,
} from "@/lib/products";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText, Reveal, RevealMask } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";
import { CheckIcon, MinusIcon, PlusIcon, SparkIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface System {
  id: string;
  label: string;
  note: string;
  description: string;
  image: string;
  product: Product;
  specs: [string, string][];
}

function requireProduct(slug: string): Product {
  const product = getProduct(slug);
  if (!product) throw new Error(`Unknown extension product: ${slug}`);
  return product;
}

const SYSTEMS: System[] = [
  {
    id: "bundle",
    label: "Bundles",
    note: "Sewn-in volume",
    description:
      "The salon standard. Cuticle-aligned wefts, enough for a full head when paired.",
    image: "/images/extensions-bundles.jpg",
    product: requireProduct("atelier-bundle"),
    specs: [
      ["Weight", "100g / bundle"],
      ["Weft", "Double-sewn"],
      ["Finish", "Cuticle aligned"],
    ],
  },
  {
    id: "clip",
    label: "Clip-Ins",
    note: "Five-minute change",
    description:
      "Featherweight seamless wefts that sit flat and disappear under your own hair.",
    image: "/images/extensions-clipins.jpg",
    product: requireProduct("seamless-clip-ins"),
    specs: [
      ["Set", "7 wefts · 140g"],
      ["Base", "Seamless"],
      ["Install", "5 minutes"],
    ],
  },
  {
    id: "tape",
    label: "Tape-Ins",
    note: "Eight-week wear",
    description:
      "Forty invisible strips, bonded flat. A brushable finish that lasts two months per install.",
    image: "/images/extensions-tapeins.jpg",
    product: requireProduct("invisible-tape-ins"),
    specs: [
      ["Set", "40 strips · 100g"],
      ["Adhesive", "Medical-grade"],
      ["Wear", "Up to 8 weeks"],
    ],
  },
];

export function Extensions() {
  const { add } = useCart();
  const reduce = useReducedMotion();
  const [systemId, setSystemId] = React.useState(SYSTEMS[0].id);
  const [color, setColor] = React.useState<ColorName>(SYSTEMS[0].product.colors[0]);
  const [length, setLength] = React.useState<number>(SYSTEMS[0].product.lengths[0]);
  const [qty, setQty] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const timeout = React.useRef<number | null>(null);

  const system = SYSTEMS.find((item) => item.id === systemId) ?? SYSTEMS[0];
  const product = system.product;
  const activeColor = product.colors.includes(color) ? color : product.colors[0];
  const activeLength = product.lengths.includes(length) ? length : product.lengths[0];
  const price = priceForLength(product, activeLength);

  React.useEffect(() => {
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current);
    };
  }, []);

  const selectSystem = (next: System) => {
    setSystemId(next.id);
    setColor(next.product.colors[0]);
    setLength(next.product.lengths[0]);
    setQty(1);
    setAdded(false);
  };

  const addToBag = () => {
    add(
      {
        slug: product.slug,
        name: product.name,
        image: system.image,
        category: "extensions",
        price,
        color: activeColor,
        length: activeLength,
      },
      qty,
    );
    setAdded(true);
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section
      id="extensions"
      aria-labelledby="extensions-title"
      className="relative overflow-hidden bg-blush text-ink"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 top-16 select-none font-display text-[22vw] leading-none text-ink/[0.035]"
      >
        EXT
      </span>

      <div className="container-x relative z-10 py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <SectionLabel index="04" light>
              Extensions, without the wait
            </SectionLabel>
            <h2 id="extensions-title" className="mt-7">
              <RevealText
                as="span"
                text="More length."
                className="display block text-[clamp(3.2rem,8.6vw,8rem)] leading-[0.82] text-ink"
              />
              <span className="mt-1 block overflow-hidden">
                <RevealText
                  as="span"
                  text="same you."
                  className="block font-serif text-[clamp(3.2rem,8.6vw,8rem)] italic leading-[0.9] tracking-[-0.02em] text-orange-700"
                  delay={0.08}
                />
              </span>
            </h2>
          </div>
          <Reveal className="max-w-sm lg:pb-3" delay={0.1}>
            <p className="text-sm leading-relaxed text-ink/70">
              Same donor hair. Same hand-finished wefts. Choose how it attaches,
              then choose the length. The colour is matched to your base by eye,
              not by a printer.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-serif text-[13px] italic tracking-[0.02em] text-ink/55">
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-3 w-3 text-orange-700" /> Colour match
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-3 w-3 text-orange-700" /> 30-day returns
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-3 w-3 text-orange-700" /> Fitting guide
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          {/* Media */}
          <div>
            <RevealMask className="relative">
              <div className="relative aspect-[4/5] overflow-hidden border border-ink/15 bg-[#12110f]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={system.id}
                    className="absolute inset-0"
                    initial={reduce ? false : { opacity: 0, scale: 1.035 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.015 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={system.image}
                      alt={`${system.label} — ${product.description.split(".")[0]}`}
                      fill
                      sizes="(min-width: 1024px) 46vw, 100vw"
                      className="object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
                    />
                  </motion.div>
                </AnimatePresence>

                <span className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-ink/45 px-3 py-1.5 text-[8px] uppercase tracking-[0.22em] text-bone/80 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                  {system.label} — {activeLength}&quot;
                </span>

                <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
                  <div>
                    <p className="font-display text-2xl leading-none text-bone">
                      {product.name}
                    </p>
                    <p className="mt-1.5 font-serif text-[13px] italic tracking-[0.02em] text-bone/60">
                      {activeColor} · {product.hairType}
                    </p>
                  </div>
                  <p className="shrink-0 text-right text-[9px] uppercase leading-relaxed tracking-[0.16em] text-bone/60">
                    Atelier
                    <br />
                    series 04
                  </p>
                </div>
              </div>
            </RevealMask>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {SYSTEMS.map((item) => {
                const active = item.id === system.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectSystem(item)}
                    aria-pressed={active}
                    className={cn(
                      "group relative overflow-hidden border p-2 text-left transition-colors duration-300",
                      active ? "border-orange-700" : "border-ink/15 hover:border-ink/40",
                    )}
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <span className="relative h-10 w-8 shrink-0 overflow-hidden bg-ink sm:h-11 sm:w-9">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block whitespace-nowrap text-[11px] font-medium tracking-[0.02em]">
                          {item.label}
                        </span>
                        <span className="mt-0.5 hidden truncate text-[10px] tracking-[0.02em] text-ink/50 sm:block">
                          {item.note}
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Configurator */}
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-6 border-b border-ink/15 pb-5">
              <div>
                <p className="font-serif text-[12px] italic tracking-[0.02em] text-ink/50">
                  The system
                </p>
                <p className="mt-1.5 font-display text-[clamp(2rem,3.2vw,2.8rem)] leading-none">
                  {system.label}
                </p>
              </div>
              <p className="max-w-[220px] pt-1 text-right text-[12px] leading-relaxed text-ink/60">
                {system.description}
              </p>
            </div>

            <fieldset className="mt-7">
              <legend className="font-serif text-[13px] italic tracking-[0.02em] text-ink/55">
                01 — Format
              </legend>
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {SYSTEMS.map((item) => {
                  const active = item.id === system.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectSystem(item)}
                      aria-pressed={active}
                      className={cn(
                        "border px-3 py-3 text-left transition-colors duration-300",
                        active
                          ? "border-ink bg-ink text-bone"
                          : "border-ink/20 text-ink hover:border-ink/50",
                      )}
                    >
                      <span className="block text-[11px] font-medium tracking-[0.03em]">
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          "mt-1 block text-[10px] tracking-[0.02em]",
                          active ? "text-bone/55" : "text-ink/50",
                        )}
                      >
                        {item.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-7">
              <legend className="font-serif text-[13px] italic tracking-[0.02em] text-ink/55">
                02 — Colour
                <span className="ml-2 normal-case tracking-normal text-ink/65">{activeColor}</span>
              </legend>
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                {product.colors.map((name) => {
                  const active = name === activeColor;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setColor(name)}
                      aria-label={`Colour: ${name}`}
                      aria-pressed={active}
                      title={name}
                      className={cn(
                        "group flex items-center gap-2 border px-2.5 py-1.5 transition-colors duration-300",
                        active ? "border-ink" : "border-ink/15 hover:border-ink/40",
                      )}
                    >
                      <span
                        className="block h-4 w-4 rounded-full ring-1 ring-inset ring-black/20"
                        style={{ backgroundColor: colorHex(name) }}
                      />
                      <span className="text-[11px] tracking-[0.03em]">{name}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-7">
              <legend className="font-serif text-[13px] italic tracking-[0.02em] text-ink/55">
                03 — Length
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.lengths.map((value) => {
                  const active = value === activeLength;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setLength(value)}
                      aria-pressed={active}
                      className={cn(
                        "flex min-w-[76px] flex-col items-start gap-1 border px-3.5 py-2.5 transition-colors duration-300",
                        active
                          ? "border-ink bg-ink text-bone"
                          : "border-ink/20 hover:border-ink/50",
                      )}
                    >
                      <span className="font-display text-xl leading-none">
                        {value}&quot;
                      </span>
                      <span
                        className={cn(
                          "text-[10px] tracking-[0.02em]",
                          active ? "text-bone/55" : "text-ink/50",
                        )}
                      >
                        {formatPrice(priceForLength(product, value))}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-7 grid grid-cols-3 gap-px overflow-hidden border border-ink/15 bg-ink/15">
              {system.specs.map(([label, value]) => (
                <div key={label} className="bg-blush-soft px-3 py-3.5">
                  <p className="text-[10px] tracking-[0.04em] text-ink/55">{label}</p>
                  <p className="mt-1 text-[12px] leading-snug">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-end justify-between gap-5 border-t border-ink/15 pt-6">
              <div>
                <p className="text-[11px] tracking-[0.03em] text-ink/50">
                  {product.name} · {activeColor} · {activeLength}&quot;
                </p>
                <p aria-live="polite" className="mt-1 font-display text-[clamp(2.2rem,3.6vw,3rem)] leading-none">
                  {formatPrice(price)}
                </p>
              </div>
              <div className="flex h-11 items-center border border-ink/20">
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                  className="grid h-11 w-10 place-items-center transition-colors hover:text-orange-700 disabled:opacity-30"
                >
                  <MinusIcon className="h-3.5 w-3.5" />
                </button>
                <span aria-live="polite" className="min-w-6 text-center text-xs tabular-nums">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.min(9, value + 1))}
                  aria-label="Increase quantity"
                  className="grid h-11 w-10 place-items-center transition-colors hover:text-orange-700"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <Button
              type="button"
              variant="dark"
              size="lg"
              arrow={!added}
              onClick={addToBag}
              className="mt-4 w-full justify-between px-7"
              aria-label={`Add ${qty} × ${product.name}, ${activeColor}, ${activeLength} inch to bag`}
            >
              <span className="inline-flex items-center gap-2">
                {added && <CheckIcon className="h-4 w-4 text-orange" />}
                {added ? "Added to bag" : "Add to bag"}
              </span>
            </Button>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 font-serif text-[12px] italic tracking-[0.02em] text-ink/55">
              <span className="inline-flex items-center gap-1.5">
                <SparkIcon className="h-2.5 w-2.5 text-orange-700" />
                Ships in 1–2 days
              </span>
              <span>Free returns within 30 days</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
