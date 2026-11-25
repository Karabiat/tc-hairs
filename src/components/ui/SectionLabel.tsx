import { cn } from "@/lib/cn";

export function SectionLabel({
  index,
  children,
  className,
  light = false,
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span
        className={cn(
          "inline-flex h-7 min-w-7 items-center justify-center rounded-full border px-2 font-serif text-[12px] italic tracking-[0.02em]",
          light ? "border-ink/25 text-ink/70" : "border-bone/25 text-bone/65",
        )}
      >
        {index}
      </span>
      <span
        className={cn(
          "font-serif text-[15px] italic tracking-[0.01em] sm:text-base",
          light ? "text-ink/65" : "text-bone/60",
        )}
      >
        {children}
      </span>
    </div>
  );
}
