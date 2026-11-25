"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { useDialog } from "@/lib/hooks";
import { formatPrice, products } from "@/lib/products";
import { cn } from "@/lib/cn";

const POPULAR = ["Straight", "HD lace", "Curly", "Clip-ins", "Bob", "Bundles"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState("");
  const reduce = useReducedMotion();

  useDialog(open, onClose, panelRef);

  React.useEffect(() => {
    if (!open) return;
    setQuery("");
    const t = window.setTimeout(() => inputRef.current?.focus(), 180);
    return () => window.clearTimeout(t);
  }, [open]);

  const q = query.trim().toLowerCase();
  const results = q
    ? products.filter((p) =>
        [p.name, p.category, p.texture, p.hairType, p.lace, p.tag, ...p.colors]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
    : products.filter((p) => p.featured).slice(0, 4);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[92] overflow-y-auto bg-ink/95 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            initial={reduce ? { opacity: 0 } : { y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: -24, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-6xl px-5 pb-16 pt-6 sm:px-8 sm:pt-10"
          >
            <div className="flex items-center justify-between">
              <span className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                Search the atelier
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-bone/70 transition-colors duration-300 hover:border-orange hover:text-orange"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4 border-b border-white/20 pb-5 sm:mt-14 sm:gap-6">
              <SearchIcon className="h-6 w-6 shrink-0 text-orange sm:h-8 sm:w-8" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Silk, curls, HD lace…"
                aria-label="Search products"
                className="w-full bg-transparent font-display text-[clamp(2rem,5vw,3.8rem)] leading-[1.05] tracking-[-0.01em] text-bone placeholder:text-bone/30 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-[11px] tracking-[0.04em] text-bone/60 transition-colors hover:text-orange"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 font-serif text-[12px] italic tracking-[0.02em] text-bone/50">Popular</span>
              {POPULAR.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    inputRef.current?.focus();
                  }}
                  className={cn(
                    "rounded-full border border-white/12 px-3.5 py-1.5 text-[11px] tracking-[0.03em] text-bone/65 transition-colors duration-300 hover:border-orange hover:text-orange",
                    q === term.toLowerCase() && "border-orange bg-orange/10 text-orange",
                  )}
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="mt-10">
              <div className="flex items-end justify-between gap-4">
                <p className="font-serif text-[13px] italic tracking-[0.02em] text-bone/55">
                  {q ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Most wanted"}
                </p>
                <Link
                  href="/#collection"
                  onClick={onClose}
                  className="text-[11px] tracking-[0.04em] text-orange underline-offset-4 hover:underline"
                >
                  View all pieces
                </Link>
              </div>

              {results.length ? (
                <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                  {results.slice(0, 8).map((product, i) => (
                    <motion.div
                      key={product.slug}
                      initial={reduce ? false : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link href={`/product/${product.slug}`} onClick={onClose} className="group block">
                        <div className="relative aspect-[4/5] overflow-hidden bg-ink-soft">
                          <Image
                            src={product.images[0]}
                            alt={product.alt}
                            fill
                            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 80vw"
                            className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.04]"
                          />
                          <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[10px] tracking-[0.02em] text-bone/75 backdrop-blur">
                            {product.texture}
                          </span>
                        </div>
                        <div className="mt-3 flex items-start justify-between gap-3">
                          <div>
                            <p className="font-display text-[1.25rem] leading-tight">{product.name}</p>
                            <p className="mt-0.5 font-serif text-[12px] italic tracking-[0.02em] text-bone/55">
                              {product.length}&quot; · {product.hairType}
                            </p>
                          </div>
                          <p className="font-serif text-[14px] italic text-bone/80">{formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="mt-10 flex flex-col items-start gap-3 border-t border-white/10 pt-10">
                  <p className="font-display text-3xl leading-none tracking-[-0.01em]">No crowns found.</p>
                  <p className="max-w-md text-sm text-bone/65">
                    Try &ldquo;straight&rdquo;, &ldquo;curly&rdquo; or &ldquo;bundle&rdquo;. Or let a stylist source it for you.
                  </p>
                  <a
                    href="mailto:atelier@tchairs.com"
                    className="mt-2 text-[11px] tracking-[0.04em] text-orange underline-offset-4 hover:underline"
                  >
                    atelier@tchairs.com
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
