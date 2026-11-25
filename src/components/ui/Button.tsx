"use client";

import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/cn";
import { ArrowUpRight } from "@/components/ui/icons";
import { Magnetic } from "@/components/ui/Magnetic";

type Variant = "solid" | "ghost" | "light" | "dark" | "orange-outline";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-medium leading-none tracking-[0.06em] transition-colors duration-500 ease-expo";

const variants: Record<Variant, string> = {
  solid: "bg-orange text-ink hover:bg-bone",
  ghost: "border border-bone/25 text-bone hover:border-orange hover:text-orange",
  light: "bg-bone text-ink hover:bg-orange",
  dark: "bg-ink text-bone hover:bg-orange hover:text-ink",
  "orange-outline": "border border-ink/25 text-ink hover:bg-ink hover:text-orange",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3.5 text-xs sm:px-7 sm:py-4 sm:text-[13px]",
  lg: "px-7 py-4 text-[13px] sm:px-9 sm:py-5 sm:text-sm",
};

interface SharedProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  arrow?: boolean;
  magnetic?: boolean;
}

function Inner({ children, arrow }: { children: React.ReactNode; arrow?: boolean }) {
  return (
    <>
      <span className="relative z-10">{children}</span>
      {arrow && (
        <span className="relative z-10 grid place-items-center">
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 translate-y-full rounded-full bg-current opacity-[0.08] transition-transform duration-700 ease-expo group-hover:translate-y-0"
      />
    </>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "solid",
  size = "md",
  className,
  arrow = true,
  magnetic = true,
  onClick,
  ...props
}: SharedProps & React.ComponentPropsWithoutRef<typeof Link>) {
  const link = (
    <Link
      href={href}
      onClick={onClick}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
  return magnetic ? <Magnetic strength={0.2}>{link}</Magnetic> : link;
}

export function Button({
  children,
  variant = "solid",
  size = "md",
  className,
  arrow = false,
  magnetic = true,
  ...props
}: SharedProps & React.ComponentPropsWithoutRef<"button">) {
  const button = (
    <button
      className={cn(base, variants[variant], sizes[size], "disabled:cursor-not-allowed disabled:opacity-40", className)}
      {...props}
    >
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
  return magnetic ? <Magnetic strength={0.18}>{button}</Magnetic> : button;
}
