"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { colorHex, formatPrice, priceForLength, type Product } from "@/lib/products";
import { CheckIcon, PlusIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/**
 * Editorial product card. The image is a link; swatches and quick-add sit
 * above it as siblings so there is never a button inside an anchor.
 * Quick add uses the currently selected colour and the product's stock length.
 */
export function ProductCard({
  product,
  priority = false,
  index,
  className,
}: {
  product: Product;
  priority?: boolean;
  index?: number;
  className?: string;
}) {
  const { add } = useCart();
  const [color, setColor] = React.useState(product.colors[0]);
  const [added, setAdded] = React.useState(false);
  const timeout = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current);
    };
  }, []);

  const activeColor = product.colors.includes(color) ? color : product.colors[0];
  const price = priceForLength(product, product.length);
  const secondary = product.images[1] ?? product.images[0];

  const quickAdd = () => {
    add({
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      category: product.category,
      price,
      color: activeColor,
      length: product.length,
    });
    setAdded(true);
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-ink-soft">
        <Image
          src={product.images[0]}
          alt={product.alt}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 26vw, (min-width: 1024px) 32vw, (min-width: 640px) 52vw, 78vw"
          className="object-cover transition-[transform,opacity] duration-[1100ms] ease-expo group-hover:scale-[1.045] group-hover:opacity-0"
        />
        <Image
          src={secondary}
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 1280px) 26vw, (min-width: 1024px) 32vw, (min-width: 640px) 52vw, 78vw"
          className="object-cover opacity-0 transition-[transform,opacity] duration-[1100ms] ease-expo group-hover:scale-[1.03] group-hover:opacity-100"
        />

        {/* Deepen the bottom edge so the controls stay legible on any photo. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent"
        />

        <Link
          href={`/product/${product.slug}`}
          aria-label={`View ${product.name}`}
          data-cursor-label="VIEW"
          className="absolute inset-0 z-10"
        >
          <span className="sr-only">View {product.name}</span>
        </Link>

        {product.tag && (
          <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full border border-white/15 bg-ink/55 px-2.5 py-1 text-[8px] uppercase tracking-[0.2em] text-bone/80 backdrop-blur">
            {product.tag}
          </span>
        )}
        {typeof index === "number" && (
          <span className="pointer-events-none absolute right-3 top-3 z-20 text-[10px] tabular-nums tracking-[0.18em] text-bone/60">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}

        <div className="absolute inset-x-3 bottom-3 z-20 flex items-end justify-between gap-2">
          <div
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-ink/45 p-1.5 backdrop-blur transition-colors duration-500 group-hover:border-white/25"
            role="group"
            aria-label={`${product.name} colour`}
          >
            {product.colors.map((name) => {
              const selected = activeColor === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setColor(name)}
                  aria-label={`Colour: ${name}`}
                  aria-pressed={selected}
                  title={name}
                  data-cursor-label=""
                  className={cn(
                    "relative h-4 w-4 rounded-full ring-1 ring-inset ring-white/25 transition-transform duration-300 hover:scale-110 focus-visible:scale-110",
                    selected && "ring-2 ring-orange ring-offset-2 ring-offset-ink",
                  )}
                  style={{ backgroundColor: colorHex(name) }}
                >
                  <span className="sr-only">{name}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={quickAdd}
            aria-label={`Quick add ${product.name}, ${activeColor}, ${product.length} inch`}
            data-cursor-label="ADD"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-ink/55 text-bone backdrop-blur transition-colors duration-500 hover:border-orange hover:bg-orange hover:text-ink"
          >
            {added ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
          </button>
        </div>

        <AnimatePresence>
          {added && (
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute bottom-16 right-3 z-20 rounded-full bg-orange px-3 py-1.5 text-[10px] font-semibold tracking-[0.04em] text-ink"
            >
              Added to bag
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-serif text-[13px] italic tracking-[0.02em] text-bone/60">
            {product.category === "wigs" ? "Wig" : "Extension"} · {product.texture}
          </p>
          <h3 className="mt-1.5 truncate font-display text-[1.4rem] leading-[1.1] tracking-[-0.01em]">
            <Link href={`/product/${product.slug}`} className="transition-colors duration-300 hover:text-orange">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1.5 text-[11px] tracking-[0.03em] text-bone/55">
            {product.length}&quot; · {product.hairType} · {activeColor}
          </p>
        </div>
        <p className="shrink-0 pt-0.5 font-serif text-[15px] italic text-bone/85">{formatPrice(price)}</p>
      </div>
    </article>
  );
}
