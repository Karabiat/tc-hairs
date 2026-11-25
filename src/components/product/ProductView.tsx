"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/lib/cart";
import {
  colorHex,
  formatPrice,
  priceForLength,
  type ColorName,
  type Product,
} from "@/lib/products";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckIcon, MinusIcon, PlusIcon, SparkIcon, StarIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export function ProductView({ product }: { product: Product }) {
  const { add } = useCart();
  const reduce = useReducedMotion();
  const [activeImage, setActiveImage] = React.useState(0);
  const [color, setColor] = React.useState<ColorName>(product.colors[0]);
  const [length, setLength] = React.useState<number>(product.length);
  const [qty, setQty] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const timeout = React.useRef<number | null>(null);

  const activeColor = product.colors.includes(color) ? color : product.colors[0];
  const activeLength = product.lengths.includes(length) ? length : product.length;
  const price = priceForLength(product, activeLength);
  const secondary = product.images[1] ?? product.images[0];

  React.useEffect(() => {
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current);
    };
  }, []);

  const addToBag = () => {
    add(
      {
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        category: product.category,
        price,
        color: activeColor,
        length: activeLength,
      },
      qty,
    );
    setAdded(true);
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setAdded(false), 2200);
  };

  const categoryHref = product.category === "wigs" ? "/#collection" : "/#extensions";
  const categoryLabel = product.category === "wigs" ? "Wigs" : "Extensions";

  return (
    <div className="relative overflow-hidden bg-ink pb-20 pt-[112px] sm:pb-24 lg:pt-[136px]">
      <div aria-hidden className="pointer-events-none absolute inset-0 glow-orange opacity-40" />

      <div className="container-x relative z-10">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-bone/50">
          <Link href="/" className="transition-colors hover:text-bone">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link href={categoryHref} className="transition-colors hover:text-bone">
            {categoryLabel}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-bone/60">{product.name}</span>
        </nav>

        <div className="mt-7 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 xl:gap-20">
          {/* Media */}
          <div className="lg:sticky lg:top-[104px] lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-ink-soft">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={product.images[activeImage] ?? product.images[0]}
                    alt={
                      activeImage === 0
                        ? product.alt
                        : `${product.name} — detail view ${activeImage + 1}`
                    }
                    fill
                    priority
                    sizes="(min-width: 1024px) 54vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/55 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent"
              />

              <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full border border-white/15 bg-ink/50 px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] text-bone/70 backdrop-blur sm:left-4 sm:top-4">
                {product.tag ?? "The crown edit"}
              </span>

              <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex items-end justify-between gap-4 sm:inset-x-5 sm:bottom-5">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.26em] text-orange">
                    Atelier photography
                  </p>
                  <p className="mt-1 font-display text-[1.35rem] leading-none text-bone">
                    {activeColor} · {activeLength}&quot;
                  </p>
                </div>
                <p className="text-right text-[9px] uppercase leading-relaxed tracking-[0.16em] text-bone/55">
                  {String(activeImage + 1).padStart(2, "0")} /{" "}
                  {String(product.images.length).padStart(2, "0")}
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {product.images.map((image, i) => {
                const active = activeImage === i;
                return (
                  <button
                    key={`${image}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show ${product.name} image ${i + 1}`}
                    aria-pressed={active}
                    className={cn(
                      "group relative aspect-[4/5] overflow-hidden border bg-ink-soft transition-colors duration-300",
                      active ? "border-orange" : "border-white/10 hover:border-white/30",
                    )}
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 18vw, 32vw"
                      className={cn(
                        "object-cover transition-opacity duration-300",
                        active ? "opacity-100" : "opacity-60 group-hover:opacity-90",
                      )}
                    />
                    <span className="absolute bottom-2 left-2 text-[7px] uppercase tracking-[0.16em] text-bone/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-[8px] uppercase tracking-[0.18em] text-bone/50">
              <span className="inline-flex items-center gap-2">
                <SparkIcon className="h-2.5 w-2.5 text-orange" />
                Hand-finished in London
              </span>
              <span>Model wears {product.length}&quot;</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="rounded-full border border-orange/40 px-3 py-1 text-[8px] uppercase tracking-[0.2em] text-orange">
                {product.density} density
              </span>
              <span className="text-[9px] uppercase tracking-[0.16em] text-bone/40">{product.lace}</span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-bone/45">
                <span className="flex gap-0.5 text-orange">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="h-2.5 w-2.5" />
                  ))}
                </span>
                4.9 · 312
              </span>
            </div>

            <h1 className="mt-5 font-display text-[clamp(3.2rem,7vw,6rem)] leading-[0.95] tracking-[-0.02em]">
              {product.name}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-bone/70">{product.description}</p>

            <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-1 border-b border-white/10 pb-6">
              <p aria-live="polite" className="font-display text-[clamp(2rem,3.4vw,2.8rem)] leading-none">
                {formatPrice(price)}
              </p>
              <p className="pb-1 text-[10px] uppercase tracking-[0.14em] text-bone/55">
                or 4 × {formatPrice(Math.round(price / 4))} with Klarna
              </p>
              <p className="ml-auto pb-1 text-[10px] uppercase tracking-[0.14em] text-bone/55">
                {activeLength}&quot; · {activeColor}
              </p>
            </div>

            <fieldset className="mt-6">
              <legend className="flex w-full items-center justify-between font-serif text-[13px] italic tracking-[0.02em] text-bone/60">
                <span>Colour</span>
                <span className="not-italic tracking-[0.02em] text-bone/45">{activeColor}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2.5">
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
                        "flex items-center gap-2 border px-2.5 py-1.5 transition-colors duration-300",
                        active ? "border-orange" : "border-white/15 hover:border-bone/40",
                      )}
                    >
                      <span
                        className="block h-4 w-4 rounded-full ring-1 ring-inset ring-white/20"
                        style={{ backgroundColor: colorHex(name) }}
                      />
                      <span className="text-[11px] tracking-[0.03em]">{name}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="font-serif text-[13px] italic tracking-[0.02em] text-bone/60">
                Length
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
                        "flex min-w-[78px] flex-col items-start gap-1 border px-3.5 py-2.5 transition-colors duration-300",
                        active
                          ? "border-orange bg-orange/10 text-bone"
                          : "border-white/15 text-bone/65 hover:border-bone/40",
                      )}
                    >
                      <span className="font-display text-xl leading-none">{value}&quot;</span>
                      <span className="text-[10px] tracking-[0.02em] text-bone/45">
                        {formatPrice(priceForLength(product, value))}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-14 items-center justify-between border border-white/20 sm:w-[128px]">
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                  className="grid h-14 w-11 place-items-center text-bone/60 transition-colors hover:text-orange disabled:opacity-30"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span aria-live="polite" className="min-w-5 text-center text-sm tabular-nums">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.min(9, value + 1))}
                  aria-label="Increase quantity"
                  className="grid h-14 w-11 place-items-center text-bone/60 transition-colors hover:text-orange"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              <Button
                type="button"
                size="lg"
                arrow={!added}
                onClick={addToBag}
                className="h-14 flex-1 justify-between px-7"
                aria-label={`Add ${qty} × ${product.name}, ${activeColor}, ${activeLength} inch to bag`}
              >
                <span className="inline-flex items-center gap-3">
                  {added ? <CheckIcon className="h-4 w-4" /> : null}
                  {added ? "Added to bag" : `Add to bag — ${formatPrice(price * qty)}`}
                </span>
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] uppercase tracking-[0.14em] text-bone/55">
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-3 w-3 text-orange" /> In stock, ships in 1–2 days
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-3 w-3 text-orange" /> 30-day returns
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-3 w-3 text-orange" /> Free express over $300
              </span>
            </div>

            <div className="mt-8">
              <Accordion
                items={[
                  {
                    title: "Details & construction",
                    body: (
                      <ul className="space-y-2">
                        {product.details.map((detail) => (
                          <li key={detail} className="flex gap-2.5">
                            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-orange" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                  {
                    title: "Care",
                    body:
                      "Wash every 8–10 wears with sulphate-free shampoo in cool water. Condition mid-length to ends, blot with a microfibre towel and air-dry on a stand. Heat style below 180°C. Store on a silk-lined block, never in a bun.",
                  },
                  {
                    title: "Shipping & returns",
                    body:
                      "Complimentary express shipping on orders over $300, dispatched from London within 1–2 business days. Made-to-order crowns ship in 10–14 days. Unworn pieces may be returned within 30 days; custom cuts and colour matches are final sale.",
                  },
                  {
                    title: "Private fittings",
                    body:
                      "Book a 45-minute appointment at the East London atelier or a virtual fitting. We map your circumference, hairline and density, then adjust the cap and cut before it ships — included with every crown.",
                  },
                ]}
              />
            </div>

            <div className="mt-7 flex items-center justify-between gap-5 border border-white/10 bg-white/[0.02] px-5 py-4">
              <div>
                <p className="font-serif text-[13px] italic tracking-[0.02em] text-bone/55">Not sure about the fit?</p>
                <p className="mt-1 text-[13px] text-bone/50">A stylist can match it to your head by video.</p>
              </div>
              <Link
                href="mailto:atelier@tchairs.com"
                className="group inline-flex shrink-0 items-center gap-2 text-[11px] tracking-[0.05em] text-orange"
              >
                Book
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <p className="mt-4 text-[8px] uppercase leading-relaxed tracking-[0.14em] text-bone/45">
              {secondary === product.images[0] ? "" : "Additional imagery from the atelier archive. "}
              Colour may vary slightly between screens. Every piece is colour-matched by hand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
