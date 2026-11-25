import { Hero } from "@/components/sections/Hero";
import { ScrollTextBand } from "@/components/ui/ScrollTextBand";
import { Story } from "@/components/sections/Story";
import { Quality } from "@/components/sections/Quality";
import { Collection } from "@/components/sections/Collection";
import { Extensions } from "@/components/sections/Extensions";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "T&C Hairs",
  url: "https://tchairs.example.com",
  logo: "https://tchairs.example.com/images/hero-editorial.jpg",
  description:
    "Hand-finished HD lace wigs and cuticle-aligned hair extensions, made in London.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressCountry: "GB",
  },
  sameAs: ["https://instagram.com", "https://tiktok.com"],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <Hero />
      <ScrollTextBand words={["T&C Hairs", "The Crown Edit"]} />
      <Story />
      <Quality />
      <Collection />
      <Extensions />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
