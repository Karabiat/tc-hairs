import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SparkIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink pt-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 glow-orange" />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none font-display text-[38vw] leading-none text-bone/[0.04]"
      >
        404
      </span>

      <div className="container-x relative z-10 py-20">
        <SectionLabel index="404">Off the map</SectionLabel>
        <h1 className="mt-6 max-w-4xl font-display text-[clamp(3.4rem,9vw,8rem)] leading-[0.95] tracking-[-0.02em]">
          Lost your
          <br />
          <span className="font-serif lowercase italic text-orange">crown?</span>
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-bone/70">
          This page has been taken down, moved, or never existed. The edit is still
          exactly where you left it.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/" size="md">
            Back to the house
          </ButtonLink>
          <ButtonLink href="/#collection" variant="ghost" size="md">
            Shop the collection
          </ButtonLink>
        </div>
        <p className="mt-12 inline-flex items-center gap-2 font-serif text-[13px] italic tracking-[0.02em] text-bone/50">
          <SparkIcon className="h-2.5 w-2.5 text-orange" />
          If you were looking for a piece, email atelier@tchairs.com
        </p>
      </div>
    </div>
  );
}
