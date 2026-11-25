"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SearchIcon, BagIcon } from "@/components/ui/icons";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { scrollToId } from "@/lib/hooks";
import { MenuOverlay } from "@/components/layout/MenuOverlay";
import { SearchOverlay } from "@/components/layout/SearchOverlay";

const NAV = [
  { label: "Wigs", href: "/#collection", id: "collection" },
  { label: "Extensions", href: "/#extensions", id: "extensions" },
  { label: "Our Story", href: "/#story", id: "story" },
  { label: "The Standard", href: "/#quality", id: "quality" },
];

export function Header() {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (event: React.MouseEvent<HTMLAnchorElement>, item: (typeof NAV)[number]) => {
    if (window.location.pathname === "/") {
      event.preventDefault();
      scrollToId(item.id);
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70]">
        {/* Announcement rail collapses on scroll so the header stays lean. */}
        <div
          className={cn(
            "overflow-hidden bg-orange text-ink transition-[height,opacity] duration-500 ease-expo",
            scrolled ? "h-0 opacity-0" : "h-8 opacity-100",
          )}
        >
          <div className="container-x flex h-8 items-center justify-between font-serif text-[13px] italic tracking-[0.02em]">
            <span className="hidden sm:block">Complimentary express shipping over $300</span>
            <span className="sm:hidden">Free express shipping over $300</span>
            <span className="hidden md:block">London atelier · Worldwide delivery</span>
            <span className="md:hidden">Est. 2016</span>
          </div>
        </div>

        <div
          className={cn(
            "border-b transition-all duration-500 ease-expo",
            scrolled ? "border-white/10 bg-ink/80 backdrop-blur-xl" : "border-transparent bg-transparent",
          )}
        >
          <div className="container-x flex h-[68px] items-center justify-between gap-4 lg:h-[80px]">
            <Link
              href="/"
              aria-label="T&C Hairs home"
              className="group flex items-baseline gap-2 py-2"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 });
                  else window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <span className="font-display text-[27px] leading-none tracking-[-0.03em] transition-colors duration-300 group-hover:text-orange lg:text-[31px]">
                T&C
              </span>
              <span className="font-serif text-[13px] italic tracking-[0.03em] text-bone/60 transition-colors duration-300 group-hover:text-bone">
                Hairs
              </span>
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
              {NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => go(e, item)}
                  className="group relative font-serif text-[16px] italic tracking-[0.01em] text-bone/70 transition-colors duration-300 hover:text-bone"
                >
                  {item.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-orange transition-all duration-500 ease-expo group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-3">
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-full text-bone/75 transition-colors duration-300 hover:bg-white/5 hover:text-orange"
              >
                <SearchIcon className="h-[19px] w-[19px]" />
              </button>

              <button
                type="button"
                aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
                onClick={openCart}
                className="relative grid h-10 w-10 place-items-center rounded-full text-bone/75 transition-colors duration-300 hover:bg-white/5 hover:text-orange"
                data-cursor-label="BAG"
              >
                <BagIcon className="h-[19px] w-[19px]" />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 620, damping: 18 }}
                      className="absolute right-1 top-1 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-orange px-1 text-[9px] font-semibold leading-none text-ink"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="group ml-0.5 flex h-10 items-center gap-2.5 rounded-full pl-2 pr-1 text-bone/80 transition-colors duration-300 hover:text-orange sm:pl-3"
              >
                <span className="hidden text-[12px] font-medium tracking-[0.05em] sm:block">
                  Menu
                </span>
                <span className="relative flex h-10 w-8 flex-col items-end justify-center gap-[5px] px-1">
                  <span className="h-px w-4 bg-current transition-all duration-500 ease-expo group-hover:w-6" />
                  <span className="h-px w-6 bg-current transition-all duration-500 ease-expo group-hover:w-4" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
