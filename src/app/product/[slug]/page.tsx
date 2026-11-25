import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getProduct, products } from "@/lib/products";
import { ProductView } from "@/components/product/ProductView";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowRight } from "@/components/ui/icons";

const BASE_URL = "https://tchairs.example.com";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: "Piece not found" };
  }

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} — T&C Hairs`,
      description: product.description,
      type: "website",
      images: [{ url: product.images[0], width: 1200, height: 1500, alt: product.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — T&C Hairs`,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const related = [
    ...products.filter((item) => item.category === product.category && item.slug !== product.slug),
    ...products.filter((item) => item.category !== product.category && item.slug !== product.slug),
  ].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((image) => `${BASE_URL}${image}`),
    description: product.description,
    sku: product.slug,
    brand: { "@type": "Brand", name: "T&C Hairs" },
    material: product.hairType,
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/product/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "312",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductView product={product} />

      <section aria-labelledby="related-title" className="border-t border-white/10 bg-ink">
        <div className="container-x py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel index="—">Complete the look</SectionLabel>
              <h2
                id="related-title"
                className="mt-5 font-display text-[clamp(2.8rem,5.5vw,5rem)] leading-[0.98] tracking-[-0.02em]"
              >
                More <span className="font-serif lowercase italic text-orange">crowns.</span>
              </h2>
            </div>
            <Link
              href={product.category === "wigs" ? "/#collection" : "/#extensions"}
              className="group inline-flex items-center gap-2 font-serif text-[13px] italic tracking-[0.02em] text-bone/60 transition-colors hover:text-orange"
            >
              View the edit
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <ProductCard key={item.slug} product={item} index={i} />
            ))}
          </div>

          <p className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-5 font-serif text-[12px] italic tracking-[0.02em] text-bone/45">
            <span>{product.name} — {formatPrice(product.price)}</span>
            <span className="text-orange">·</span>
            <span>{product.lace}</span>
            <span className="text-orange">·</span>
            <span>{product.hairType}</span>
            <span className="text-orange">·</span>
            <span>Hand-finished in London</span>
          </p>
        </div>
      </section>
    </>
  );
}
