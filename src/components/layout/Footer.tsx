import Link from "next/link";
import { InstagramIcon, TikTokIcon, SparkIcon } from "@/components/ui/icons";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All wigs", href: "/#collection" },
      { label: "Extensions", href: "/#extensions" },
      { label: "New arrivals", href: "/#collection" },
      { label: "Bestsellers", href: "/#collection" },
      { label: "The Crown Edit", href: "/#collection" },
    ],
  },
  {
    title: "Maison",
    links: [
      { label: "Our story", href: "/#story" },
      { label: "The standard", href: "/#quality" },
      { label: "The atelier", href: "/#story" },
      { label: "The club", href: "/#testimonials" },
      { label: "Private fittings", href: "mailto:atelier@tchairs.com" },
    ],
  },
  {
    title: "Client care",
    links: [
      { label: "Shipping & returns", href: "/#quality" },
      { label: "Hair care guide", href: "/#quality" },
      { label: "Size & density", href: "/#quality" },
      { label: "Track your order", href: "/checkout" },
      { label: "Contact", href: "mailto:atelier@tchairs.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink">
      <div className="container-x pb-8 pt-14 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1.8fr]">
          <div>
            <Link href="/" className="inline-flex items-baseline gap-2" aria-label="T&C Hairs home">
              <span className="font-display text-4xl leading-none tracking-[-0.03em]">T&C</span>
              <span className="font-serif text-[13px] italic tracking-[0.03em] text-bone/55">Hairs</span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-bone/65">
              Hand-finished wigs and extensions for people who wear their confidence first.
              Single-donor hair. London atelier. Worldwide.
            </p>
            <div className="mt-7 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="T&C Hairs on Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-bone/65 transition-colors duration-300 hover:border-orange hover:text-orange"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="T&C Hairs on TikTok"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-bone/65 transition-colors duration-300 hover:border-orange hover:text-orange"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
              <a
                href="mailto:atelier@tchairs.com"
                className="ml-2 font-serif text-[13px] italic tracking-[0.02em] text-bone/55 transition-colors hover:text-orange"
              >
                atelier@tchairs.com
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="eyebrow mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="link-underline text-[13px] text-bone/65 transition-colors duration-300 hover:text-bone"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[10px] tracking-[0.04em] text-bone/45">
          <span>© 2026 T&C Hairs. All rights reserved.</span>
          <span className="inline-flex items-center gap-2 text-bone/60">
            <SparkIcon className="h-2.5 w-2.5 text-orange" /> Made to be lived in
          </span>
          <div className="flex items-center gap-4">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
            <span>Klarna</span>
          </div>
        </div>
      </div>

      <div aria-hidden className="select-none overflow-hidden">
        <p className="display translate-y-[12%] whitespace-nowrap text-center text-[19vw] leading-[0.8] text-bone/[0.055]">
          T&C Hairs
        </p>
      </div>
    </footer>
  );
}
