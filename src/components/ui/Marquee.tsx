"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * CSS marquee with two identical halves; the animation translates exactly
 * -50% so the loop is seamless. Reduced-motion pauses it via globals.css.
 */
export function Marquee({
  children,
  speed = 46,
  reverse = false,
  pauseOnHover = false,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  innerClassName?: string;
}) {
  const content = <div className={cn("flex shrink-0 items-stretch", innerClassName)}>{children}</div>;

  return (
    <div className={cn("group relative w-full overflow-hidden", className)}>
      <div
        className={cn("flex w-max", reverse ? "animate-marquee-reverse" : "animate-marquee")}
        style={{ animationDuration: `${speed}s` }}
      >
        {content}
        <div aria-hidden className="flex shrink-0 items-stretch">
          {children}
        </div>
      </div>
      {pauseOnHover && <span className="absolute inset-0 hidden group-hover:block" />}
    </div>
  );
}
