"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BagIcon, CloseIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";
import { useCart } from "@/lib/cart";
import { useDialog } from "@/lib/hooks";
import { formatPrice } from "@/lib/products";
import { cn } from "@/lib/cn";

const FREE_SHIPPING = 300;

export function CartDrawer() {
  const { lines, count, subtotal, isOpen, closeCart, remove, setQty } = useCart();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useDialog(isOpen, closeCart, panelRef);

  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[95]">
          <motion.button
            type="button"
            aria-label="Close bag"
            className="absolute inset-0 bg-ink/70 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={closeCart}
            tabIndex={-1}
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="absolute inset-y-0 right-0 flex h-full w-full flex-col border-l border-white/10 bg-ink-soft shadow-[-30px_0_80px_rgba(0,0,0,0.5)] sm:max-w-[440px]"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
              <div className="flex items-baseline gap-2">
                <h2 className="font-display text-[1.75rem] leading-none tracking-[-0.01em]">Your bag</h2>
                <span className="font-serif text-[13px] italic text-bone/50">({count})</span>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close bag"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-bone/70 transition-colors duration-300 hover:border-orange hover:text-orange"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-white/10 px-5 py-3.5 sm:px-6">
              <div className="flex items-center justify-between gap-4 font-serif text-[12px] italic tracking-[0.01em]">
                <span className={remaining === 0 ? "text-orange" : "text-bone/60"}>
                  {remaining === 0
                    ? "Complimentary express shipping unlocked"
                    : `${formatPrice(remaining)} from complimentary express shipping`}
                </span>
                <span className="text-bone/45">{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-[2px] w-full overflow-hidden bg-white/10">
                <motion.div
                  className="h-full bg-orange"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6" data-lenis-prevent>
              {lines.length === 0 ? (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-white/12 text-bone/40">
                    <BagIcon className="h-6 w-6" />
                  </span>
                  <p className="mt-6 font-display text-3xl leading-none tracking-[-0.01em]">Nothing in the bag.</p>
                  <p className="mt-2 max-w-[220px] text-xs leading-relaxed text-bone/60">
                    Yet. Your next crown is waiting in the edit.
                  </p>
                  <Link
                    href="/#collection"
                    onClick={closeCart}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 text-[12px] font-medium tracking-[0.04em] text-ink transition-colors duration-300 hover:bg-bone"
                  >
                    Shop the collection <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-white/10">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.key}
                        layout
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="flex gap-4 py-5"
                      >
                        <Link
                          href={`/product/${line.slug}`}
                          onClick={closeCart}
                          className="relative h-[110px] w-[86px] shrink-0 overflow-hidden bg-ink-soft"
                        >
                          <Image
                            src={line.image}
                            alt={line.name}
                            fill
                            sizes="86px"
                            className="object-cover"
                          />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <Link
                                href={`/product/${line.slug}`}
                                onClick={closeCart}
                                className="text-sm font-medium leading-tight hover:text-orange"
                              >
                                {line.name}
                              </Link>
                              <span className="shrink-0 text-xs text-bone/75">{formatPrice(line.price * line.qty)}</span>
                            </div>
                            <p className="mt-1 font-serif text-[12px] italic tracking-[0.02em] text-bone/55">
                              {line.color} · {line.length}&quot;
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex h-8 items-center rounded-full border border-white/15">
                              <button
                                type="button"
                                aria-label={`Decrease quantity of ${line.name}`}
                                onClick={() => setQty(line.key, line.qty - 1)}
                                className="grid h-8 w-8 place-items-center text-bone/60 transition-colors hover:text-orange"
                              >
                                <MinusIcon className="h-3 w-3" />
                              </button>
                              <span className="min-w-5 text-center text-[11px]" aria-live="polite">
                                {line.qty}
                              </span>
                              <button
                                type="button"
                                aria-label={`Increase quantity of ${line.name}`}
                                onClick={() => setQty(line.key, line.qty + 1)}
                                className="grid h-8 w-8 place-items-center text-bone/60 transition-colors hover:text-orange"
                              >
                                <PlusIcon className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(line.key)}
                              className={cn(
                                "text-[11px] tracking-[0.03em] text-bone/45 underline-offset-4 transition-colors hover:text-orange hover:underline",
                              )}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            <div className="border-t border-white/10 px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-bone/65">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-[10px] tracking-[0.02em] text-bone/45">
                Taxes and shipping calculated at checkout
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                aria-disabled={lines.length === 0}
                className={cn(
                  "group mt-4 flex w-full items-center justify-between rounded-full bg-orange px-6 py-4 text-[12px] font-medium tracking-[0.05em] text-ink transition-colors duration-300 hover:bg-bone",
                  lines.length === 0 && "pointer-events-none opacity-40",
                )}
              >
                Checkout
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <div className="mt-4 flex items-center justify-between font-serif text-[12px] italic tracking-[0.02em] text-bone/50">
                <span>Secure checkout</span>
                <a href="mailto:atelier@tchairs.com" className="transition-colors hover:text-orange">
                  Need help?
                </a>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
