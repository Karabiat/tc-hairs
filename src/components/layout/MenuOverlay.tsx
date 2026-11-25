"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CloseIcon, InstagramIcon, TikTokIcon } from "@/components/ui/icons";
import { useDialog, scrollToId } from "@/lib/hooks";

const LINKS = [
  { id: "collection", label: "Wigs", note: "The Crown Edit", image: "/images/product-wavy.jpg" },
  { id: "extensions", label: "Extensions", note: "Clip-ins, bundles, tape-ins", image: "/images/extensions-bundles.jpg" },
  { id: "story", label: "Our Story", note: "Made by hand, worn with intent", image: "/images/atelier.jpg" },
  { id: "quality", label: "The Standard", note: "HD lace. Virgin Remy. 200%.", image: "/images/quality-lace.jpg" },
  { id: "testimonials", label: "The Club", note: "2,400+ verified crowns", image: "/images/editorial-profile.jpg" },
];

export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);
  const reduce = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();

  useDialog(open, onClose, panelRef);

  const go = (id: string) => {
    onClose();
    if (pathname === "/") {
      window.setTimeout(() => scrollToId(id), 520);
    } else {
      router.push(`/#${id}`);
    }
  };

  const enter = reduce
    ? { opacity: 0 }
    : { clipPath: "inset(0 0 100% 0)" };
  const center = reduce
    ? { opacity: 1 }
    : { clipPath: "inset(0 0 0% 0)" };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-ink text-bone"
          initial={enter}
          animate={center}
          exit={enter}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* atmosphere */}
          <div aria-hidden className="pointer-events-none absolute inset-0 glow-orange opacity-70" />
          <div aria-hidden className="noise-panel pointer-events-none absolute inset-0 opacity-[0.05]" />

          <div className="relative flex h-[68px] shrink-0 items-center justify-between border-b border-white/10 px-5 sm:px-8 lg:h-[80px] lg:px-12">
            <Link href="/" onClick={onClose} className="flex items-baseline gap-2" aria-label="T&C Hairs home">
              <span className="font-display text-[27px] leading-none tracking-[-0.03em]">T&C</span>
              <span className="font-serif text-[13px] italic tracking-[0.03em] text-bone/60">Hairs</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="group flex items-center gap-3 rounded-full border border-white/15 px-4 py-2.5 text-[12px] font-medium tracking-[0.05em] transition-colors duration-300 hover:border-orange hover:text-orange"
            >
              Close
              <CloseIcon className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:rotate-90" />
            </button>
          </div>

          <div className="relative flex flex-1 flex-col justify-between px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
            <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
              <nav aria-label="Menu" className="flex flex-col">
                {LINKS.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => go(item.id)}
                    className="group flex items-center gap-4 border-b border-white/10 py-3 text-left sm:gap-6 lg:py-4"
                  >
                    <span className="w-5 shrink-0 pt-2 text-[9px] tracking-[0.2em] text-bone/35 sm:w-7">
                      0{i + 1}
                    </span>
                    <motion.span
                      initial={reduce ? false : { y: "60%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.18 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                      className="display flex-1 text-[clamp(2.7rem,7.8vw,7rem)] leading-[0.86] text-bone transition-colors duration-500 group-hover:text-orange"
                    >
                      {item.label}
                    </motion.span>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-bone/50 transition-all duration-500 ease-expo group-hover:border-orange group-hover:bg-orange group-hover:text-ink sm:h-12 sm:w-12">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </button>
                ))}
              </nav>

              <div className="flex flex-col justify-between gap-8">
                <div className="relative hidden aspect-[4/5] w-full overflow-hidden rounded-sm bg-ink-soft lg:block">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={LINKS[active].image}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Image
                        src={LINKS[active].image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 32vw, 0px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="font-serif text-[13px] italic tracking-[0.02em] text-bone/65">{LINKS[active].note}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <span className="absolute left-4 top-4 flex items-center gap-2 font-serif text-[13px] italic tracking-[0.02em] text-bone/75">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange" /> The Crown Edit
                  </span>
                </div>

                <div className="grid gap-7 border-t border-white/10 pt-7 sm:grid-cols-2 lg:grid-cols-1">
                  <div>
                    <p className="eyebrow mb-3">Client services</p>
                    <a href="mailto:atelier@tchairs.com" className="link-underline text-sm text-bone/80">
                      atelier@tchairs.com
                    </a>
                    <p className="mt-2 text-xs leading-relaxed text-bone/60">
                      Mon–Sat, 9am–7pm GMT
                      <br />
                      Private fittings by appointment.
                    </p>
                  </div>
                  <div>
                    <p className="eyebrow mb-3">Follow</p>
                    <div className="flex items-center gap-3">
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="T&C Hairs on Instagram"
                        className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors duration-300 hover:border-orange hover:text-orange"
                      >
                        <InstagramIcon className="h-4 w-4" />
                      </a>
                      <a
                        href="https://tiktok.com"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="T&C Hairs on TikTok"
                        className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors duration-300 hover:border-orange hover:text-orange"
                      >
                        <TikTokIcon className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 font-serif text-[12px] italic tracking-[0.02em] text-bone/50">
              <span>Est. 2016 — London</span>
              <span className="text-orange">Your crown. Your rules.</span>
              <span>Worldwide delivery</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
