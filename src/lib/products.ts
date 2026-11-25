export type Category = "wigs" | "extensions";
export type Texture = "straight" | "wavy" | "curly";
export type ColorName = "Jet" | "Espresso" | "Chestnut" | "Honey" | "Auburn";

export interface ColorOption {
  name: ColorName;
  hex: string;
}

export interface Product {
  slug: string;
  name: string;
  category: Category;
  tag?: "New" | "Bestseller" | "Icon";
  price: number;
  texture: Texture;
  length: number;
  lengths: number[];
  density: string;
  lace: string;
  hairType: string;
  colors: ColorName[];
  images: string[];
  alt: string;
  description: string;
  details: string[];
  featured?: boolean;
}

export const COLORS: ColorOption[] = [
  { name: "Jet", hex: "#0d0b09" },
  { name: "Espresso", hex: "#2a1a12" },
  { name: "Chestnut", hex: "#4a2b18" },
  { name: "Honey", hex: "#8a5a2b" },
  { name: "Auburn", hex: "#5a2114" },
];

export const colorHex = (name: string) =>
  COLORS.find((c) => c.name === name)?.hex ?? "#0d0b09";

export const TEXTURES: Array<{ label: string; value: Texture }> = [
  { label: "Straight", value: "straight" },
  { label: "Wavy", value: "wavy" },
  { label: "Curly", value: "curly" },
];

export const products: Product[] = [
  {
    slug: "midnight-silk",
    name: "Midnight Silk",
    category: "wigs",
    tag: "Bestseller",
    price: 1450,
    texture: "straight",
    length: 24,
    lengths: [16, 20, 24, 30],
    density: "180%",
    lace: "13×6 HD Lace",
    hairType: "Virgin Remy",
    colors: ["Jet", "Espresso", "Chestnut"],
    images: ["/images/product-straight.jpg", "/images/quality-lace.jpg", "/images/hero-editorial.jpg"],
    alt: "Glossy jet-black straight wig with a blunt fringe, photographed on a studio bust",
    description:
      "Our signature glass-silk fall. Cut from a single donor and aligned cuticle-to-tip, Midnight Silk moves like liquid and catches light like lacquer. Hand-knotted onto a 13×6 HD lace frontal for a hairline that disappears.",
    details: [
      "Single-donor virgin Remy hair, cuticle aligned",
      "13×6 transparent HD lace frontal, hand-knotted",
      "180% density · 24\" length · 320g",
      "Adjustable straps and four combs",
      "Hand-finished in our London atelier",
    ],
    featured: true,
  },
  {
    slug: "sienna-wave",
    name: "Sienna Wave",
    category: "wigs",
    tag: "New",
    price: 1390,
    texture: "wavy",
    length: 22,
    lengths: [18, 22, 26],
    density: "180%",
    lace: "13×4 HD Lace",
    hairType: "Virgin Remy",
    colors: ["Espresso", "Chestnut", "Honey"],
    images: ["/images/product-wavy.jpg", "/images/editorial-profile.jpg", "/images/quality-lace.jpg"],
    alt: "Long honey-blonde body-wave wig with soft, glossy waves",
    description:
      "A body wave with memory. Sienna is set on silk rollers for eight days, so the S-pattern falls back into place after every wear. Warm, glossy and improbably soft.",
    details: [
      "Single-donor virgin Remy hair, cuticle aligned",
      "13×4 transparent HD lace frontal",
      "180% density · 22\" length · 300g",
      "Steam-set body wave, heat safe to 180°C",
      "Hand-finished in our London atelier",
    ],
    featured: true,
  },
  {
    slug: "onyx-curl",
    name: "Onyx Curl",
    category: "wigs",
    tag: "Icon",
    price: 1520,
    texture: "curly",
    length: 20,
    lengths: [16, 20, 24],
    density: "200%",
    lace: "13×6 HD Lace",
    hairType: "Virgin Remy",
    colors: ["Jet", "Espresso", "Auburn"],
    images: ["/images/product-curly.jpg", "/images/quality-lace.jpg", "/images/atelier.jpg"],
    alt: "Voluminous black curly wig with defined, glossy ringlets",
    description:
      "Volume with a point of view. Each ringlet is hand-shaped around a 16mm rod, then brushed through for that lived-in, second-day perfection. 200% density, zero weight.",
    details: [
      "Single-donor virgin Remy hair, cuticle aligned",
      "13×6 transparent HD lace frontal",
      "200% density · 20\" length · 340g",
      "Hand-shaped 16mm ringlets",
      "Hand-finished in our London atelier",
    ],
    featured: true,
  },
  {
    slug: "noir-bob",
    name: "Noir Bob",
    category: "wigs",
    tag: "Bestseller",
    price: 980,
    texture: "straight",
    length: 12,
    lengths: [10, 12, 14],
    density: "160%",
    lace: "5×5 HD Closure",
    hairType: "Virgin Remy",
    colors: ["Jet", "Espresso"],
    images: ["/images/product-bob.jpg", "/images/atelier.jpg", "/images/editorial-profile.jpg"],
    alt: "Sharp blunt-cut jet black bob wig with a glass-like shine",
    description:
      "The cut is the statement. A blunt, collarbone-grazing bob with an immaculate fringe and a mirror finish. Weightless, graphic, and unbothered.",
    details: [
      "Single-donor virgin Remy hair, cuticle aligned",
      "5×5 HD lace closure",
      "160% density · 12\" length · 240g",
      "Precision blunt cut, hand-finished fringe",
      "Hand-finished in our London atelier",
    ],
    featured: true,
  },
  {
    slug: "atelier-bundle",
    name: "Atelier Bundle",
    category: "extensions",
    tag: "Bestseller",
    price: 420,
    texture: "straight",
    length: 18,
    lengths: [16, 18, 22, 26],
    density: "120g",
    lace: "Machine weft",
    hairType: "Virgin Remy",
    colors: ["Jet", "Espresso", "Chestnut", "Honey"],
    images: ["/images/extensions-bundles.jpg", "/images/quality-lace.jpg", "/images/hero-editorial.jpg"],
    alt: "Two hand-tied bundles of straight hair extensions in ash and espresso, boxed in the atelier",
    description:
      "The atelier standard, by the bundle. One donor, one direction, a lifetime of wear. Enough volume for a full head when paired with two or three.",
    details: [
      "100g per bundle · single donor, cuticle aligned",
      "Machine-sewn double weft",
      "18\" length · 120g per bundle",
      "Lifetime colour and heat safe",
      "Colour-matched by our atelier team",
    ],
    featured: true,
  },
  {
    slug: "seamless-clip-ins",
    name: "Seamless Clip-Ins",
    category: "extensions",
    tag: "New",
    price: 340,
    texture: "wavy",
    length: 20,
    lengths: [16, 20, 24],
    density: "7 wefts",
    lace: "Seamless base",
    hairType: "Remy",
    colors: ["Jet", "Espresso", "Chestnut", "Honey", "Auburn"],
    images: ["/images/extensions-clipins.jpg", "/images/product-wavy.jpg", "/images/quality-lace.jpg"],
    alt: "A blonde seamless clip-in hairpiece held up to show its weft",
    description:
      "Five minutes to a fuller head. Featherweight seamless wefts sit flat under the hair and disappear completely. Seven pieces, one silk pouch.",
    details: [
      "Seven seamless wefts · 140g total",
      "Gold-tone silicone-lined clips",
      "20\" body-wave length",
      "Heat safe to 180°C",
      "Silk travel pouch included",
    ],
  },
  {
    slug: "invisible-tape-ins",
    name: "Invisible Tape-Ins",
    category: "extensions",
    price: 480,
    texture: "straight",
    length: 22,
    lengths: [18, 22, 26],
    density: "40 strips",
    lace: "Invisible tape",
    hairType: "Remy",
    colors: ["Jet", "Espresso", "Chestnut"],
    images: ["/images/extensions-tapeins.jpg", "/images/editorial-profile.jpg", "/images/hero-editorial.jpg"],
    alt: "Tape-in extension wefts, keratin bonds and fitting pliers laid out in the atelier",
    description:
      "Bonded, not bulk. Forty ultra-thin strips lie completely flat against the scalp for a seamless, brushable finish that lasts eight weeks per install.",
    details: [
      "40 pre-taped strips · 100g total",
      "Medical-grade, latex-free adhesive",
      "22\" length · straight",
      "Up to 8 weeks per install",
      "Professional fitting recommended",
    ],
  },
  {
    slug: "coil-bundle-trio",
    name: "Coil Bundle Trio",
    category: "extensions",
    tag: "Icon",
    price: 460,
    texture: "curly",
    length: 18,
    lengths: [16, 18, 22],
    density: "3 bundles",
    lace: "Machine weft",
    hairType: "Virgin Remy",
    colors: ["Jet", "Espresso", "Auburn"],
    images: ["/images/product-curly.jpg", "/images/extensions-bundles.jpg", "/images/atelier.jpg"],
    alt: "Full, sculptural black coil extensions styled around a model's face",
    description:
      "A trio of spring-back coils, hand-rolled to match a natural 3C pattern. Blend them into your own texture or wear all three for a full, sculptural set.",
    details: [
      "Three bundles · 100g each",
      "Hand-rolled 3C coil pattern",
      "18\" length",
      "Single donor, cuticle aligned",
      "Colour-matched by our atelier team",
    ],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export const lengthLabel = (inches: number) => `${inches}"`;

export const priceForLength = (product: Product, length: number) => {
  const baseDiff = length - product.length;
  if (product.category === "extensions") {
    return Math.round(product.price + baseDiff * 12);
  }
  return Math.round(product.price + Math.max(0, baseDiff) * 38);
};
