"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText, Reveal } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { ArrowUpRight, CheckIcon, SparkIcon } from "@/components/ui/icons";

const LINKS = [
  { label: "Shop all wigs", href: "/#collection" },
  { label: "Extensions", href: "/#extensions" },
  { label: "Book a private fitting", href: "mailto:atelier@tchairs.com" },
];

export function FinalCTA() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "error" | "success">("idle");
  const reduce = useReducedMotion();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <section
      id="join"
      aria-labelledby="join-title"
      className="relative isolate overflow-hidden bg-orange text-ink"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-10 top-10 select-none font-display text-[30vw] leading-none text-ink/[0.055]"
      >
        T&amp;C
      </span>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_20%,rgba(255,255,255,0.16),transparent_70%)]"
      />

      <div className="container-x relative z-10 flex min-h-[92svh] flex-col justify-between pb-10 pt-[112px] sm:pb-12 lg:pt-[132px]">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <SectionLabel index="06" light className="text-ink">
            <span className="text-ink/70">The crown club</span>
          </SectionLabel>
          <div className="text-right font-serif text-[13px] italic leading-relaxed tracking-[0.02em] text-ink/60">
            First access · Private fittings
            <br />
            Worldwide delivery
          </div>
        </div>

        <div className="py-14 sm:py-16">
          <h2 id="join-title">
            <span className="display block text-[clamp(4rem,14vw,15rem)] leading-[0.82] text-ink">
              <RevealText as="span" text="Your crown." />
            </span>
            <span className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-1 sm:mt-3">
              <span className="display block text-[clamp(3.4rem,11.8vw,13rem)] leading-[0.82] text-ink">
                <RevealText as="span" text="Your" delay={0.08} />
              </span>
              <span className="block overflow-hidden">
                <RevealText
                  as="span"
                  text="rules."
                  delay={0.16}
                  className="block font-serif text-[clamp(4rem,13vw,14.5rem)] italic leading-[0.82] tracking-[-0.03em] text-ink"
                />
              </span>
            </span>
          </h2>
          <Reveal delay={0.18} className="mt-8 max-w-md">
            <p className="text-[14px] leading-relaxed text-ink/75">
              Drops before they are public. Fittings before they are booked out.
              A standing 10% for the club. No noise, six emails a year.
            </p>
          </Reveal>
        </div>

        <div>
          <div className="grid gap-8 border-t border-ink/25 pt-7 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
            <div>
              <p className="eyebrow text-ink/70">
                <SparkIcon className="h-3 w-3 text-ink" />
                Join the club
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-serif text-[13px] italic tracking-[0.02em] text-ink/60">
                <span className="inline-flex items-center gap-1.5">
                  <CheckIcon className="h-3 w-3" /> 10% first order
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckIcon className="h-3 w-3" /> Early access
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckIcon className="h-3 w-3" /> No noise
                </span>
              </div>
            </div>

            <div>
              {status === "success" ? (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-3 border-b border-ink/40 pb-4 sm:flex-row sm:items-center sm:justify-between"
                  aria-live="polite"
                >
                  <span className="inline-flex items-center gap-3 text-sm">
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-ink/40">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                    You&apos;re in. Watch your inbox for the next drop.
                  </span>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="text-left text-[11px] tracking-[0.04em] text-ink/60 underline-offset-4 hover:text-ink hover:underline sm:text-right"
                  >
                    Use another email
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <label htmlFor="club-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="club-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (status === "error") setStatus("idle");
                        }}
                        aria-invalid={status === "error"}
                        aria-describedby={status === "error" ? "club-error" : undefined}
                        className="w-full border-b border-ink/40 bg-transparent py-3 text-base text-ink placeholder:text-ink/45 transition-colors duration-300 focus:border-ink focus:outline-none"
                      />
                    </div>
                    <Button type="submit" variant="dark" size="lg" arrow className="shrink-0 justify-between">
                      Join the club
                    </Button>
                  </div>
                  {status === "error" && (
                    <p id="club-error" role="alert" className="mt-2 text-[11px] tracking-[0.03em] text-ink/75">
                      Enter a valid email address.
                    </p>
                  )}
                  <p className="mt-3 text-[10px] tracking-[0.02em] text-ink/55">
                    By joining you agree to our privacy policy. Unsubscribe in one click.
                  </p>
                </form>
              )}
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-5 border-t border-ink/25 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <nav aria-label="Final calls to action" className="flex flex-wrap gap-x-6 gap-y-3">
              {LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.04em] text-ink/75 transition-colors duration-300 hover:text-ink"
                >
                  {link.label}
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </nav>
            <p className="font-serif text-[12px] italic tracking-[0.02em] text-ink/55">
              Est. 2016 — London atelier
            </p>
          </div>
        </div>
      </div>

      {/* Black ticker creates a hard edge into the footer. */}
      <div className="relative z-10 border-t border-ink/25 bg-ink py-3.5 text-orange">
        <Marquee speed={64}>
          {["The crown club", "Your crown. Your rules.", "London atelier", "Worldwide delivery"].map(
            (item) => (
              <span key={item} className="flex items-center">
                <span className="whitespace-nowrap px-6 font-serif text-[13px] italic tracking-[0.02em]">
                  {item}
                </span>
                <SparkIcon className="h-2 w-2 shrink-0" />
              </span>
            ),
          )}
        </Marquee>
      </div>
    </section>
  );
}
