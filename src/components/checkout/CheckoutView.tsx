"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, type CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Accordion } from "@/components/ui/Accordion";
import { CheckIcon, SparkIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type Payment = "card" | "klarna" | "apple";

interface Order {
  number: string;
  email: string;
  name: string;
  address: string;
  lines: CartLine[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

const COUNTRIES = ["United Kingdom", "United States", "France", "Germany", "Nigeria", "Ghana", "United Arab Emirates", "Canada"];

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required = true,
  placeholder,
  className,
  inputMode,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  maxLength?: number;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-[11px] tracking-[0.04em] text-bone/60">
        {label}
        {required ? <span className="text-orange"> *</span> : <span className="text-bone/35"> (optional)</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        className="input-line mt-1 text-sm"
      />
    </label>
  );
}

export function CheckoutView() {
  const { lines, subtotal, count, hydrated, clear } = useCart();
  const [payment, setPayment] = React.useState<Payment>("card");
  const [promo, setPromo] = React.useState("");
  const [promoState, setPromoState] = React.useState<"idle" | "applied" | "invalid">("idle");
  const [order, setOrder] = React.useState<Order | null>(null);

  const discount = promoState === "applied" ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal >= 300 || subtotal === 0 ? 0 : 18;
  const total = Math.max(0, subtotal + shipping - discount);

  const applyPromo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (promo.trim().toUpperCase() === "CROWN10") {
      setPromoState("applied");
    } else {
      setPromoState("invalid");
    }
  };

  const placeOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const first = String(data.get("firstName") ?? "");
    const last = String(data.get("lastName") ?? "");
    const street = String(data.get("address") ?? "");
    const city = String(data.get("city") ?? "");
    const postcode = String(data.get("postcode") ?? "");
    const country = String(data.get("country") ?? "");

    const snapshot: Order = {
      number: `TC-${String(Date.now()).slice(-6)}`,
      email,
      name: `${first} ${last}`.trim(),
      address: `${street}, ${city}, ${postcode}, ${country}`,
      lines,
      subtotal,
      shipping,
      discount,
      total,
    };

    setOrder(snapshot);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (order) {
    return (
      <div className="relative overflow-hidden bg-ink pb-24 pt-[128px]">
        <div aria-hidden className="pointer-events-none absolute inset-0 glow-orange opacity-50" />
        <div className="container-x relative z-10">
          <SectionLabel index="—">Order confirmed</SectionLabel>
          <h1 className="mt-6 font-display text-[clamp(3.4rem,9vw,8rem)] leading-[0.95] tracking-[-0.02em]">
            It&apos;s <span className="font-serif lowercase italic text-orange">yours.</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-bone/65">
            Thank you, {order.name.split(" ")[0] || "friend"}. Order{" "}
            <span className="text-bone">{order.number}</span> is confirmed. A receipt is on its
            way to {order.email || "your inbox"}. The atelier will hand-check the lace, box it
            in silk, and send tracking within 1–2 business days.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="border border-white/10 bg-white/[0.02] p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <p className="font-serif text-[12px] italic tracking-[0.02em] text-bone/60">Your pieces</p>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-orange text-ink">
                  <CheckIcon className="h-4 w-4" />
                </span>
              </div>
              <ul className="divide-y divide-white/10">
                {order.lines.map((line) => (
                  <li key={line.key} className="flex gap-4 py-4">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-ink-soft">
                      <Image src={line.image} alt={line.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{line.name}</p>
                        <p className="mt-1 font-serif text-[12px] italic tracking-[0.02em] text-bone/55">
                          {line.color} · {line.length}&quot; · Qty {line.qty}
                        </p>
                      </div>
                      <p className="shrink-0 text-xs text-bone/70">{formatPrice(line.price * line.qty)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="mt-2 space-y-2 border-t border-white/10 pt-4 text-xs">
                <div className="flex justify-between text-bone/60">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(order.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-bone/60">
                  <dt>Shipping</dt>
                  <dd>{order.shipping === 0 ? "Complimentary" : formatPrice(order.shipping)}</dd>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-orange">
                    <dt>Club discount</dt>
                    <dd>−{formatPrice(order.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/10 pt-3 text-base">
                  <dt>Total</dt>
                  <dd>{formatPrice(order.total)}</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col gap-6">
              <div className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">
                <p className="font-serif text-[12px] italic tracking-[0.02em] text-bone/60">Delivering to</p>
                <p className="mt-3 text-sm">{order.name}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-bone/60">{order.address}</p>
                <p className="mt-3 text-[11px] text-bone/55">{order.email}</p>
              </div>
              <div className="border border-orange/30 bg-orange/[0.06] p-5">
                <p className="inline-flex items-center gap-2 font-serif text-[12px] italic tracking-[0.02em] text-orange">
                  <SparkIcon className="h-3 w-3" /> What happens next
                </p>
                <p className="mt-3 text-[12px] leading-relaxed text-bone/65">
                  A stylist reviews your order, checks the hairline and density against your notes,
                  then signs the box. You&apos;ll receive tracking and a care card by email.
                </p>
              </div>
              <ButtonLink href="/#collection" size="lg" className="w-full justify-between">
                Keep shopping
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="container-x pb-24 pt-[128px]">
        <span className="skeleton-shimmer block h-4 w-32 rounded-full bg-white/5" />
        <span className="mt-6 block h-16 w-2/3 rounded-sm bg-white/5" />
        <span className="mt-4 block h-4 w-1/2 rounded-full bg-white/5" />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <span className="block h-80 rounded-sm border border-white/10 bg-white/[0.02]" />
          <span className="block h-80 rounded-sm border border-white/10 bg-white/[0.02]" />
        </div>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="relative overflow-hidden bg-ink pb-24 pt-[140px]">
        <div aria-hidden className="pointer-events-none absolute inset-0 glow-orange opacity-40" />
        <div className="container-x relative z-10 flex min-h-[60vh] flex-col items-start justify-center">
          <SectionLabel index="—">Checkout</SectionLabel>
          <h1 className="mt-6 font-display text-[clamp(3.2rem,8.4vw,7.4rem)] leading-[0.95] tracking-[-0.02em]">
            Nothing to
            <br />
            <span className="font-serif lowercase italic text-orange">check out.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-bone/65">
            Your bag is empty — for now. Start with the crown edit, or book a fitting and let
            the atelier build it around you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/#collection" size="md">
              Shop the collection
            </ButtonLink>
            <ButtonLink href="mailto:atelier@tchairs.com" variant="ghost" size="md">
              Book a fitting
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-ink pb-24 pt-[112px] sm:pb-28 lg:pt-[136px]">
      <div aria-hidden className="pointer-events-none absolute inset-0 glow-orange opacity-30" />

      <div className="container-x relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionLabel index="—">Checkout</SectionLabel>
            <h1 className="mt-5 font-display text-[clamp(3rem,6.6vw,6rem)] leading-[0.95] tracking-[-0.02em]">
              Almost <span className="font-serif lowercase italic text-orange">yours.</span>
            </h1>
          </div>
          <ol className="flex items-center gap-2 font-serif text-[12px] italic tracking-[0.02em] text-bone/50">
            <li className="text-orange">01 Bag</li>
            <li aria-hidden className="h-px w-5 bg-white/15" />
            <li className="text-bone/70">02 Details</li>
            <li aria-hidden className="h-px w-5 bg-white/15" />
            <li>03 Done</li>
          </ol>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <form id="checkout-form" onSubmit={placeOrder} className="order-2 lg:order-none">
            <section aria-labelledby="contact-title" className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <h2 id="contact-title" className="font-serif text-[15px] italic tracking-[0.02em]">
                  01 — Contact
                </h2>
                <span className="font-serif text-[12px] italic tracking-[0.02em] text-bone/45">Step 1 of 2</span>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@email.com" />
                <Field label="Phone" name="phone" type="tel" autoComplete="tel" required={false} placeholder="For delivery updates" inputMode="tel" />
              </div>
            </section>

            <section aria-labelledby="shipping-title" className="mt-9 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <h2 id="shipping-title" className="font-serif text-[15px] italic tracking-[0.02em]">
                  02 — Shipping
                </h2>
                <span className="font-serif text-[12px] italic tracking-[0.02em] text-bone/45">Step 2 of 2</span>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="First name" name="firstName" autoComplete="given-name" />
                <Field label="Last name" name="lastName" autoComplete="family-name" />
                <Field label="Address" name="address" autoComplete="address-line1" className="sm:col-span-2" placeholder="Street and number" />
                <Field label="Apartment, suite, etc." name="address2" autoComplete="address-line2" required={false} />
                <Field label="City" name="city" autoComplete="address-level2" />
                <Field label="Postcode" name="postcode" autoComplete="postal-code" />
                <label className="block">
                  <span className="text-[11px] tracking-[0.04em] text-bone/60">
                    Country<span className="text-orange"> *</span>
                  </span>
                  <select
                    name="country"
                    required
                    autoComplete="country-name"
                    defaultValue="United Kingdom"
                    className="input-line mt-1 text-sm"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country} className="bg-ink text-bone">
                        {country}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="mt-5 flex cursor-pointer items-start gap-3 text-[12px] leading-relaxed text-bone/65">
                <input
                  type="checkbox"
                  name="save"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#D9A79B]"
                  defaultChecked
                />
                Save my details and email me the occasional atelier note. No noise.
              </label>
            </section>

            <section aria-labelledby="payment-title" className="mt-9 border-t border-white/10 pt-6">
              <h2 id="payment-title" className="font-serif text-[15px] italic tracking-[0.02em]">
                03 — Payment
              </h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Payment method">
                {[
                  { id: "card" as Payment, label: "Card", note: "Visa · MC · Amex" },
                  { id: "klarna" as Payment, label: "Klarna", note: "4 × interest-free" },
                  { id: "apple" as Payment, label: "Apple Pay", note: "One touch" },
                ].map((option) => {
                  const active = payment === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setPayment(option.id)}
                      className={cn(
                        "border px-3.5 py-3 text-left transition-colors duration-300",
                        active
                          ? "border-orange bg-orange/10"
                          : "border-white/15 hover:border-bone/35",
                      )}
                    >
                      <span className="block text-[12px] font-medium tracking-[0.03em]">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-[10px] tracking-[0.02em] text-bone/45">
                        {option.note}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 flex items-center gap-2 border border-white/10 bg-white/[0.02] px-4 py-3 text-[10px] leading-relaxed tracking-[0.02em] text-bone/55">
                <SparkIcon className="h-3 w-3 shrink-0 text-orange" />
                Demo checkout — no card details are collected and no payment is processed.
              </p>
            </section>

            <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between gap-4 font-serif text-[12px] italic tracking-[0.02em] text-bone/45">
                <span>Encrypted · Secure · 30-day returns</span>
                <Link href="/#quality" className="transition-colors hover:text-orange">
                  Need help?
                </Link>
              </div>
              <Button type="submit" size="lg" arrow className="w-full justify-between lg:hidden">
                Place order — {formatPrice(total)}
              </Button>
              <p className="text-[10px] leading-relaxed tracking-[0.02em] text-bone/40">
                By placing your order you agree to our terms of sale and privacy policy. Duties
                are included for the UK, US and EU.
              </p>
            </div>
          </form>

          {/* Summary */}
          <aside className="order-1 lg:order-none lg:sticky lg:top-[104px] lg:self-start" aria-label="Order summary">
            <div className="border border-white/10 bg-ink-soft p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <p className="font-serif text-[13px] italic tracking-[0.02em] text-bone/65">
                  In your bag ({count})
                </p>
                <Link href="/#collection" className="text-[10px] tracking-[0.04em] text-orange hover:underline">
                  Edit
                </Link>
              </div>

              <ul className="divide-y divide-white/10">
                {lines.map((line) => (
                  <li key={line.key} className="flex gap-4 py-4">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-ink-soft">
                      <Image src={line.image} alt={line.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                      <div>
                        <Link href={`/product/${line.slug}`} className="text-[13px] font-medium hover:text-orange">
                          {line.name}
                        </Link>
                        <p className="mt-1 font-serif text-[12px] italic tracking-[0.02em] text-bone/55">
                          {line.color} · {line.length}&quot; · Qty {line.qty}
                        </p>
                      </div>
                      <p className="shrink-0 text-xs text-bone/70">{formatPrice(line.price * line.qty)}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <form onSubmit={applyPromo} className="mt-3 border-t border-white/10 pt-4">
                <label htmlFor="promo" className="text-[10px] tracking-[0.04em] text-bone/50">
                  Promo code
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="promo"
                    value={promo}
                    onChange={(event) => {
                      setPromo(event.target.value);
                      if (promoState !== "idle") setPromoState("idle");
                    }}
                    placeholder="CROWN10"
                    className="min-w-0 flex-1 border border-white/15 bg-transparent px-3 py-2.5 text-xs text-bone placeholder:text-bone/25 focus:border-orange focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 border border-white/15 px-4 text-[11px] tracking-[0.04em] text-bone/75 transition-colors hover:border-orange hover:text-orange"
                  >
                    Apply
                  </button>
                </div>
                {promoState === "applied" && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] tracking-[0.02em] text-orange">
                    <CheckIcon className="h-3 w-3" /> CROWN10 applied — 10% off
                  </p>
                )}
                {promoState === "invalid" && (
                  <p className="mt-2 text-[11px] tracking-[0.02em] text-bone/55" role="alert">
                    That code is not on the list.
                  </p>
                )}
              </form>

              <dl className="mt-4 space-y-2.5 border-t border-white/10 pt-4 text-xs">
                <div className="flex justify-between text-bone/60">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-bone/60">
                  <dt>Shipping</dt>
                  <dd>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-orange">
                    <dt>Club discount</dt>
                    <dd>−{formatPrice(discount)}</dd>
                  </div>
                )}
                <div className="flex items-end justify-between border-t border-white/10 pt-3">
                  <dt className="font-serif text-[13px] italic tracking-[0.02em] text-bone/65">Total</dt>
                  <dd className="font-display text-2xl leading-none">{formatPrice(total)}</dd>
                </div>
              </dl>

              <Button type="submit" form="checkout-form" size="lg" arrow className="mt-5 hidden w-full justify-between lg:flex">
                Place order
              </Button>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] tracking-[0.03em] text-bone/40">
                <span>Visa</span>
                <span>Mastercard</span>
                <span>Amex</span>
                <span>Klarna</span>
                <span>Apple Pay</span>
              </div>
            </div>

            <div className="mt-4">
              <Accordion
                items={[
                  {
                    title: "Shipping & delivery",
                    body: "Complimentary express shipping over $300; otherwise $18. Orders leave the London atelier in 1–2 business days. Made-to-order crowns take 10–14 days.",
                  },
                  {
                    title: "Returns",
                    body: "Unworn pieces can be returned within 30 days in their original silk box. Custom cuts and colour matches are final sale.",
                  },
                ]}
              />
            </div>

            <p className="mt-4 flex items-center gap-2 font-serif text-[12px] italic tracking-[0.02em] text-bone/45">
              <SparkIcon className="h-2.5 w-2.5 text-orange" /> A stylist checks every order before it ships.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
